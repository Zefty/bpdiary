import { and, eq } from "drizzle-orm";
import { buildGoogleCalendarEvent } from "@/core/calendar/reminderCalendarEvent";
import { auth } from "@/server/auth";
import { db } from "@/server/db";
import {
	type CalendarConnectionRecord,
	calendarConnection,
	type ReminderRecord,
	reminder,
	reminderCalendarEvent,
} from "@/server/db/schema";
import {
	createGoogleCalendar,
	deleteGoogleCalendar,
	deleteGoogleCalendarEvent,
	GOOGLE_CALENDAR_SCOPE,
	upsertGoogleCalendarEvent,
} from "./googleCalendarApi";

const provider = "google" as const;

export class GoogleCalendarAuthorizationError extends Error {
	constructor() {
		super("Google Calendar authorization is required");
		this.name = "GoogleCalendarAuthorizationError";
	}
}

export function isValidTimeZone(timeZone: string) {
	try {
		new Intl.DateTimeFormat("en-AU", { timeZone }).format();
		return true;
	} catch {
		return false;
	}
}

async function getGoogleAccessToken(headers: Headers) {
	try {
		const authHeaders = new Headers(headers);
		const cookie = authHeaders.get("cookie");
		if (cookie) {
			authHeaders.set(
				"cookie",
				cookie
					.split(";")
					.filter(
						(entry) => !entry.trim().split("=", 1)[0]?.includes("account_data"),
					)
					.join(";"),
			);
		}
		const tokens = await auth.api.getAccessToken({
			headers: authHeaders,
			body: { providerId: provider },
		});
		if (
			!tokens.accessToken ||
			!tokens.scopes?.includes(GOOGLE_CALENDAR_SCOPE)
		) {
			throw new GoogleCalendarAuthorizationError();
		}
		return tokens.accessToken;
	} catch (error) {
		if (error instanceof GoogleCalendarAuthorizationError) throw error;
		throw new GoogleCalendarAuthorizationError();
	}
}

async function findGoogleConnection(userId: string) {
	const [connection] = await db
		.select()
		.from(calendarConnection)
		.where(
			and(
				eq(calendarConnection.userId, userId),
				eq(calendarConnection.provider, provider),
			),
		)
		.limit(1);
	return connection;
}

export async function prepareGoogleCalendarConnection(
	userId: string,
	timeZone: string,
) {
	if (!isValidTimeZone(timeZone)) throw new Error("Invalid time zone");

	const [connection] = await db
		.insert(calendarConnection)
		.values({ userId, provider, timeZone, status: "authorizing" })
		.onConflictDoUpdate({
			target: [calendarConnection.userId, calendarConnection.provider],
			set: {
				timeZone,
				status: "authorizing",
				lastError: null,
				updatedAt: new Date(),
			},
		})
		.returning();
	return connection;
}

function userFacingSyncError(error: unknown) {
	return error instanceof GoogleCalendarAuthorizationError
		? "Reconnect Google Calendar to resume reminder syncing."
		: "Google Calendar could not be updated. Try syncing again.";
}

async function recordConnectionError(connectionId: number, message: string) {
	await db
		.update(calendarConnection)
		.set({ status: "error", lastError: message, updatedAt: new Date() })
		.where(eq(calendarConnection.id, connectionId));
}

function userFacingDisconnectError(error: unknown) {
	return error instanceof GoogleCalendarAuthorizationError
		? "Reconnect Google Calendar before disconnecting so BP Diary can delete its calendar."
		: "BP Diary could not delete its Google Calendar. Try again.";
}

async function syncReminderWithToken(
	connection: CalendarConnectionRecord & { externalCalendarId: string },
	reminderRecord: ReminderRecord,
	accessToken: string,
) {
	const [existing] = await db
		.select()
		.from(reminderCalendarEvent)
		.where(
			and(
				eq(reminderCalendarEvent.reminderId, reminderRecord.id),
				eq(reminderCalendarEvent.connectionId, connection.id),
			),
		)
		.limit(1);

	if (!reminderRecord.active) {
		if (existing?.externalEventId) {
			await deleteGoogleCalendarEvent(
				accessToken,
				connection.externalCalendarId,
				existing.externalEventId,
			);
		}
		if (existing) {
			await db
				.delete(reminderCalendarEvent)
				.where(eq(reminderCalendarEvent.id, existing.id));
		}
		return { status: "synced" as const };
	}

	const [pending] = await db
		.insert(reminderCalendarEvent)
		.values({
			reminderId: reminderRecord.id,
			connectionId: connection.id,
			externalEventId: existing?.externalEventId,
			syncStatus: "pending",
		})
		.onConflictDoUpdate({
			target: [
				reminderCalendarEvent.reminderId,
				reminderCalendarEvent.connectionId,
			],
			set: { syncStatus: "pending", lastError: null, updatedAt: new Date() },
		})
		.returning();

	try {
		const event = await upsertGoogleCalendarEvent(
			accessToken,
			connection.externalCalendarId,
			buildGoogleCalendarEvent(reminderRecord, connection.timeZone),
			existing?.externalEventId,
		);
		await db
			.update(reminderCalendarEvent)
			.set({
				externalEventId: event.id,
				syncStatus: "synced",
				lastError: null,
				updatedAt: new Date(),
			})
			.where(eq(reminderCalendarEvent.id, pending.id));
		return { status: "synced" as const };
	} catch (error) {
		const message = userFacingSyncError(error);
		await db
			.update(reminderCalendarEvent)
			.set({ syncStatus: "error", lastError: message, updatedAt: new Date() })
			.where(eq(reminderCalendarEvent.id, pending.id));
		return { status: "error" as const, message };
	}
}

export async function completeGoogleCalendarConnection(
	userId: string,
	headers: Headers,
) {
	const connection = await findGoogleConnection(userId);
	if (!connection) throw new Error("Calendar connection was not prepared");

	try {
		const accessToken = await getGoogleAccessToken(headers);
		let externalCalendarId = connection.externalCalendarId;
		if (!externalCalendarId) {
			const created = await createGoogleCalendar(
				accessToken,
				connection.timeZone,
			);
			externalCalendarId = created.id;
		}

		const connected = {
			...connection,
			externalCalendarId,
			status: "connected" as const,
		};
		await db
			.update(calendarConnection)
			.set({
				externalCalendarId,
				status: "connected",
				lastError: null,
				updatedAt: new Date(),
			})
			.where(eq(calendarConnection.id, connection.id));

		const reminderRecords = await db
			.select()
			.from(reminder)
			.where(eq(reminder.userId, userId));
		let failed = 0;
		for (const reminderRecord of reminderRecords) {
			const result = await syncReminderWithToken(
				connected,
				reminderRecord,
				accessToken,
			);
			if (result.status === "error") failed += 1;
		}

		const lastSyncedAt = new Date();
		await db
			.update(calendarConnection)
			.set({
				status: failed ? "error" : "connected",
				lastError: failed
					? `${failed} reminder${failed === 1 ? "" : "s"} could not be synced.`
					: null,
				lastSyncedAt,
				updatedAt: lastSyncedAt,
			})
			.where(eq(calendarConnection.id, connection.id));

		return { synced: reminderRecords.length - failed, failed };
	} catch (error) {
		await recordConnectionError(connection.id, userFacingSyncError(error));
		throw error;
	}
}

export async function syncReminderToGoogleCalendar(
	userId: string,
	reminderRecord: ReminderRecord,
	headers: Headers,
) {
	const connection = await findGoogleConnection(userId);
	if (!connection?.externalCalendarId || connection.status === "authorizing") {
		return { status: "not-connected" as const };
	}

	try {
		const accessToken = await getGoogleAccessToken(headers);
		const result = await syncReminderWithToken(
			{ ...connection, externalCalendarId: connection.externalCalendarId },
			reminderRecord,
			accessToken,
		);
		if (result.status === "error") {
			await recordConnectionError(connection.id, result.message);
		} else {
			await db
				.update(calendarConnection)
				.set({
					status: "connected",
					lastError: null,
					lastSyncedAt: new Date(),
					updatedAt: new Date(),
				})
				.where(eq(calendarConnection.id, connection.id));
		}
		return result;
	} catch (error) {
		const message = userFacingSyncError(error);
		await recordConnectionError(connection.id, message);
		return { status: "error" as const, message };
	}
}

export async function disconnectGoogleCalendar(
	userId: string,
	deleteLocalReminders: boolean,
	headers: Headers,
) {
	const connection = await findGoogleConnection(userId);
	if (!connection) {
		return { remindersDeleted: false };
	}

	if (connection.externalCalendarId) {
		try {
			const accessToken = await getGoogleAccessToken(headers);
			await deleteGoogleCalendar(accessToken, connection.externalCalendarId);
		} catch (error) {
			const message = userFacingDisconnectError(error);
			await recordConnectionError(connection.id, message);
			throw new Error(message);
		}
	}

	await db.transaction(async (tx) => {
		if (deleteLocalReminders) {
			await tx.delete(reminder).where(eq(reminder.userId, userId));
		}
		await tx
			.delete(calendarConnection)
			.where(
				and(
					eq(calendarConnection.id, connection.id),
					eq(calendarConnection.userId, userId),
				),
			);
	});

	return { remindersDeleted: deleteLocalReminders };
}

export async function deleteReminderFromGoogleCalendar(
	userId: string,
	reminderId: number,
	headers: Headers,
) {
	const connection = await findGoogleConnection(userId);
	if (!connection?.externalCalendarId) return;

	const [event] = await db
		.select()
		.from(reminderCalendarEvent)
		.where(
			and(
				eq(reminderCalendarEvent.reminderId, reminderId),
				eq(reminderCalendarEvent.connectionId, connection.id),
			),
		)
		.limit(1);
	if (!event?.externalEventId) return;

	try {
		const accessToken = await getGoogleAccessToken(headers);
		await deleteGoogleCalendarEvent(
			accessToken,
			connection.externalCalendarId,
			event.externalEventId,
		);
		await db
			.delete(reminderCalendarEvent)
			.where(eq(reminderCalendarEvent.id, event.id));
	} catch (error) {
		const message = userFacingSyncError(error);
		await recordConnectionError(connection.id, message);
		throw new Error(
			"The reminder was not deleted because its Google Calendar event could not be removed.",
		);
	}
}
