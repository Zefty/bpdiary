import { describe, expect, it } from "vitest";
import {
	average,
	measurementInputSchema,
	measurementTrend,
} from "@/core/measurements/measurement";

describe("measurement domain", () => {
	it("calculates averages while ignoring missing pulse values", () => {
		expect(average([70, null, 73])).toBe(72);
		expect(average([null])).toBeNull();
	});

	it("compares current and previous averages", () => {
		expect(measurementTrend(122, 128)).toBe(-6);
		expect(measurementTrend(null, 128)).toBeNull();
	});

	it("rejects implausible form input before persistence", () => {
		expect(() =>
			measurementInputSchema.parse({
				measuredAt: "2026-07-20T08:00:00.000Z",
				systolic: 999,
				diastolic: 80,
				pulse: 65,
			}),
		).toThrow();
	});
});
