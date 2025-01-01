import { sql, and, eq, asc } from "drizzle-orm";
import { bloodPressure } from "~/server/db/schema";
import { protectedProcedure } from "../../trpc";

export const getBpStockChartData = {
    getPastSevenDaysDiary: protectedProcedure.query(async ({ ctx }) => {
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
                    sql`${bloodPressure.measuredAt} >= CURRENT_DATE - 6`,
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
                    sql`${bloodPressure.measuredAt} >= CURRENT_DATE - 30`,
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
                    sql`${bloodPressure.measuredAt} >= CURRENT_DATE - 365`,
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
                    sql`${bloodPressure.measuredAt} >= date_trunc('year', CURRENT_DATE)`,
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
            .where(and(eq(bloodPressure.loggedByUserId, ctx.session.user.id)))
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