import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { setting, users } from "~/server/db/schema";
import { and, eq } from "drizzle-orm";
import { profileFormSchema } from "~/lib/types";

export const userRouter = createTRPCRouter({
  updateProfile: protectedProcedure
    .input(profileFormSchema)
    .mutation(async ({ ctx, input }) => {
      await Promise.all([
        ctx.db
          .update(users)
          .set({
            name: input.name,
            email: input.email,
            dob: input.dob,
            updatedAt: new Date(),
          })
          .where(eq(users.id, ctx.session.user.id)),

        ctx.db
          .update(setting)
          .set({
            settingValue: input.timezone,
            updatedAt: new Date(),
          })
          .where(
            and(
              eq(setting.userId, ctx.session.user.id),
              eq(setting.settingName, "timezone"),
            ),
          ),
      ]);
    }),
});
