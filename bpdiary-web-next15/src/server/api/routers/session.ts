import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import {
  and,
  desc,
  count,
  eq,
  lt,
  sql,
  asc,
  gte,
  between,
  avg,
} from "drizzle-orm";
import { sessions } from "~/server/db/schema";

export const sessionRouter = createTRPCRouter({
  validate: publicProcedure
    .input(z.object({ sessionToken: z.string() }))
    .query(async ({ ctx, input }) => {
      const session = await ctx.db
        .select()
        .from(sessions)
        .where(
          and(
            eq(sessions.sessionToken, input.sessionToken),
          ),
        );

      if (!session[0]?.expires) return false;

      return session[0]?.expires >= new Date();
    }),
});
