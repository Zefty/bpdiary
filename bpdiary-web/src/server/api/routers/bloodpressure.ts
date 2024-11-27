import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { bloodPressure } from "~/server/db/schema";
import { BpLog, BpLogWithId } from "../shared/types";
import { and, desc, count, eq, lt, sql, asc, gte, between, avg } from "drizzle-orm";
import { addDays, endOfMonth, startOfMonth, subDays } from "date-fns";
import { date } from "drizzle-orm/pg-core";

export const bloodPressureRouter = createTRPCRouter({
  log: protectedProcedure.input(BpLog).mutation(async ({ ctx, input }) => {
    await ctx.db.insert(bloodPressure).values({
      loggedByUserId: ctx.session.user.id,
      createdAt: input.datetime,
      updatedAt: input.datetime,
      systolic: input.systolic,
      diastolic: input.diastolic,
      pulse: input.pulse,
      notes: input.notes,
    });
  }),
  editLog: protectedProcedure
    .input(BpLogWithId)
    .mutation(async ({ ctx, input }) => {
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
    }),
  getPaginatedDiary: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(50),
        page: z.number().min(1).default(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db
        .select()
        .from(bloodPressure)
        .where(eq(bloodPressure.loggedByUserId, ctx.session.user.id))
        .orderBy(desc(bloodPressure.id))
        .limit(input.limit)
        .offset(input.page * input.limit - input.limit);
    }),
  getMaxDiaryPages: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(50),
      }),
    )
    .query(async ({ ctx, input }) => {
      return (
        await ctx.db
          .select({
            count: count(),
            pages: sql`count(*) / ${input.limit} + 1`.mapWith(Number),
          })
          .from(bloodPressure)
          .where(eq(bloodPressure.loggedByUserId, ctx.session.user.id))
      )[0];
    }),
  getInfiniteDiary: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.number().nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const data = await ctx.db
        .select()
        .from(bloodPressure)
        .where(
          and(
            eq(bloodPressure.loggedByUserId, ctx.session.user.id),
            input.cursor ? lt(bloodPressure.id, input.cursor) : undefined,
          ),
        )
        .orderBy(desc(bloodPressure.id))
        .limit(input.limit ?? 5);
      return {
        data,
        nextCursor: data.length ? data[data.length - 1]?.id : null,
      };
    }),
  getPastSevenDaysDiary: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db
      .select({
        createdAtDate: sql`${bloodPressure.createdAt}::DATE`
          .mapWith((value: Date) => new Date(value))
          .as("createdAtDate"),
        avgSystolic: sql<number>`AVG(${bloodPressure.systolic})`,
        avgDiastolic: sql<number>`AVG(${bloodPressure.diastolic})`,
        avgPulse: sql<number>`AVG(${bloodPressure.pulse})`,
      })
      .from(bloodPressure)
      .where(
        and(
          eq(bloodPressure.loggedByUserId, ctx.session.user.id),
          sql`${bloodPressure.createdAt} >= CURRENT_DATE - 6`,
        ),
      )
      .groupBy(
        sql`${bloodPressure.createdAt}::DATE`.mapWith(
          (value: Date) => new Date(value),
        ),
        bloodPressure.loggedByUserId,
      )
      .orderBy(
        asc(
          sql`${bloodPressure.createdAt}::DATE`.mapWith(
            (value: Date) => new Date(value),
          ),
        ),
      );
  }),
  getPastMonthDiary: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db
      .select({
        createdAtDate: sql`${bloodPressure.createdAt}::DATE`
          .mapWith((value: Date) => new Date(value))
          .as("createdAtDate"),
        avgSystolic: sql<number>`AVG(${bloodPressure.systolic})`,
        avgDiastolic: sql<number>`AVG(${bloodPressure.diastolic})`,
        avgPulse: sql<number>`AVG(${bloodPressure.pulse})`,
      })
      .from(bloodPressure)
      .where(
        and(
          eq(bloodPressure.loggedByUserId, ctx.session.user.id),
          sql`${bloodPressure.createdAt} >= CURRENT_DATE - 30`,
        ),
      )
      .groupBy(
        sql`${bloodPressure.createdAt}::DATE`.mapWith(
          (value: Date) => new Date(value),
        ),
        bloodPressure.loggedByUserId,
      )
      .orderBy(
        asc(
          sql`${bloodPressure.createdAt}::DATE`.mapWith(
            (value: Date) => new Date(value),
          ),
        ),
      );
  }),
  getPastYearDiary: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db
      .select({
        createdAtDate: sql`${bloodPressure.createdAt}::DATE`
          .mapWith((value: Date) => new Date(value))
          .as("createdAtDate"),
        avgSystolic: sql<number>`AVG(${bloodPressure.systolic})`,
        avgDiastolic: sql<number>`AVG(${bloodPressure.diastolic})`,
        avgPulse: sql<number>`AVG(${bloodPressure.pulse})`,
      })
      .from(bloodPressure)
      .where(
        and(
          eq(bloodPressure.loggedByUserId, ctx.session.user.id),
          sql`${bloodPressure.createdAt} >= CURRENT_DATE - 365`,
        ),
      )
      .groupBy(
        sql`${bloodPressure.createdAt}::DATE`.mapWith(
          (value: Date) => new Date(value),
        ),
        bloodPressure.loggedByUserId,
      )
      .orderBy(
        asc(
          sql`${bloodPressure.createdAt}::DATE`.mapWith(
            (value: Date) => new Date(value),
          ),
        ),
      );
  }),
  getThisWeekDiary: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db
      .select({
        createdAtDate: sql`${bloodPressure.createdAt}::DATE`
          .mapWith((value: Date) => new Date(value))
          .as("createdAtDate"),
        avgSystolic: sql<number>`AVG(${bloodPressure.systolic})`,
        avgDiastolic: sql<number>`AVG(${bloodPressure.diastolic})`,
        avgPulse: sql<number>`AVG(${bloodPressure.pulse})`,
      })
      .from(bloodPressure)
      .where(
        and(
          eq(bloodPressure.loggedByUserId, ctx.session.user.id),
          sql`${bloodPressure.createdAt} >= date_trunc('week', CURRENT_DATE)`,
        ),
      )
      .groupBy(
        sql`${bloodPressure.createdAt}::DATE`.mapWith(
          (value: Date) => new Date(value),
        ),
        bloodPressure.loggedByUserId,
      )
      .orderBy(
        asc(
          sql`${bloodPressure.createdAt}::DATE`.mapWith(
            (value: Date) => new Date(value),
          ),
        ),
      );
  }),
  getThisMonthDiary: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db
      .select({
        createdAtDate: sql`${bloodPressure.createdAt}::DATE`
          .mapWith((value: Date) => new Date(value))
          .as("createdAtDate"),
        avgSystolic: sql<number>`AVG(${bloodPressure.systolic})`,
        avgDiastolic: sql<number>`AVG(${bloodPressure.diastolic})`,
        avgPulse: sql<number>`AVG(${bloodPressure.pulse})`,
      })
      .from(bloodPressure)
      .where(
        and(
          eq(bloodPressure.loggedByUserId, ctx.session.user.id),
          sql`${bloodPressure.createdAt} >= date_trunc('month', CURRENT_DATE)`,
        ),
      )
      .groupBy(
        sql`${bloodPressure.createdAt}::DATE`.mapWith(
          (value: Date) => new Date(value),
        ),
        bloodPressure.loggedByUserId,
      )
      .orderBy(
        asc(
          sql`${bloodPressure.createdAt}::DATE`.mapWith(
            (value: Date) => new Date(value),
          ),
        ),
      );
  }),
  getThisYearDiary: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db
      .select({
        createdAtDate: sql`${bloodPressure.createdAt}::DATE`
          .mapWith((value: Date) => new Date(value))
          .as("createdAtDate"),
        avgSystolic: sql<number>`AVG(${bloodPressure.systolic})`,
        avgDiastolic: sql<number>`AVG(${bloodPressure.diastolic})`,
        avgPulse: sql<number>`AVG(${bloodPressure.pulse})`,
      })
      .from(bloodPressure)
      .where(
        and(
          eq(bloodPressure.loggedByUserId, ctx.session.user.id),
          sql`${bloodPressure.createdAt} >= date_trunc('year', CURRENT_DATE)`,
        ),
      )
      .groupBy(
        sql`${bloodPressure.createdAt}::DATE`.mapWith(
          (value: Date) => new Date(value),
        ),
        bloodPressure.loggedByUserId,
      )
      .orderBy(
        asc(
          sql`${bloodPressure.createdAt}::DATE`.mapWith(
            (value: Date) => new Date(value),
          ),
        ),
      );
  }),
  getWholeDiary: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db
      .select({
        createdAtDate: sql`${bloodPressure.createdAt}::DATE`
          .mapWith((value: Date) => new Date(value))
          .as("createdAtDate"),
        avgSystolic: sql<number>`AVG(${bloodPressure.systolic})`,
        avgDiastolic: sql<number>`AVG(${bloodPressure.diastolic})`,
        avgPulse: sql<number>`AVG(${bloodPressure.pulse})`,
      })
      .from(bloodPressure)
      .where(and(eq(bloodPressure.loggedByUserId, ctx.session.user.id)))
      .groupBy(
        sql`${bloodPressure.createdAt}::DATE`.mapWith(
          (value: Date) => new Date(value),
        ),
        bloodPressure.loggedByUserId,
      )
      .orderBy(
        asc(
          sql`${bloodPressure.createdAt}::DATE`.mapWith(
            (value: Date) => new Date(value),
          ),
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
