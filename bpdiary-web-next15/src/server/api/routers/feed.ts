import { eq, desc, and, lt } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { bloodPressure } from "~/server/db/schema";

export const feedRouter = createTRPCRouter({
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
            input.cursor
              ? lt(bloodPressure.measuredAt, input.cursor)
              : undefined,
          ),
        )
        .orderBy(desc(bloodPressure.measuredAt))
        .limit(input.limit ?? 5);

      const ret = {
        data,
        nextCursor: data.length ? data[data.length - 1]?.measuredAt : null,
      };

      return ret;
    }),
});
