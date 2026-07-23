import { describe, expect, it } from "vitest";
import { buildGoogleCalendarEvent } from "@/core/calendar/reminderCalendarEvent";

describe("reminder calendar event", () => {
	it("creates a weekly recurring event on the next selected day", () => {
		const event = buildGoogleCalendarEvent(
			{
				id: 42,
				type: "blood-pressure",
				time: "08:30",
				days: ["Wed", "Mon"],
			},
			"UTC",
			new Date("2026-07-21T10:00:00Z"),
		);

		expect(event).toMatchObject({
			id: "bpdr0000002a",
			summary: "Blood pressure reminder",
			start: { dateTime: "2026-07-22T08:30:00", timeZone: "UTC" },
			end: { dateTime: "2026-07-22T08:35:00", timeZone: "UTC" },
			recurrence: ["RRULE:FREQ=WEEKLY;BYDAY=MO,WE"],
			reminders: {
				useDefault: false,
				overrides: [{ method: "popup", minutes: 0 }],
			},
		});
	});

	it("uses today when its reminder time has not passed", () => {
		const event = buildGoogleCalendarEvent(
			{
				id: 1,
				type: "medication",
				time: "23:58",
				days: ["Tue"],
			},
			"UTC",
			new Date("2026-07-21T10:00:00Z"),
		);

		expect(event.start.dateTime).toBe("2026-07-21T23:58:00");
		expect(event.end.dateTime).toBe("2026-07-22T00:03:00");
	});

	it("moves today's occurrence to next week after its time has passed", () => {
		const event = buildGoogleCalendarEvent(
			{
				id: 1,
				type: "medication",
				time: "09:00",
				days: ["Tue"],
			},
			"UTC",
			new Date("2026-07-21T10:00:00Z"),
		);

		expect(event.start.dateTime).toBe("2026-07-28T09:00:00");
	});
});
