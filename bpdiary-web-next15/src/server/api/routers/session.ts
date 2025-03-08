import { eq } from "drizzle-orm";
import { type Session } from "next-auth";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { sessions } from "~/server/db/schema";

export const sessionRouter = createTRPCRouter({
  validate: publicProcedure.query(async ({ ctx }) => {
    let session: Session | null | { expires: Date } = ctx.session;

    if (!session) {
      const sessionToken = ctx.headers.get("authjs.session-token");

      if (!sessionToken) {
        return false;
      }

      const sessionFromDb = (
        await ctx.db
          .select({ expires: sessions.expires })
          .from(sessions)
          .where(eq(sessions.sessionToken, sessionToken))
      )[0];

      if (sessionFromDb === undefined) {
        return false;
      }

      session = sessionFromDb;
    }
    return new Date(session.expires) >= new Date();
  }),
});
