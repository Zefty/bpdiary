import { sql, and, eq, asc, between, lte, getTableColumns, or, isNull } from "drizzle-orm";
import { bloodPressure, setting } from "~/server/db/schema";
import { protectedProcedure, TrpcContext } from "../../trpc";
import { endOfDay, startOfDay, startOfMonth, startOfWeek, startOfYear, subDays } from "date-fns";
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
    }),
    getPastSevenDaysDiary: protectedProcedure.query(async ({ ctx }) => {
        const today = endOfDay(new Date());
        const last7Days = startOfDay(subDays(today, 7));
        const data = getBloodPressureAdjustedByUserTimezone(ctx, last7Days, today);
        return data
    }),
    getPastMonthDiary: protectedProcedure.query(async ({ ctx }) => {
        const today = endOfDay(new Date());
        const last30Days = startOfDay(subDays(today, 30));
        const data = getBloodPressureAdjustedByUserTimezone(ctx, last30Days, today);
        return data;
    }),
    getPastYearDiary: protectedProcedure.query(async ({ ctx }) => {
        const today = endOfDay(new Date());
        const past365Days = startOfDay(subDays(today, 365));
        const data = getBloodPressureAdjustedByUserTimezone(ctx, past365Days, today);
        return data;
    }),
    getThisWeekDiary: protectedProcedure.query(async ({ ctx }) => {
        const today = endOfDay(new Date());
        const startOfWeekDate = startOfWeek(today);
        const data = getBloodPressureAdjustedByUserTimezone(ctx, startOfWeekDate, today);
        return data;
    }),
    getThisMonthDiary: protectedProcedure.query(async ({ ctx }) => {
        const today = endOfDay(new Date());
        const startOfMonthDate = startOfMonth(today);
        const data = getBloodPressureAdjustedByUserTimezone(ctx, startOfMonthDate, today);
        return data;
    }),
    getThisYearDiary: protectedProcedure.query(async ({ ctx }) => {
        const today = endOfDay(new Date());
        const startDateOfYear = startOfYear(today);
        const data = getBloodPressureAdjustedByUserTimezone(ctx, startDateOfYear, today);
        return data;
    }),
    getWholeDiary: protectedProcedure.query(async ({ ctx }) => {
        const today = endOfDay(new Date());
        const fromDate = new Date(0);
        const data = getBloodPressureAdjustedByUserTimezone(ctx, fromDate, today);
        return data;
    }),
}