import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  TrpcContext,
} from "~/server/api/trpc";
import { setting } from "~/server/db/schema";
import { and, eq, isNull, or } from "drizzle-orm";

export const getUserTimezone = async (ctx: TrpcContext) => {
  const defaultTz = "UTC";
  if (!ctx.session) return defaultTz;
  return (
    (
      await ctx.db
        .select({ value: setting.settingValue })
        .from(setting)
        .where(
          and(
            eq(setting.userId, ctx.session.user.id),
            or(
              eq(setting.settingName, "timezone"),
              isNull(setting.settingName),
            ),
          ),
        )
    )[0]?.value ?? defaultTz
  );
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
