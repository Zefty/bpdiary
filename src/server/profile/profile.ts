import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { profileInputSchema } from "@/core/profile/profile";
import { db } from "@/server/db";
import { profile, user } from "@/server/db/schema";
import { authMiddleware } from "@/server/middlewares/auth";

export const getProfile = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.handler(async ({ context }) => {
		const [stored] = await db
			.select()
			.from(profile)
			.where(eq(profile.userId, context.user.id));
		return {
			name: context.user.name,
			email: context.user.email,
			dateOfBirth: stored?.dateOfBirth ?? null,
		};
	});

export const updateProfile = createServerFn({ method: "POST" })
	.validator(profileInputSchema.parse)
	.middleware([authMiddleware])
	.handler(async ({ data, context }) => {
		await db.transaction(async (tx) => {
			await tx
				.update(user)
				.set({ name: data.name, updatedAt: new Date() })
				.where(eq(user.id, context.user.id));
			await tx
				.insert(profile)
				.values({
					userId: context.user.id,
					dateOfBirth: data.dateOfBirth || null,
				})
				.onConflictDoUpdate({
					target: profile.userId,
					set: {
						dateOfBirth: data.dateOfBirth || null,
						updatedAt: new Date(),
					},
				});
		});
		return { success: true };
	});
