import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { and, eq } from "drizzle-orm";
import { sessions } from "~/server/db/schema";

export const sessionRouter = createTRPCRouter({
  validate: protectedProcedure.query(async ({ ctx }) => {
    const session = ctx.session;
    if (!session) return false;
    return new Date(session.expires) >= new Date();
  }),
});
