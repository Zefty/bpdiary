import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/server/db";
import { calendarConnection, reminderCalendarEvent } from "@/server/db/schema";
import { serverEnv } from "@/server/lib/serverEnv";
import { authMiddleware } from "@/server/middlewares/auth";
import {
	completeGoogleCalendarConnection,
	disconnectGoogleCalendar as disconnectCalendar,
	isValidTimeZone,
	prepareGoogleCalendarConnection as prepareConnection,
} from "./calendarSync";

const timeZoneSchema = z.object({
	timeZone: z.string().refine(isValidTimeZone, "Invalid time zone"),
});

const disconnectSchema = z.object({
	deleteLocalReminders: z.boolean(),
});

export const getGoogleCalendarConnection = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.handler(async ({ context }) => {
		const [connection] = await db
			.select()
			.from(calendarConnection)
			.where(eq(calendarConnection.userId, context.user.id))
			.limit(1);

		if (!connection) {
			return {
				available: Boolean(
					serverEnv.GOOGLE_CLIENT_ID && serverEnv.GOOGLE_CLIENT_SECRET,
				),
				hasConnection: false,
				status: "disconnected" as const,
				syncedReminders: 0,
				failedReminders: 0,
				lastError: null,
				lastSyncedAt: null,
			};
		}

		const events = await db
			.select({ syncStatus: reminderCalendarEvent.syncStatus })
			.from(reminderCalendarEvent)
			.where(eq(reminderCalendarEvent.connectionId, connection.id));

		return {
			available: true,
			hasConnection: true,
			status: connection.status,
			syncedReminders: events.filter((event) => event.syncStatus === "synced")
				.length,
			failedReminders: events.filter((event) => event.syncStatus === "error")
				.length,
			lastError: connection.lastError,
			lastSyncedAt: connection.lastSyncedAt,
		};
	});

export const prepareGoogleCalendarConnection = createServerFn({
	method: "POST",
})
	.validator(timeZoneSchema.parse)
	.middleware([authMiddleware])
	.handler(({ data, context }) =>
		prepareConnection(context.user.id, data.timeZone),
	);

export const retryGoogleCalendarSync = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.handler(({ context }) =>
		completeGoogleCalendarConnection(context.user.id, context.requestHeaders),
	);

export const disconnectGoogleCalendar = createServerFn({ method: "POST" })
	.validator(disconnectSchema.parse)
	.middleware([authMiddleware])
	.handler(({ data, context }) =>
		disconnectCalendar(
			context.user.id,
			data.deleteLocalReminders,
			context.requestHeaders,
		),
	);
