import { count } from "console";
import { startOfMonth, endOfMonth, subDays, addDays } from "date-fns";
import { eq, desc, sql, and, lt, asc, avg, between, gte } from "drizzle-orm";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { bloodPressure, posts } from "~/server/db/schema";

export const calendarRouter = createTRPCRouter({
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
      getMonthlyDiary: protectedProcedure
        .input(
          z.object({
            year: z.number().int(),
            month: z.number().int(),
          }),
        )
        .query(async ({ ctx, input }) => {
          return await ctx.db
            .select()
            .from(bloodPressure)
            .where(
              and(
                eq(bloodPressure.loggedByUserId, ctx.session.user.id),
                gte(bloodPressure.createdAt, new Date(input.year, input.month, 1)),
              ),
            )
            .orderBy(asc(bloodPressure.createdAt));
        }),
      getMonthlyRollingDiary: protectedProcedure
        .input(
          z.object({
            date: z.date(),
          }),
        )
        .query(async ({ ctx, input }) => {
          const som = startOfMonth(input.date);
          const eom = endOfMonth(som)
    
          const start = subDays(som, som.getDay());
          const end = addDays(eom, 6 - eom.getDay());
    
          return await ctx.db
            .select()
            .from(bloodPressure)
            .where(
              and(
                eq(bloodPressure.loggedByUserId, ctx.session.user.id),
                gte(bloodPressure.measuredAt, start),
                lt(bloodPressure.measuredAt, end),
              ),
            )
            .orderBy(desc(bloodPressure.measuredAt));
        }),
      getMonthlyPaginatedDiary: protectedProcedure
        .input(
          z.object({
            cursor: z.object({
              year: z.number().int(),
              month: z.number().int(),
            }),
            direction: z.enum(["forward", "backward"]).nullish(),
          }),
        )
        .query(async ({ ctx, input }) => {
          const data = await ctx.db
            .select()
            .from(bloodPressure)
            .where(
              and(
                eq(bloodPressure.loggedByUserId, ctx.session.user.id),
                gte(
                  bloodPressure.createdAt,
                  new Date(input.cursor.year, input.cursor.month, 1),
                ),
              ),
            )
            .orderBy(asc(bloodPressure.createdAt));
          return {
            data,
            // nextCursor: {year: input.cursor.year, month: input.cursor.month + 1},
            // previousCursor: {year: input.cursor.year, month: input.cursor.month - 1},
          };
        }),
});
