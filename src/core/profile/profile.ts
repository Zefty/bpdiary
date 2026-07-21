import { z } from "zod";

export const profileInputSchema = z.object({
	name: z.string().trim().min(2).max(60),
	dateOfBirth: z.string().nullable().optional(),
});

export type ProfileInput = z.infer<typeof profileInputSchema>;
