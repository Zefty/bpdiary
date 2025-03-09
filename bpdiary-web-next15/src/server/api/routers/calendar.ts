import { startOfMonth, endOfMonth, subDays, addDays } from "date-fns";
import { eq, desc, and, lt, asc, gte } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { bloodPressure } from "~/server/db/schema";

export const calendarRouter = createTRPCRouter({
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

  getRollingMonthlyDiary: protectedProcedure
    .input(
      z.object({
        date: z.date(),
      }),
    )
    .query(async ({ ctx, input }) => {
      console.log(input.date);
      const som = startOfMonth(input.date);
      const eom = endOfMonth(som);

      console.log(som, eom);

      const start = subDays(som, som.getDay());
      const end = addDays(eom, 6 - eom.getDay());

      console.log(start, end);

      const data = await ctx.db
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

      console.log(data);
      return data;
    }),
});
