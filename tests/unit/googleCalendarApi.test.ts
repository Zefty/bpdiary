import { afterEach, describe, expect, it, vi } from "vitest";
import {
	deleteGoogleCalendar,
	GoogleCalendarApiError,
} from "@/server/calendar/googleCalendarApi";

describe("Google Calendar API", () => {
	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it("deletes an encoded secondary calendar", async () => {
		const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
			new Response(null, {
				status: 204,
			}),
		);
		vi.stubGlobal("fetch", fetchMock);

		await deleteGoogleCalendar("access-token", "calendar/id@example.com");

		expect(fetchMock).toHaveBeenCalledWith(
			"https://www.googleapis.com/calendar/v3/calendars/calendar%2Fid%40example.com",
			expect.objectContaining({
				method: "DELETE",
				headers: expect.objectContaining({
					Authorization: "Bearer access-token",
				}),
			}),
		);
	});

	it.each([
		404, 410,
	])("treats an already removed calendar (%i) as deleted", async (status) => {
		vi.stubGlobal(
			"fetch",
			vi.fn<typeof fetch>().mockResolvedValue(new Response(null, { status })),
		);

		await expect(
			deleteGoogleCalendar("access-token", "missing-calendar"),
		).resolves.toBeUndefined();
	});

	it("surfaces other Google Calendar failures", async () => {
		vi.stubGlobal(
			"fetch",
			vi
				.fn<typeof fetch>()
				.mockResolvedValue(new Response(null, { status: 500 })),
		);

		await expect(
			deleteGoogleCalendar("access-token", "calendar-id"),
		).rejects.toBeInstanceOf(GoogleCalendarApiError);
	});
});
