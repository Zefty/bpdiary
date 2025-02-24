import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { bloodPressure } from "~/server/db/schema";
import { BpMeasurement, BpMeasurementWithId } from "../shared/types";
import { and, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { bpLogFormSchema } from "~/lib/types";

export const bloodPressureRouter = createTRPCRouter({
  createOrUpdateMeasurement: protectedProcedure
    .input(bpLogFormSchema)
    .mutation(async ({ ctx, input }) => {
      const now = new Date();
      await ctx.db
        .insert(bloodPressure)
        .values({
          id: input.id,
          loggedByUserId: ctx.session.user.id,
          createdAt: now,
          updatedAt: now,
          measuredAt: input.datetime,
          systolic: input.systolic,
          diastolic: input.diastolic,
          pulse: input.pulse,
          notes: input.notes,
        })
        .onConflictDoUpdate({
          target: [bloodPressure.id],
          set: {
            updatedAt: now,
            measuredAt: sql.raw("excluded.measured_at"),
            systolic: sql.raw("excluded.systolic"),
            diastolic: sql.raw("excluded.diastolic"),
            pulse: sql.raw("excluded.pulse"),
            notes: sql.raw("excluded.notes"),
          },
        });
    }),

  deleteMeasurement: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(bloodPressure)
        .where(
          and(
            eq(bloodPressure.id, input.id),
            eq(bloodPressure.loggedByUserId, ctx.session.user.id),
          ),
        );
    }),
});
