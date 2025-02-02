import { eq, desc, sql, and, lt, count } from "drizzle-orm";
import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure,
} from "~/server/api/trpc";
import { bloodPressure } from "~/server/db/schema";

export const feedRouter = createTRPCRouter({
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
                cursor: z.date().nullish(),
            }),
        )
        .query(async ({ ctx, input }) => {
            const data = await ctx.db
                .select()
                .from(bloodPressure)
                .where(
                    and(
                        eq(bloodPressure.loggedByUserId, ctx.session.user.id),
                        input.cursor ? lt(bloodPressure.measuredAt, input.cursor) : undefined,
                    ),
                )
                .orderBy(desc(bloodPressure.measuredAt))
                .limit(input.limit ?? 5);
            return {
                data,
                nextCursor: data.length ? data[data.length - 1]?.measuredAt : null,
            };
        })
});
