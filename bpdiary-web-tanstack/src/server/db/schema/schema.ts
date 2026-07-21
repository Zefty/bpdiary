import { index, integer, serial, text, timestamp } from "drizzle-orm/pg-core";
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
		type: text("type").$type<"blood-pressure" | "medication">().notNull(),
		time: text("time").notNull(),
		days: text("days").array().notNull(),
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

export const profile = createTable("profile", {
	userId: text("user_id")
		.primaryKey()
		.references(() => user.id, { onDelete: "cascade" }),
	dateOfBirth: text("date_of_birth"),
	timezone: text("timezone").default("UTC").notNull(),
	theme: text("theme")
		.$type<"light" | "dark" | "system">()
		.default("system")
		.notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull(),
});

export type MeasurementRecord = typeof measurement.$inferSelect;
export type ReminderRecord = typeof reminder.$inferSelect;
export type ProfileRecord = typeof profile.$inferSelect;
