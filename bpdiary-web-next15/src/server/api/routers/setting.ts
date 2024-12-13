import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
} from "~/server/api/trpc";
import { setting } from "~/server/db/schema";
import { and, desc, count, eq, lt, sql, asc, gte, between, avg } from "drizzle-orm";


export const settingRouter = createTRPCRouter({
    createOrUpdateSetting: protectedProcedure
        .input(z.object({ settingName: z.string().min(1), settingValue: z.string().min(1) }))
        .mutation(async ({ ctx, input }) => {
            await ctx.db.insert(setting).values({
                userId: ctx.session.user.id,
                settingName: input.settingName,
                settingValue: input.settingValue
            }).onConflictDoUpdate({
                target: [setting.userId, setting.settingName],
                set: { settingValue: input.settingValue, updatedAt: new Date() },
            });
        }),
    retrieveSetting: protectedProcedure
        .input(z.object({ settingName: z.string().min(1) }))
        .query(async ({ ctx, input }) => await ctx.db
            .select()
            .from(setting)
            .where(
                and(eq(setting.userId, ctx.session.user.id), eq(setting.settingName, input.settingName))
            )
        ),
});
