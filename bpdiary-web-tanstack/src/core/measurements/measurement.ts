import { z } from "zod";

export const measurementInputSchema = z.object({
	id: z.number().int().positive().optional(),
	measuredAt: z.string().min(1),
	systolic: z.number().int().min(50).max(300),
	diastolic: z.number().int().min(30).max(200),
	pulse: z.number().int().min(20).max(250).nullable().optional(),
	notes: z.string().trim().max(500).nullable().optional(),
});

export const measurementIdSchema = z.object({
	id: z.number().int().positive(),
});

export type MeasurementInput = z.infer<typeof measurementInputSchema>;

export function average(values: Array<number | null>) {
	const present = values.filter((value): value is number => value !== null);
	if (present.length === 0) return null;
	return Math.round(
		present.reduce((sum, value) => sum + value, 0) / present.length,
	);
}

export function measurementTrend(
	current: number | null,
	previous: number | null,
) {
	if (current === null || previous === null) return null;
	return current - previous;
}
