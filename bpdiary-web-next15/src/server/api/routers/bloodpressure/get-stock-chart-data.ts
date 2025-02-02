import { sql, eq, between, getTableColumns } from "drizzle-orm";
import { bloodPressure } from "~/server/db/schema";
import { protectedProcedure, TrpcContext } from "../../trpc";
import { getUserTimezone } from "../setting";
import { z } from "zod";

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

export const getStockChartData = {
    getStockChartData: protectedProcedure.input(z.object({ fromDate: z.date(), toDate: z.date()})).query(async ({ input, ctx }) => {
        const data = getBloodPressureAdjustedByUserTimezone(ctx, input.fromDate, input.toDate);
        return data
    })
}