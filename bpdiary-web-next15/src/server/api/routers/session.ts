import { eq } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { sessions } from "~/server/db/schema";

export const sessionRouter = createTRPCRouter({
  validateSessionToken: publicProcedure
    .input(z.object({ sessionToken: z.string() }))
    .query(async ({ input, ctx }) => {
      const sessionFromDb = (
        await ctx.db
          .select({ expires: sessions.expires })
          .from(sessions)
          .where(eq(sessions.sessionToken, input.sessionToken))
      )[0];

      if (sessionFromDb === undefined) {
        return false;
      }

      return new Date(sessionFromDb.expires) >= new Date();
    }),
});
