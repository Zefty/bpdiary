import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { bloodPressure } from "~/server/db/schema";
import { BpLog, BpLogWithId } from "../shared/types";
import { and, desc, count, eq, lt, sql, asc, gte } from "drizzle-orm";
import { addDays, endOfMonth, startOfMonth, subDays } from "date-fns";

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
