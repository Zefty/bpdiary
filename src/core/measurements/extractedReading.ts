import { z } from "zod";

const confidenceSchema = z.number().min(0).max(1).nullable();

export const extractedReadingSchema = z.object({
	systolic: z.number().int().min(50).max(300).nullable(),
	diastolic: z.number().int().min(30).max(200).nullable(),
	pulse: z.number().int().min(20).max(250).nullable(),
	confidence: z.object({
		systolic: confidenceSchema,
		diastolic: confidenceSchema,
		pulse: confidenceSchema,
	}),
	warnings: z.array(z.string()),
});

export type ExtractedReading = z.infer<typeof extractedReadingSchema>;

export function validateExtractedReading(input: unknown): ExtractedReading {
	const reading = extractedReadingSchema.parse(input);
	const warnings = [...reading.warnings];

	if (
		reading.systolic !== null &&
		reading.diastolic !== null &&
		reading.systolic <= reading.diastolic
	) {
		warnings.push("Check that the systolic reading is greater than diastolic.");
	}

	return { ...reading, warnings: [...new Set(warnings)] };
}
