import { createServerFn } from "@tanstack/react-start";
import { and, asc, eq, getTableColumns } from "drizzle-orm";
import {
	reminderIdSchema,
	reminderInputSchema,
} from "@/core/reminders/reminder";
import {
	deleteReminderFromGoogleCalendar,
	syncReminderToGoogleCalendar,
} from "@/server/calendar/calendarSync";
import { db } from "@/server/db";
import { reminder, reminderCalendarEvent } from "@/server/db/schema";
import { authMiddleware } from "@/server/middlewares/auth";

export const listReminders = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.handler(async ({ context }) =>
		db
			.select({
				...getTableColumns(reminder),
				calendarSyncStatus: reminderCalendarEvent.syncStatus,
				calendarSyncError: reminderCalendarEvent.lastError,
			})
			.from(reminder)
			.leftJoin(
				reminderCalendarEvent,
				eq(reminderCalendarEvent.reminderId, reminder.id),
			)
			.where(eq(reminder.userId, context.user.id))
			.orderBy(asc(reminder.time)),
	);

export const saveReminder = createServerFn({ method: "POST" })
	.validator(reminderInputSchema.parse)
	.middleware([authMiddleware])
	.handler(async ({ data, context }) => {
		if (data.id) {
			const [updated] = await db
				.update(reminder)
				.set({
					type: data.type,
					time: data.time,
					days: data.days,
					active: data.active ? 1 : 0,
					updatedAt: new Date(),
				})
				.where(
					and(eq(reminder.id, data.id), eq(reminder.userId, context.user.id)),
				)
				.returning();
			if (!updated) throw new Error("Reminder not found");
			await syncReminderToGoogleCalendar(
				context.user.id,
				updated,
				context.requestHeaders,
			);
			return updated;
		}

		const [created] = await db
			.insert(reminder)
			.values({
				userId: context.user.id,
				type: data.type,
				time: data.time,
				days: data.days,
				active: data.active ? 1 : 0,
			})
			.returning();
		await syncReminderToGoogleCalendar(
			context.user.id,
			created,
			context.requestHeaders,
		);
		return created;
	});

export const deleteReminder = createServerFn({ method: "POST" })
	.validator(reminderIdSchema.parse)
	.middleware([authMiddleware])
	.handler(async ({ data, context }) => {
		const [existing] = await db
			.select({ id: reminder.id })
			.from(reminder)
			.where(
				and(eq(reminder.id, data.id), eq(reminder.userId, context.user.id)),
			)
			.limit(1);
		if (!existing) throw new Error("Reminder not found");

		await deleteReminderFromGoogleCalendar(
			context.user.id,
			data.id,
			context.requestHeaders,
		);
		const [deleted] = await db
			.delete(reminder)
			.where(
				and(eq(reminder.id, data.id), eq(reminder.userId, context.user.id)),
			)
			.returning({ id: reminder.id });
		if (!deleted) throw new Error("Reminder not found");
		return deleted;
	});
