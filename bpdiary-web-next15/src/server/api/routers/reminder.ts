import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { reminder } from "~/server/db/schema";
import { and, eq, sql } from "drizzle-orm";
import { remindersFormSchema } from "~/lib/types";

export const reminderRouter = createTRPCRouter({
  createOrUpdateReminders: protectedProcedure
    .input(remindersFormSchema)
    .mutation(async ({ ctx, input }) => {
      const bpReminders = (input.bp ?? []).map((r) => ({
        ...r,
        type: "bp",
        createdByUserId: ctx.session.user.id,
      }));
      const medReminders = (input.med ?? []).map((r) => ({
        ...r,
        type: "med",
        createdByUserId: ctx.session.user.id,
      }));
      const allReminders = [...bpReminders, ...medReminders];

      await ctx.db
        .insert(reminder)
        .values(allReminders)
        .onConflictDoUpdate({
          target: [reminder.id],
          set: {
            reminderTime: sql.raw("excluded.reminder_time"),
            active: sql.raw("excluded.active"),
            sunday: sql.raw("excluded.sunday"),
            monday: sql.raw("excluded.monday"),
            tuesday: sql.raw("excluded.tuesday"),
            wednesday: sql.raw("excluded.wednesday"),
            thursday: sql.raw("excluded.thursday"),
            friday: sql.raw("excluded.friday"),
            saturday: sql.raw("excluded.saturday"),
            updatedAt: new Date(),
          },
        });
    }),

  //    deleteReminder: protectedProcedure

  getAllReminders: protectedProcedure.query(async ({ ctx }) => {
    const [bpReminders, medReminders] = await Promise.all([
      ctx.db
        .select()
        .from(reminder)
        .where(
          and(
            eq(reminder.createdByUserId, ctx.session.user.id),
            eq(reminder.type, "bp"),
          ),
        ),
      ctx.db
        .select()
        .from(reminder)
        .where(
          and(
            eq(reminder.createdByUserId, ctx.session.user.id),
            eq(reminder.type, "med"),
          ),
        ),
    ]);

    return {
      bp: bpReminders,
      med: medReminders,
    };
  }),
});
