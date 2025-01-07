import { sql, and, eq, asc, between, lte } from "drizzle-orm";
import { bloodPressure } from "~/server/db/schema";
import { protectedProcedure } from "../../trpc";
import { endOfDay, startOfDay, startOfYear, subDays } from "date-fns";

export const getBpStockChartData = {
    getPastSevenDaysDiary: protectedProcedure.query(async ({ ctx }) => {
        const today = endOfDay(new Date());
        const last7Days = startOfDay(subDays(today, 7));
        return await ctx.db
            .select({
                measuredAtDate: sql`${bloodPressure.measuredAt}::DATE`
                    .mapWith((value: Date) => new Date(value))
                    .as("measuredAtDate"),
                avgSystolic: sql<number>`AVG(${bloodPressure.systolic})`,
                avgDiastolic: sql<number>`AVG(${bloodPressure.diastolic})`,
                avgPulse: sql<number>`AVG(${bloodPressure.pulse})`,
            })
            .from(bloodPressure)
            .where(
                and(
                    eq(bloodPressure.loggedByUserId, ctx.session.user.id),
                    between(bloodPressure.measuredAt, last7Days, today)
                ),
            )
            .groupBy(
                sql`${bloodPressure.measuredAt}::DATE`.mapWith(
                    (value: Date) => new Date(value),
                ),
                bloodPressure.loggedByUserId,
            )
            .orderBy(
                asc(
                    sql`${bloodPressure.measuredAt}::DATE`.mapWith(
                        (value: Date) => new Date(value),
                    ),
                ),
            );
    }),
    getPastMonthDiary: protectedProcedure.query(async ({ ctx }) => {
        const today = endOfDay(new Date());
        const last30Days = startOfDay(subDays(today, 30));
        return await ctx.db
            .select({
                measuredAtDate: sql`${bloodPressure.measuredAt}::DATE`
                    .mapWith((value: Date) => new Date(value))
                    .as("measuredAtDate"),
                avgSystolic: sql<number>`AVG(${bloodPressure.systolic})`,
                avgDiastolic: sql<number>`AVG(${bloodPressure.diastolic})`,
                avgPulse: sql<number>`AVG(${bloodPressure.pulse})`,
            })
            .from(bloodPressure)
            .where(
                and(
                    eq(bloodPressure.loggedByUserId, ctx.session.user.id),
                    between(bloodPressure.measuredAt, last30Days, today),
                    // sql`${bloodPressure.measuredAt} BETWEEN CURRENT_DATE - 30 AND CURRENT_DATE`,
                ),
            )
            .groupBy(
                sql`${bloodPressure.measuredAt}::DATE`.mapWith(
                    (value: Date) => new Date(value),
                ),
                bloodPressure.loggedByUserId,
            )
            .orderBy(
                asc(
                    sql`${bloodPressure.measuredAt}::DATE`.mapWith(
                        (value: Date) => new Date(value),
                    ),
                ),
            );
    }),
    getPastYearDiary: protectedProcedure.query(async ({ ctx }) => {
        const today = endOfDay(new Date());
        const past365Days = startOfDay(subDays(today, 365));
        return await ctx.db
            .select({
                measuredAtDate: sql`${bloodPressure.measuredAt}::DATE`
                    .mapWith((value: Date) => new Date(value))
                    .as("measuredAtDate"),
                avgSystolic: sql<number>`AVG(${bloodPressure.systolic})`,
                avgDiastolic: sql<number>`AVG(${bloodPressure.diastolic})`,
                avgPulse: sql<number>`AVG(${bloodPressure.pulse})`,
            })
            .from(bloodPressure)
            .where(
                and(
                    eq(bloodPressure.loggedByUserId, ctx.session.user.id),
                    between(bloodPressure.measuredAt, past365Days, today)
                ),
            )
            .groupBy(
                sql`${bloodPressure.measuredAt}::DATE`.mapWith(
                    (value: Date) => new Date(value),
                ),
                bloodPressure.loggedByUserId,
            )
            .orderBy(
                asc(
                    sql`${bloodPressure.measuredAt}::DATE`.mapWith(
                        (value: Date) => new Date(value),
                    ),
                ),
            );
    }),
    getThisWeekDiary: protectedProcedure.query(async ({ ctx }) => {
        return await ctx.db
            .select({
                measuredAtDate: sql`${bloodPressure.measuredAt}::DATE`
                    .mapWith((value: Date) => new Date(value))
                    .as("measuredAtDate"),
                avgSystolic: sql<number>`AVG(${bloodPressure.systolic})`,
                avgDiastolic: sql<number>`AVG(${bloodPressure.diastolic})`,
                avgPulse: sql<number>`AVG(${bloodPressure.pulse})`,
            })
            .from(bloodPressure)
            .where(
                and(
                    eq(bloodPressure.loggedByUserId, ctx.session.user.id),
                    sql`${bloodPressure.measuredAt} >= date_trunc('week', CURRENT_DATE)`,
                ),
            )
            .groupBy(
                sql`${bloodPressure.measuredAt}::DATE`.mapWith(
                    (value: Date) => new Date(value),
                ),
                bloodPressure.loggedByUserId,
            )
            .orderBy(
                asc(
                    sql`${bloodPressure.measuredAt}::DATE`.mapWith(
                        (value: Date) => new Date(value),
                    ),
                ),
            );
    }),
    getThisMonthDiary: protectedProcedure.query(async ({ ctx }) => {
        return await ctx.db
            .select({
                measuredAtDate: sql`${bloodPressure.measuredAt}::DATE`
                    .mapWith((value: Date) => new Date(value))
                    .as("measuredAtDate"),
                avgSystolic: sql<number>`AVG(${bloodPressure.systolic})`,
                avgDiastolic: sql<number>`AVG(${bloodPressure.diastolic})`,
                avgPulse: sql<number>`AVG(${bloodPressure.pulse})`,
            })
            .from(bloodPressure)
            .where(
                and(
                    eq(bloodPressure.loggedByUserId, ctx.session.user.id),
                    sql`${bloodPressure.measuredAt} >= date_trunc('month', CURRENT_DATE)`,
                ),
            )
            .groupBy(
                sql`${bloodPressure.measuredAt}::DATE`.mapWith(
                    (value: Date) => new Date(value),
                ),
                bloodPressure.loggedByUserId,
            )
            .orderBy(
                asc(
                    sql`${bloodPressure.measuredAt}::DATE`.mapWith(
                        (value: Date) => new Date(value),
                    ),
                ),
            );
    }),
    getThisYearDiary: protectedProcedure.query(async ({ ctx }) => {
        const today = endOfDay(new Date());
        const startDateOfYear = startOfYear(today);
        return await ctx.db
            .select({
                measuredAtDate: sql`${bloodPressure.measuredAt}::DATE`
                    .mapWith((value: Date) => new Date(value))
                    .as("measuredAtDate"),
                avgSystolic: sql<number>`AVG(${bloodPressure.systolic})`,
                avgDiastolic: sql<number>`AVG(${bloodPressure.diastolic})`,
                avgPulse: sql<number>`AVG(${bloodPressure.pulse})`,
            })
            .from(bloodPressure)
            .where(
                and(
                    eq(bloodPressure.loggedByUserId, ctx.session.user.id),
                    between(bloodPressure.measuredAt, startDateOfYear, today)
                ),
            )
            .groupBy(
                sql`${bloodPressure.measuredAt}::DATE`.mapWith(
                    (value: Date) => new Date(value),
                ),
                bloodPressure.loggedByUserId,
            )
            .orderBy(
                asc(
                    sql`${bloodPressure.measuredAt}::DATE`.mapWith(
                        (value: Date) => new Date(value),
                    ),
                ),
            );
    }),
    getWholeDiary: protectedProcedure.query(async ({ ctx }) => {
        return await ctx.db
            .select({
                measuredAtDate: sql`${bloodPressure.measuredAt}::DATE`
                    .mapWith((value: Date) => new Date(value))
                    .as("measuredAtDate"),
                avgSystolic: sql<number>`AVG(${bloodPressure.systolic})`,
                avgDiastolic: sql<number>`AVG(${bloodPressure.diastolic})`,
                avgPulse: sql<number>`AVG(${bloodPressure.pulse})`,
            })
            .from(bloodPressure)
            .where(and(eq(bloodPressure.loggedByUserId, ctx.session.user.id), lte(bloodPressure.measuredAt, endOfDay(new Date()))))
            .groupBy(
                sql`${bloodPressure.measuredAt}::DATE`.mapWith(
                    (value: Date) => new Date(value),
                ),
                bloodPressure.loggedByUserId,
            )
            .orderBy(
                asc(
                    sql`${bloodPressure.measuredAt}::DATE`.mapWith(
                        (value: Date) => new Date(value),
                    ),
                ),
            );
    }),
}