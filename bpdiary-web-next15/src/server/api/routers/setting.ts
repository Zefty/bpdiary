import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  type TrpcContext,
} from "~/server/api/trpc";
import { setting } from "~/server/db/schema";
import { and, eq } from "drizzle-orm";

export const getUserTimezone = async (ctx: TrpcContext) => {
  const defaultTz = "UTC";
  if (!ctx.session) return defaultTz;
  return ctx.session.user.timezone ?? defaultTz;
};

export const settingRouter = createTRPCRouter({
  createOrUpdateSetting: protectedProcedure
    .input(
      z.object({
        settingName: z.string().min(1),
        settingValue: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .insert(setting)
        .values({
          userId: ctx.session.user.id,
          settingName: input.settingName,
          settingValue: input.settingValue,
        })
        .onConflictDoUpdate({
          target: [setting.userId, setting.settingName],
          set: { settingValue: input.settingValue, updatedAt: new Date() },
        });
    }),

  retrieveSetting: protectedProcedure
    .input(z.object({ settingName: z.string().min(1) }))
    .query(
      async ({ ctx, input }) =>
        await ctx.db
          .select()
          .from(setting)
          .where(
            and(
              eq(setting.userId, ctx.session.user.id),
              eq(setting.settingName, input.settingName),
            ),
          ),
    ),

  updateSetting: protectedProcedure
    .input(
      z.object({ settingName: z.string().min(1), settingValue: z.string() }),
    )
    .query(
      async ({ ctx, input }) =>
        await ctx.db
          .update(setting)
          .set({ settingValue: input.settingValue, updatedAt: new Date() })
          .where(
            and(
              eq(setting.userId, ctx.session.user.id),
              eq(setting.settingName, input.settingName),
            ),
          ),
    ),
});
