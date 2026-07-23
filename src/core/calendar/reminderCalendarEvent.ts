import type { ReminderInput } from "@/core/reminders/reminder";

export type ReminderCalendarSource = Pick<
	ReminderInput,
	"type" | "time" | "days"
> & { id: number };

const weekdayCodes = {
	Sun: "SU",
	Mon: "MO",
	Tue: "TU",
	Wed: "WE",
	Thu: "TH",
	Fri: "FR",
	Sat: "SA",
} as const;

const weekdayIndexes = {
	Sun: 0,
	Mon: 1,
	Tue: 2,
	Wed: 3,
	Thu: 4,
	Fri: 5,
	Sat: 6,
} as const;

type LocalDateParts = {
	year: number;
	month: number;
	day: number;
	hour: number;
	minute: number;
};

export type GoogleCalendarEventInput = {
	id: string;
	summary: string;
	description: string;
	start: { dateTime: string; timeZone: string };
	end: { dateTime: string; timeZone: string };
	recurrence: [string];
	reminders: {
		useDefault: false;
		overrides: [{ method: "popup"; minutes: 0 }];
	};
	transparency: "transparent";
	extendedProperties: {
		private: { bpDiaryReminderId: string };
	};
};

const pad = (value: number) => String(value).padStart(2, "0");

function formatLocalDateTime(
	year: number,
	month: number,
	day: number,
	hour: number,
	minute: number,
) {
	return `${year}-${pad(month)}-${pad(day)}T${pad(hour)}:${pad(minute)}:00`;
}

function getLocalDateParts(now: Date, timeZone: string): LocalDateParts {
	const parts = new Intl.DateTimeFormat("en-CA", {
		timeZone,
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		hourCycle: "h23",
	}).formatToParts(now);
	const values = Object.fromEntries(
		parts.map((part) => [part.type, part.value]),
	);

	return {
		year: Number(values.year),
		month: Number(values.month),
		day: Number(values.day),
		hour: Number(values.hour),
		minute: Number(values.minute),
	};
}

function getFirstOccurrence(
	days: ReminderCalendarSource["days"],
	time: string,
	timeZone: string,
	now: Date,
) {
	const localNow = getLocalDateParts(now, timeZone);
	const [reminderHour, reminderMinute] = time.split(":").map(Number);
	const today = new Date(
		Date.UTC(localNow.year, localNow.month - 1, localNow.day),
	);
	const selectedDays = new Set<number>(days.map((day) => weekdayIndexes[day]));
	const reminderMinutes = reminderHour * 60 + reminderMinute;
	const currentMinutes = localNow.hour * 60 + localNow.minute;

	for (let offset = 0; offset <= 7; offset += 1) {
		const candidate = new Date(today);
		candidate.setUTCDate(candidate.getUTCDate() + offset);
		if (!selectedDays.has(candidate.getUTCDay())) continue;
		if (offset === 0 && reminderMinutes <= currentMinutes) continue;

		return {
			year: candidate.getUTCFullYear(),
			month: candidate.getUTCMonth() + 1,
			day: candidate.getUTCDate(),
			hour: reminderHour,
			minute: reminderMinute,
		};
	}

	throw new Error("A reminder must contain at least one valid day");
}

export function buildGoogleCalendarEvent(
	reminder: ReminderCalendarSource,
	timeZone: string,
	now = new Date(),
): GoogleCalendarEventInput {
	const start = getFirstOccurrence(reminder.days, reminder.time, timeZone, now);
	const end = new Date(
		Date.UTC(
			start.year,
			start.month - 1,
			start.day,
			start.hour,
			start.minute + 5,
		),
	);
	const recurrenceDays = [...reminder.days]
		.sort((left, right) => weekdayIndexes[left] - weekdayIndexes[right])
		.map((day) => weekdayCodes[day])
		.join(",");

	return {
		id: `bpdr${reminder.id.toString(16).padStart(8, "0")}`,
		summary:
			reminder.type === "medication"
				? "Medication reminder"
				: "Blood pressure reminder",
		description: "Created by BP Diary.",
		start: {
			dateTime: formatLocalDateTime(
				start.year,
				start.month,
				start.day,
				start.hour,
				start.minute,
			),
			timeZone,
		},
		end: {
			dateTime: formatLocalDateTime(
				end.getUTCFullYear(),
				end.getUTCMonth() + 1,
				end.getUTCDate(),
				end.getUTCHours(),
				end.getUTCMinutes(),
			),
			timeZone,
		},
		recurrence: [`RRULE:FREQ=WEEKLY;BYDAY=${recurrenceDays}`],
		reminders: {
			useDefault: false,
			overrides: [{ method: "popup", minutes: 0 }],
		},
		transparency: "transparent",
		extendedProperties: {
			private: { bpDiaryReminderId: String(reminder.id) },
		},
	};
}
