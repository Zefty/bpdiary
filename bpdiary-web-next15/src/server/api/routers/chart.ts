import { and, eq, sql, between, getTableColumns, asc, avg } from "drizzle-orm";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  type TrpcContext,
} from "~/server/api/trpc";
import { bloodPressure } from "~/server/db/schema";
import { getUserTimezone } from "./setting";
import { endOfDay, startOfDay, subDays, startOfYear } from "date-fns";
import { type Timeframes } from "~/lib/types";
import { TRPCError } from "@trpc/server";

export const chartRouter = createTRPCRouter({
  getPastSevenDaysData: protectedProcedure.query(async ({ ctx }) => {
    const toDate = endOfDay(new Date());
    const fromLastWeek = startOfDay(subDays(toDate, 7));
    return await getBloodPressureAdjustedByUserTimezone(
      ctx,
      fromLastWeek,
      toDate,
    );
  }),

  getStockChartData: protectedProcedure.query(async ({ ctx }) => {
    const toDate = endOfDay(new Date());
    const fromLastWeek = startOfDay(subDays(toDate, 7));
    const fromLastMonth = startOfDay(subDays(toDate, 30));
    const fromLastYear = startOfDay(subDays(toDate, 365));
    const fromStartOfYear = startOfYear(toDate);
    const fromAll = new Date(0);

    const [week, month, year, ytd, all] = await Promise.all([
      getBloodPressureAdjustedByUserTimezone(ctx, fromLastWeek, toDate),
      getBloodPressureAdjustedByUserTimezone(ctx, fromLastMonth, toDate),
      getBloodPressureAdjustedByUserTimezone(ctx, fromLastYear, toDate),
      getBloodPressureAdjustedByUserTimezone(ctx, fromStartOfYear, toDate),
      getBloodPressureAdjustedByUserTimezone(ctx, fromAll, toDate),
    ]);

    const allChartData = new Map<
      Timeframes,
      Awaited<ReturnType<typeof getBloodPressureAdjustedByUserTimezone>>
    >();
    allChartData.set("W", week);
    allChartData.set("M", month);
    allChartData.set("YTD", ytd);
    allChartData.set("Y", year);
    allChartData.set("All", all);

    return allChartData;
  }),

  getDatesWithBpMeasurementsByMonth: protectedProcedure
    .input(z.object({ date: z.date() }).optional())
    .query(async ({ input, ctx }) => {
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

  getAverageBpPerDayOfWeek: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db
      .select({
        dayOfWeek: sql`EXTRACT(DOW FROM ${bloodPressure.createdAt})`
          .mapWith(Number)
          .as("dayOfWeek"),
        avgSystolic: sql<number>`AVG(${bloodPressure.systolic})`,
        avgDiastolic: sql<number>`AVG(${bloodPressure.diastolic})`,
        avgPulse: sql<number>`AVG(${bloodPressure.pulse})`,
      })
      .from(bloodPressure)
      .where(eq(bloodPressure.loggedByUserId, ctx.session.user.id))
      .groupBy(
        sql`EXTRACT(DOW FROM ${bloodPressure.createdAt})`.mapWith(Number),
        bloodPressure.loggedByUserId,
      )
      .orderBy(
        asc(sql`EXTRACT(DOW FROM ${bloodPressure.createdAt})`.mapWith(Number)),
      );
  }),
  getAverageMeasurements: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db
      .select({
        avgSystolic: avg(bloodPressure.systolic),
        avgDiastolic: avg(bloodPressure.diastolic),
        avgPulse: avg(bloodPressure.pulse),
      })
      .from(bloodPressure)
      .where(and(eq(bloodPressure.loggedByUserId, ctx.session.user.id)));
  }),
});

const bloodPressureAdjustedByUserTimezoneCTE = async (ctx: TrpcContext) => {
  const tz = await getUserTimezone(ctx);
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return ctx.db.$with("tz_adjusted").as(
    ctx.db
      .select({
        ...getTableColumns(bloodPressure),
        measuredAtOffset:
          sql`TIMEZONE(${tz}, ${bloodPressure.measuredAt})::DATE`
            .mapWith(bloodPressure.measuredAt)
            .as("measured_at_offset"),
      })
      .from(bloodPressure)
      .where(eq(bloodPressure.loggedByUserId, ctx.session.user.id)),
  );
};

const getBloodPressureAdjustedByUserTimezone = async (
  ctx: TrpcContext,
  fromDate: Date,
  toDate: Date,
) => {
  const tzAdjusted = await bloodPressureAdjustedByUserTimezoneCTE(ctx);
  const data = await ctx.db
    .with(tzAdjusted)
    .select({
      measuredAtDate: tzAdjusted.measuredAtOffset,
      avgSystolic: sql<number>`AVG(${tzAdjusted.systolic})`,
      avgDiastolic: sql<number>`AVG(${tzAdjusted.diastolic})`,
      avgPulse: sql<number>`AVG(${tzAdjusted.pulse})`,
    })
    .from(tzAdjusted)
    .where(
      between(
        tzAdjusted.measuredAtOffset,
        sql`TIMEZONE(${fromDate.toISOString()})`,
        sql`TIMEZONE(${toDate.toISOString()})`,
      ),
    )
    .groupBy(tzAdjusted.measuredAtOffset)
    .orderBy(tzAdjusted.measuredAtOffset);

  return data;
};
