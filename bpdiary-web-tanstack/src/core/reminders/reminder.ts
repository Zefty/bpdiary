import { z } from "zod";

export const reminderTypeSchema = z.enum(["blood-pressure", "medication"]);
export const reminderDaySchema = z.enum([
	"Sun",
	"Mon",
	"Tue",
	"Wed",
	"Thu",
	"Fri",
	"Sat",
]);

export const reminderInputSchema = z.object({
	id: z.number().int().positive().optional(),
	type: reminderTypeSchema,
	time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
	days: z.array(reminderDaySchema).min(1),
	active: z.boolean().default(true),
});

export const reminderIdSchema = z.object({ id: z.number().int().positive() });
export type ReminderInput = z.infer<typeof reminderInputSchema>;
