import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { bloodPressure } from "~/server/db/schema";
import { BpLog, BpLogWithId } from "../shared/types";
import { and, desc, count, eq, lt, sql, asc, gte } from "drizzle-orm";

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
  getMonthlyDiary: protectedProcedure.query(async ({ ctx }) => {
    const now = new Date();

    return await ctx.db
      .select()
      .from(bloodPressure)
      .where(and(
        eq(bloodPressure.loggedByUserId, ctx.session.user.id),
        gte(bloodPressure.createdAt, new Date(now.getFullYear(), now.getMonth(), 1)),
      ))
      .orderBy(asc(bloodPressure.createdAt))
  }),
});
