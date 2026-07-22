import type { LayersModel, Tensor } from "@tensorflow/tfjs";
import {
	type ExtractedReading,
	validateExtractedReading,
} from "@/core/measurements/extractedReading";
import {
	BP_MODEL_INPUT,
	MonitorImagePreprocessingError,
	preprocessMonitorImage,
} from "./bpImagePreprocessing";

const MODEL_URL = "/models/bp-reader/model.json";
const MEDIUM_CONFIDENCE = 0.9;
const MINIMUM_CONFIDENCE = 0.6;
const MINIMUM_PULSE_CONFIDENCE = 0.3;

interface LoadedModel {
	model: LayersModel;
	tf: typeof import("@tensorflow/tfjs");
}

let loadedModel: Promise<LoadedModel> | null = null;

async function loadBpModel(): Promise<LoadedModel> {
	if (!loadedModel) {
		loadedModel = import("@tensorflow/tfjs")
			.then(async (tf) => {
				await tf.ready();
				const model = await tf.loadLayersModel(MODEL_URL);
				return { model, tf };
			})
			.catch((error) => {
				loadedModel = null;
				throw error;
			});
	}
	return loadedModel;
}

export interface DecodedBpPrediction {
	value: number | null;
	confidence: number;
	digits: [number, number, number];
}

export function decodeBpPrediction(
	probabilities: readonly [
		ArrayLike<number>,
		ArrayLike<number>,
		ArrayLike<number>,
	],
	sampleIndex: number,
): DecodedBpPrediction {
	const digits = probabilities.map((head) => {
		let bestClass = 0;
		for (let classIndex = 1; classIndex < 11; classIndex++) {
			if (
				head[sampleIndex * 11 + classIndex] > head[sampleIndex * 11 + bestClass]
			) {
				bestClass = classIndex;
			}
		}
		return bestClass;
	}) as [number, number, number];
	const confidence = probabilities.reduce(
		(product, head, index) => product * head[sampleIndex * 11 + digits[index]],
		1,
	);

	if (digits[1] === 10 || digits[2] === 10) {
		return { value: null, confidence, digits };
	}

	const value =
		digits[0] === 10
			? digits[1] * 10 + digits[2]
			: digits[0] * 100 + digits[1] * 10 + digits[2];
	return { value, confidence, digits };
}

function acceptedValue(
	prediction: DecodedBpPrediction,
	minimum: number,
	maximum: number,
	minimumConfidence = MINIMUM_CONFIDENCE,
) {
	if (
		prediction.value === null ||
		prediction.confidence < minimumConfidence ||
		prediction.value < minimum ||
		prediction.value > maximum
	) {
		return null;
	}
	return prediction.value;
}

function appendPredictionWarnings(
	warnings: string[],
	label: string,
	prediction: DecodedBpPrediction,
	value: number | null,
) {
	if (value === null) {
		warnings.push(
			`The ${label.toLowerCase()} value was not clear enough. Enter it manually.`,
		);
	} else if (prediction.confidence < MEDIUM_CONFIDENCE) {
		warnings.push(`Double-check the detected ${label.toLowerCase()} value.`);
	}
}

export async function extractReadingFromMonitorPhoto(
	image: File,
): Promise<ExtractedReading> {
	try {
		const [preprocessed, { model, tf }] = await Promise.all([
			preprocessMonitorImage(image),
			loadBpModel(),
		]);
		const rows = [preprocessed.systolic, preprocessed.diastolic];
		if (preprocessed.pulse) rows.push(preprocessed.pulse);
		const pixelsPerRow = BP_MODEL_INPUT.width * BP_MODEL_INPUT.height;
		const batch = new Float32Array(rows.length * pixelsPerRow);
		rows.forEach((row, index) => {
			batch.set(row, index * pixelsPerRow);
		});
		const input = tf.tensor4d(batch, [
			rows.length,
			BP_MODEL_INPUT.height,
			BP_MODEL_INPUT.width,
			1,
		]);
		const output = model.predict(input) as Tensor[];
		const probabilities = (await Promise.all(
			output.map((tensor) => tensor.data()),
		)) as [Float32Array, Float32Array, Float32Array];
		input.dispose();
		for (const tensor of output) tensor.dispose();

		const systolicPrediction = decodeBpPrediction(probabilities, 0);
		const diastolicPrediction = decodeBpPrediction(probabilities, 1);
		const pulsePrediction = preprocessed.pulse
			? decodeBpPrediction(probabilities, 2)
			: null;
		const systolic = acceptedValue(systolicPrediction, 50, 300);
		const diastolic = acceptedValue(diastolicPrediction, 30, 200);
		const pulse = pulsePrediction
			? acceptedValue(pulsePrediction, 20, 250, MINIMUM_PULSE_CONFIDENCE)
			: null;
		if (systolic === null && diastolic === null) {
			throw new MonitorImagePreprocessingError(
				"The numbers were not clear enough to use. Retake the photo without glare or blur.",
			);
		}

		const warnings = [
			"Compare the detected values with the photo before saving.",
		];
		appendPredictionWarnings(
			warnings,
			"Systolic",
			systolicPrediction,
			systolic,
		);
		appendPredictionWarnings(
			warnings,
			"Diastolic",
			diastolicPrediction,
			diastolic,
		);
		if (pulsePrediction) {
			appendPredictionWarnings(warnings, "Pulse", pulsePrediction, pulse);
			warnings.push(
				"Pulse recognition is experimental because the published model was trained on blood-pressure rows. Check it carefully.",
			);
		} else {
			warnings.push(
				"This monitor keeps pulse outside the detected BP display. Enter it manually if needed.",
			);
		}
		if (preprocessed.lcdBounds.detection === "relaxed") {
			warnings.push(
				"The screen was photographed at an unusual size or angle, so check all detected values carefully.",
			);
		}

		return validateExtractedReading({
			systolic,
			diastolic,
			pulse,
			confidence: {
				systolic: systolicPrediction.confidence,
				diastolic: diastolicPrediction.confidence,
				pulse: pulsePrediction?.confidence ?? null,
			},
			warnings,
		});
	} catch (error) {
		if (error instanceof MonitorImagePreprocessingError) throw error;
		throw new Error(
			"The on-device reader could not process this photo. You can still enter the reading manually.",
			{ cause: error },
		);
	}
}
