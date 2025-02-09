import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { bloodPressure } from "~/server/db/schema";
import { BpMeasurement, BpMeasurementWithId } from "../shared/types";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

export const bloodPressureRouter = createTRPCRouter({
  logMeasurement: protectedProcedure
    .input(BpMeasurement)
    .mutation(async ({ ctx, input }) => {
      const now = new Date();
      await ctx.db.insert(bloodPressure).values({
        loggedByUserId: ctx.session.user.id,
        createdAt: now,
        updatedAt: now,
        measuredAt: input.datetime,
        systolic: input.systolic,
        diastolic: input.diastolic,
        pulse: input.pulse,
        notes: input.notes,
      });
    }),

  editMeasurement: protectedProcedure
    .input(BpMeasurementWithId)
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(bloodPressure)
        .set({
          measuredAt: input.datetime,
          updatedAt: new Date(),
          systolic: input.systolic,
          diastolic: input.diastolic,
          pulse: input.pulse,
          notes: input.notes,
        })
        .where(
          and(
            eq(bloodPressure.id, input.id),
            eq(bloodPressure.loggedByUserId, ctx.session.user.id),
          ),
        );
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
