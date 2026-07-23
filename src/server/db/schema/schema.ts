import {
	index,
	integer,
	serial,
	text,
	timestamp,
	uniqueIndex,
} from "drizzle-orm/pg-core";
import type { ReminderInput } from "@/core/reminders/reminder";
import { user } from "./authSchema";
import { createTable } from "./utils";

export const measurement = createTable(
	"measurement",
	{
		id: serial("id").primaryKey(),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		measuredAt: timestamp("measured_at", { withTimezone: true }).notNull(),
		systolic: integer("systolic").notNull(),
		diastolic: integer("diastolic").notNull(),
		pulse: integer("pulse"),
		notes: text("notes"),
		createdAt: timestamp("created_at", { withTimezone: true })
			.defaultNow()
			.notNull(),
		updatedAt: timestamp("updated_at", { withTimezone: true })
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull(),
	},
	(table) => [
		index("measurement_user_measured_idx").on(table.userId, table.measuredAt),
	],
);

export const reminder = createTable(
	"reminder",
	{
		id: serial("id").primaryKey(),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		type: text("type").$type<ReminderInput["type"]>().notNull(),
		time: text("time").notNull(),
		days: text("days").$type<ReminderInput["days"][number]>().array().notNull(),
		active: integer("active").default(1).notNull(),
		createdAt: timestamp("created_at", { withTimezone: true })
			.defaultNow()
			.notNull(),
		updatedAt: timestamp("updated_at", { withTimezone: true })
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull(),
	},
	(table) => [index("reminder_user_idx").on(table.userId)],
);

export const calendarConnection = createTable(
	"calendar_connection",
	{
		id: serial("id").primaryKey(),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		provider: text("provider").$type<"google">().notNull(),
		externalCalendarId: text("external_calendar_id"),
		timeZone: text("time_zone").notNull(),
		status: text("status")
			.$type<"authorizing" | "connected" | "error">()
			.default("authorizing")
			.notNull(),
		lastError: text("last_error"),
		lastSyncedAt: timestamp("last_synced_at", { withTimezone: true }),
		createdAt: timestamp("created_at", { withTimezone: true })
			.defaultNow()
			.notNull(),
		updatedAt: timestamp("updated_at", { withTimezone: true })
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull(),
	},
	(table) => [
		uniqueIndex("calendar_connection_user_provider_idx").on(
			table.userId,
			table.provider,
		),
	],
);

export const reminderCalendarEvent = createTable(
	"reminder_calendar_event",
	{
		id: serial("id").primaryKey(),
		reminderId: integer("reminder_id")
			.notNull()
			.references(() => reminder.id, { onDelete: "cascade" }),
		connectionId: integer("connection_id")
			.notNull()
			.references(() => calendarConnection.id, { onDelete: "cascade" }),
		externalEventId: text("external_event_id"),
		syncStatus: text("sync_status")
			.$type<"pending" | "synced" | "error">()
			.default("pending")
			.notNull(),
		lastError: text("last_error"),
		updatedAt: timestamp("updated_at", { withTimezone: true })
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull(),
	},
	(table) => [
		uniqueIndex("reminder_calendar_event_reminder_connection_idx").on(
			table.reminderId,
			table.connectionId,
		),
	],
);

export const profile = createTable("profile", {
	userId: text("user_id")
		.primaryKey()
		.references(() => user.id, { onDelete: "cascade" }),
	dateOfBirth: text("date_of_birth"),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull(),
});

export type MeasurementRecord = typeof measurement.$inferSelect;
export type ReminderRecord = typeof reminder.$inferSelect;
export type CalendarConnectionRecord = typeof calendarConnection.$inferSelect;
export type ReminderCalendarEventRecord =
	typeof reminderCalendarEvent.$inferSelect;
export type ProfileRecord = typeof profile.$inferSelect;
