import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const sessionRouter = createTRPCRouter({
  validate: protectedProcedure.query(async ({ ctx }) => {
    const session = ctx.session;
    if (!session) return false;
    return new Date(session.expires) >= new Date();
  }),
});
