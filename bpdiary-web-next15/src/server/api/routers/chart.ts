import { and, eq, sql, between, getTableColumns } from "drizzle-orm";
import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure,
    TrpcContext,
} from "~/server/api/trpc";
import { bloodPressure } from "~/server/db/schema";
import { getUserTimezone } from "./setting";

export const chartRouter = createTRPCRouter({
    getStockChartData: protectedProcedure.input(z.object({ fromDate: z.date(), toDate: z.date() })).query(async ({ input, ctx }) => {
        const data = getBloodPressureAdjustedByUserTimezone(ctx, input.fromDate, input.toDate);
        return data
    }),
    getDatesWithBpMeasurementsByMonth: protectedProcedure.input(z.object({ date: z.date() }).optional()).query(async ({ input, ctx }) => {
        const now = input?.date ?? new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        return await ctx.db
            .select({
                measuredAt: bloodPressure.measuredAt,
            })
            .from(bloodPressure)
            .where(
                and(
                    eq(bloodPressure.loggedByUserId, ctx.session.user.id),
                    between(bloodPressure.measuredAt, startOfMonth, endOfMonth),
                ),
            );
    }),
});

const bloodPressureAdjustedByUserTimezoneCTE = async (ctx: TrpcContext) => {
    const tz = await getUserTimezone(ctx);
    return ctx.db.$with('tz_adjusted').as(
        ctx.db.select({
            ...getTableColumns(bloodPressure),
            measuredAtOffset: sql`TIMEZONE(${tz}, ${bloodPressure.measuredAt})::DATE`.mapWith(bloodPressure.measuredAt).as("measured_at_offset"),
        })
            .from(bloodPressure)
            .where(eq(bloodPressure.loggedByUserId, ctx.session.user.id))
    );
}

const getBloodPressureAdjustedByUserTimezone = async (ctx: TrpcContext, fromDate: Date, toDate: Date) => {
    const tzAdjusted = await bloodPressureAdjustedByUserTimezoneCTE(ctx);
    const data = await ctx.db.with(tzAdjusted).select({
        measuredAtDate: tzAdjusted.measuredAtOffset,
        avgSystolic: sql<number>`AVG(${tzAdjusted.systolic})`,
        avgDiastolic: sql<number>`AVG(${tzAdjusted.diastolic})`,
        avgPulse: sql<number>`AVG(${tzAdjusted.pulse})`,
    })
        .from(tzAdjusted)
        .where(between(tzAdjusted.measuredAtOffset, sql`TIMEZONE(${fromDate.toISOString()})`, sql`TIMEZONE(${toDate.toISOString()})`))
        .groupBy(tzAdjusted.measuredAtOffset)
        .orderBy(tzAdjusted.measuredAtOffset);
    return data;
}