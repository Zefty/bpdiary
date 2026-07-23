import { describe, expect, it } from "vitest";
import {
	findLcdBounds,
	findSeparatePulseBounds,
} from "@/client/vision/bpImagePreprocessing";
import { decodeBpPrediction } from "@/client/vision/bpMonitorReader";

function predictionHead(classes: [number, number]) {
	const values = new Float32Array(22);
	values[classes[0]] = 0.9;
	values[11 + classes[1]] = 0.8;
	return values;
}

describe("published BP monitor reader", () => {
	it("decodes three-digit and blank-leading two-digit measurements", () => {
		const probabilities = [
			predictionHead([1, 10]),
			predictionHead([2, 8]),
			predictionHead([6, 0]),
		] as const;

		expect(decodeBpPrediction(probabilities, 0)).toMatchObject({
			value: 126,
			digits: [1, 2, 6],
		});
		expect(decodeBpPrediction(probabilities, 1)).toMatchObject({
			value: 80,
			digits: [10, 8, 0],
		});
	});

	it("rejects a missing middle or final digit", () => {
		const probabilities = [
			predictionHead([1, 1]),
			predictionHead([10, 2]),
			predictionHead([6, 10]),
		] as const;

		expect(decodeBpPrediction(probabilities, 0).value).toBeNull();
		expect(decodeBpPrediction(probabilities, 1).value).toBeNull();
	});

	it("finds a centered square LCD outline without fixed pixel thresholds", () => {
		const width = 200;
		const height = 200;
		const foreground = new Uint8Array(width * height);
		for (let x = 60; x < 140; x++) {
			foreground[55 * width + x] = 1;
			foreground[134 * width + x] = 1;
		}
		for (let y = 55; y < 135; y++) {
			foreground[y * width + 60] = 1;
			foreground[y * width + 139] = 1;
		}

		expect(findLcdBounds(foreground, width, height)).toMatchObject({
			x: 60,
			y: 55,
			width: 80,
			height: 80,
		});
	});

	it("accepts a tall combined LCD with pulse below the BP readings", () => {
		const width = 200;
		const height = 240;
		const foreground = new Uint8Array(width * height);
		for (let x = 45; x < 155; x++) {
			foreground[40 * width + x] = 1;
			foreground[199 * width + x] = 1;
		}
		for (let y = 40; y < 200; y++) {
			foreground[y * width + 45] = 1;
			foreground[y * width + 154] = 1;
		}

		expect(findLcdBounds(foreground, width, height)).toMatchObject({
			x: 45,
			y: 40,
			width: 110,
			height: 160,
			detection: "relaxed",
		});
	});

	it("finds a wide pulse display below the main BP display", () => {
		const width = 200;
		const height = 200;
		const foreground = new Uint8Array(width * height);
		for (let x = 60; x < 140; x++) {
			foreground[40 * width + x] = 1;
			foreground[119 * width + x] = 1;
		}
		for (let y = 40; y < 120; y++) {
			foreground[y * width + 60] = 1;
			foreground[y * width + 139] = 1;
		}
		for (let x = 55; x < 145; x++) {
			foreground[130 * width + x] = 1;
			foreground[159 * width + x] = 1;
		}
		for (let y = 130; y < 160; y++) {
			foreground[y * width + 55] = 1;
			foreground[y * width + 144] = 1;
		}

		expect(
			findSeparatePulseBounds(foreground, width, height, {
				x: 60,
				y: 40,
				width: 80,
				height: 80,
				detection: "strict",
			}),
		).toMatchObject({
			x: 55,
			y: 130,
			width: 90,
			height: 30,
			detection: "separate-pulse",
		});
	});
});
