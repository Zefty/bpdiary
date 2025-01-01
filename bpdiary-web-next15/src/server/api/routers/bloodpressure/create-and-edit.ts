import { and, eq } from "drizzle-orm";
import { bloodPressure } from "~/server/db/schema";
import { BpMeasurement, BpMeasurementWithId } from "../../shared/types";
import { protectedProcedure } from "../../trpc";

export const createAndEdit = {
    log: protectedProcedure.input(BpMeasurement).mutation(async ({ ctx, input }) => {
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

    editLog: protectedProcedure.input(BpMeasurementWithId).mutation(async ({ ctx, input }) => {
        await ctx.db
            .update(bloodPressure)
            .set({
                createdAt: input.datetime,
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
    })
};