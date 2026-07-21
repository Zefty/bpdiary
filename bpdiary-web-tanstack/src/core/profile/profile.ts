import { z } from "zod";

export const profileInputSchema = z.object({
	name: z.string().trim().min(2).max(60),
	dateOfBirth: z.string().nullable().optional(),
	timezone: z.string().min(1).max(100),
	theme: z.enum(["light", "dark", "system"]),
});

export type ProfileInput = z.infer<typeof profileInputSchema>;
