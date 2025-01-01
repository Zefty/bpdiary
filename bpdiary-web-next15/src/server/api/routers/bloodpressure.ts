import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { bloodPressure } from "~/server/db/schema";
import { BpMeasurement, BpMeasurementWithId } from "../shared/types";
import { and, desc, count, eq, lt, sql, asc, gte, between, avg } from "drizzle-orm";
import { addDays, endOfMonth, startOfMonth, subDays } from "date-fns";
import { date } from "drizzle-orm/pg-core";
import { createAndEdit } from "./bloodpressure/create-and-edit";
import { getPaginated } from "./bloodpressure/get-paginated";
import { getBpStockChartData } from "./bloodpressure/get-bp-stock-chart-data";

export const bloodPressureRouter = createTRPCRouter({
  ...createAndEdit,
  ...getPaginated,
  ...getBpStockChartData,
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
  getIsBpRecordedMonthly: protectedProcedure.query(async ({ ctx }) => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    return await ctx.db
      .select({
        createdAt: bloodPressure.createdAt,
      })
      .from(bloodPressure)
      .where(
        and(
          eq(bloodPressure.loggedByUserId, ctx.session.user.id),
          between(bloodPressure.createdAt, startOfMonth, endOfMonth),
        ),
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
            gte(bloodPressure.createdAt, start),
            lt(bloodPressure.createdAt, end),
          ),
        )
        .orderBy(desc(bloodPressure.createdAt));
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
