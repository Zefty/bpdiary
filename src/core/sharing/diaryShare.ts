import { z } from "zod";

export const DIARY_SHARE_DURATION_DAYS = 30;

export const diaryShareTokenSchema = z
	.string()
	.regex(/^[A-Za-z0-9_-]{43}$/, "Invalid diary share link");

export const createDiaryShareSchema = z.object({
	includeNotes: z.boolean(),
});

export const sharedDiaryCursorSchema = z.object({
	measuredAt: z.string().refine((value) => !Number.isNaN(Date.parse(value)), {
		message: "Invalid measurement cursor date",
	}),
	id: z.number().int().positive(),
});

export const sharedDiaryPageInputSchema = z.object({
	token: z.string(),
	cursor: sharedDiaryCursorSchema.nullable().optional(),
});

export type CreateDiaryShareInput = z.infer<typeof createDiaryShareSchema>;
export type SharedDiaryCursor = z.infer<typeof sharedDiaryCursorSchema>;
