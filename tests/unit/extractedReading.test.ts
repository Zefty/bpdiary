import { describe, expect, it } from "vitest";
import { validateExtractedReading } from "@/core/measurements/extractedReading";
import { extractMeasurementFromImage } from "@/server/measurements/extractMeasurement";
import {
	MonitorReadingExtractionNotImplementedError,
	monitorReadingProvider,
} from "@/server/vision/monitorReadingProvider";

const image = {
	bytes: new Uint8Array([0xff, 0xd8, 0xff]),
	mimeType: "image/jpeg",
};

describe("monitor reading extraction", () => {
	it("validates provider output", () => {
		expect(
			validateExtractedReading({
				systolic: 126,
				diastolic: 78,
				pulse: 64,
				confidence: { systolic: 0.98, diastolic: 0.97, pulse: 0.9 },
				warnings: [],
			}),
		).toMatchObject({ systolic: 126, diastolic: 78, pulse: 64 });
	});

	it("warns when systolic is not greater than diastolic", () => {
		const result = validateExtractedReading({
			systolic: 75,
			diastolic: 80,
			pulse: null,
			confidence: { systolic: 0.8, diastolic: 0.8, pulse: null },
			warnings: [],
		});

		expect(result.warnings).toContain(
			"Check that the systolic reading is greater than diastolic.",
		);
	});

	it("rejects out-of-range provider output", () => {
		expect(() =>
			validateExtractedReading({
				systolic: 999,
				diastolic: 80,
				pulse: 60,
				confidence: { systolic: 1, diastolic: 1, pulse: 1 },
				warnings: [],
			}),
		).toThrow();
	});

	it("validates the result returned by an injected provider", async () => {
		const result = await extractMeasurementFromImage(image, {
			extractReading: async () => ({
				systolic: 120,
				diastolic: 80,
				pulse: null,
				confidence: { systolic: 0.9, diastolic: 0.9, pulse: null },
				warnings: [],
			}),
		});

		expect(result).toMatchObject({ systolic: 120, diastolic: 80 });
	});

	it("keeps the real extraction provider explicitly unimplemented", async () => {
		await expect(
			monitorReadingProvider.extractReading(image),
		).rejects.toBeInstanceOf(MonitorReadingExtractionNotImplementedError);
	});
});
