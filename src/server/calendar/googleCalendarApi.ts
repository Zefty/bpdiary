import type { GoogleCalendarEventInput } from "@/core/calendar/reminderCalendarEvent";

const GOOGLE_CALENDAR_API = "https://www.googleapis.com/calendar/v3";

export const GOOGLE_CALENDAR_SCOPE =
	"https://www.googleapis.com/auth/calendar.app.created";

export class GoogleCalendarApiError extends Error {
	constructor(
		message: string,
		readonly status: number,
	) {
		super(message);
		this.name = "GoogleCalendarApiError";
	}
}

async function calendarFetch<T>(
	accessToken: string,
	path: string,
	init: RequestInit,
): Promise<T> {
	const response = await fetch(`${GOOGLE_CALENDAR_API}${path}`, {
		...init,
		signal: init.signal ?? AbortSignal.timeout(10_000),
		headers: {
			Authorization: `Bearer ${accessToken}`,
			"Content-Type": "application/json",
			...init.headers,
		},
	});

	if (!response.ok) {
		throw new GoogleCalendarApiError(
			`Google Calendar request failed (${response.status})`,
			response.status,
		);
	}

	if (response.status === 204) return undefined as T;
	return (await response.json()) as T;
}

export async function createGoogleCalendar(
	accessToken: string,
	timeZone: string,
) {
	return calendarFetch<{ id: string }>(accessToken, "/calendars", {
		method: "POST",
		body: JSON.stringify({
			summary: "BP Diary Reminders",
			description: "Reminders created and managed by BP Diary.",
			timeZone,
		}),
	});
}

export async function deleteGoogleCalendar(
	accessToken: string,
	calendarId: string,
) {
	try {
		await calendarFetch<void>(
			accessToken,
			`/calendars/${encodeURIComponent(calendarId)}`,
			{ method: "DELETE" },
		);
	} catch (error) {
		if (
			error instanceof GoogleCalendarApiError &&
			(error.status === 404 || error.status === 410)
		) {
			return;
		}
		throw error;
	}
}

export async function upsertGoogleCalendarEvent(
	accessToken: string,
	calendarId: string,
	event: GoogleCalendarEventInput,
	externalEventId?: string | null,
) {
	const encodedCalendarId = encodeURIComponent(calendarId);
	const eventId = externalEventId ?? event.id;
	const encodedEventId = encodeURIComponent(eventId);
	const { id: _eventId, ...eventPatch } = event;

	if (externalEventId) {
		try {
			return await calendarFetch<{ id: string }>(
				accessToken,
				`/calendars/${encodedCalendarId}/events/${encodedEventId}`,
				{ method: "PATCH", body: JSON.stringify(eventPatch) },
			);
		} catch (error) {
			if (!(error instanceof GoogleCalendarApiError) || error.status !== 404) {
				throw error;
			}
		}
	}

	try {
		return await calendarFetch<{ id: string }>(
			accessToken,
			`/calendars/${encodedCalendarId}/events`,
			{ method: "POST", body: JSON.stringify(event) },
		);
	} catch (error) {
		if (!(error instanceof GoogleCalendarApiError) || error.status !== 409) {
			throw error;
		}

		return calendarFetch<{ id: string }>(
			accessToken,
			`/calendars/${encodedCalendarId}/events/${encodeURIComponent(event.id)}`,
			{ method: "PATCH", body: JSON.stringify(eventPatch) },
		);
	}
}

export async function deleteGoogleCalendarEvent(
	accessToken: string,
	calendarId: string,
	eventId: string,
) {
	try {
		await calendarFetch<void>(
			accessToken,
			`/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(eventId)}`,
			{ method: "DELETE" },
		);
	} catch (error) {
		if (
			error instanceof GoogleCalendarApiError &&
			(error.status === 404 || error.status === 410)
		) {
			return;
		}
		throw error;
	}
}
