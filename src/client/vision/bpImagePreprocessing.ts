const WORKING_WIDTH = 480;
const WORKING_HEIGHT = 640;
const MODEL_WIDTH = 180;
const MODEL_HEIGHT = 80;
const BILATERAL_RADIUS = 5;
const BILATERAL_SIGMA = 11;
const ADAPTIVE_RADIUS = 5;

export interface LcdBounds {
	x: number;
	y: number;
	width: number;
	height: number;
	detection: "strict" | "relaxed" | "separate-pulse";
}

export interface PreprocessedMonitorRows {
	systolic: Float32Array;
	diastolic: Float32Array;
	pulse: Float32Array | null;
	lcdBounds: LcdBounds;
	pulseBounds: LcdBounds | null;
}

export interface MonitorImageDebugResult {
	workingRgba: Uint8ClampedArray;
	foreground: Uint8Array;
	lcdBounds: LcdBounds | null;
	pulseBounds: LcdBounds | null;
	systolic: Float32Array | null;
	diastolic: Float32Array | null;
	pulse: Float32Array | null;
}

export class MonitorImagePreprocessingError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "MonitorImagePreprocessingError";
	}
}

function yieldToBrowser() {
	return new Promise<void>((resolve) => setTimeout(resolve, 0));
}

async function decodeImage(image: File) {
	if (typeof createImageBitmap === "function") {
		try {
			return await createImageBitmap(image, { imageOrientation: "from-image" });
		} catch {
			return await createImageBitmap(image);
		}
	}

	const objectUrl = URL.createObjectURL(image);
	try {
		const element = document.createElement("img");
		element.src = objectUrl;
		await element.decode();
		return element;
	} finally {
		URL.revokeObjectURL(objectUrl);
	}
}

async function imageToWorkingPixels(image: File) {
	const source = await decodeImage(image);
	const sourceWidth =
		source instanceof HTMLImageElement ? source.naturalWidth : source.width;
	const sourceHeight =
		source instanceof HTMLImageElement ? source.naturalHeight : source.height;
	if (sourceWidth < 1 || sourceHeight < 1) {
		throw new MonitorImagePreprocessingError(
			"The selected image could not be decoded.",
		);
	}

	const canvas = document.createElement("canvas");
	canvas.width = WORKING_WIDTH;
	canvas.height = WORKING_HEIGHT;
	const context = canvas.getContext("2d", { willReadFrequently: true });
	if (!context) {
		throw new MonitorImagePreprocessingError(
			"Image processing is not supported by this browser.",
		);
	}

	// Match the 480 x 640 photographs used by the published model while
	// preserving the source aspect ratio. The capture guide keeps the LCD in
	// the center, so an object-cover crop is preferable to stretching it.
	const scale = Math.max(
		WORKING_WIDTH / sourceWidth,
		WORKING_HEIGHT / sourceHeight,
	);
	const cropWidth = WORKING_WIDTH / scale;
	const cropHeight = WORKING_HEIGHT / scale;
	const sourceX = (sourceWidth - cropWidth) / 2;
	const sourceY = (sourceHeight - cropHeight) / 2;
	context.drawImage(
		source,
		sourceX,
		sourceY,
		cropWidth,
		cropHeight,
		0,
		0,
		WORKING_WIDTH,
		WORKING_HEIGHT,
	);

	if (typeof ImageBitmap !== "undefined" && source instanceof ImageBitmap) {
		source.close();
	}
	return context.getImageData(0, 0, WORKING_WIDTH, WORKING_HEIGHT).data;
}

function toGrayscale(rgba: Uint8ClampedArray) {
	const grayscale = new Uint8Array(rgba.length / 4);
	for (let pixel = 0, rgbaIndex = 0; pixel < grayscale.length; pixel++) {
		grayscale[pixel] = Math.round(
			0.299 * rgba[rgbaIndex] +
				0.587 * rgba[rgbaIndex + 1] +
				0.114 * rgba[rgbaIndex + 2],
		);
		rgbaIndex += 4;
	}
	return grayscale;
}

async function bilateralFilter(
	input: Uint8Array,
	width: number,
	height: number,
) {
	const output = new Uint8Array(input.length);
	const colorWeights = new Float32Array(256);
	const denominator = 2 * BILATERAL_SIGMA * BILATERAL_SIGMA;
	for (let difference = 0; difference < colorWeights.length; difference++) {
		colorWeights[difference] = Math.exp(
			-(difference * difference) / denominator,
		);
	}

	const diameter = BILATERAL_RADIUS * 2 + 1;
	const spatialWeights = new Float32Array(diameter * diameter);
	for (
		let offsetY = -BILATERAL_RADIUS;
		offsetY <= BILATERAL_RADIUS;
		offsetY++
	) {
		for (
			let offsetX = -BILATERAL_RADIUS;
			offsetX <= BILATERAL_RADIUS;
			offsetX++
		) {
			const index =
				(offsetY + BILATERAL_RADIUS) * diameter + (offsetX + BILATERAL_RADIUS);
			spatialWeights[index] = Math.exp(
				-(offsetX * offsetX + offsetY * offsetY) / denominator,
			);
		}
	}

	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			const center = input[y * width + x];
			let weightedValue = 0;
			let totalWeight = 0;

			for (
				let offsetY = -BILATERAL_RADIUS;
				offsetY <= BILATERAL_RADIUS;
				offsetY++
			) {
				const sampleY = Math.min(height - 1, Math.max(0, y + offsetY));
				for (
					let offsetX = -BILATERAL_RADIUS;
					offsetX <= BILATERAL_RADIUS;
					offsetX++
				) {
					const sampleX = Math.min(width - 1, Math.max(0, x + offsetX));
					const sample = input[sampleY * width + sampleX];
					const spatialIndex =
						(offsetY + BILATERAL_RADIUS) * diameter +
						(offsetX + BILATERAL_RADIUS);
					const weight =
						spatialWeights[spatialIndex] *
						colorWeights[Math.abs(sample - center)];
					weightedValue += sample * weight;
					totalWeight += weight;
				}
			}

			output[y * width + x] = Math.round(weightedValue / totalWeight);
		}

		if (y > 0 && y % 32 === 0) await yieldToBrowser();
	}

	return output;
}

function applyGamma(input: Uint8Array, gamma: number) {
	const lookup = new Uint8Array(256);
	const inverseGamma = 1 / gamma;
	for (let value = 0; value < lookup.length; value++) {
		lookup[value] = Math.round((value / 255) ** inverseGamma * 255);
	}
	return input.map((value) => lookup[value]);
}

function adaptiveDarkPixels(input: Uint8Array, width: number, height: number) {
	const stride = width + 1;
	const integral = new Float64Array(stride * (height + 1));
	for (let y = 0; y < height; y++) {
		let rowSum = 0;
		for (let x = 0; x < width; x++) {
			rowSum += input[y * width + x];
			integral[(y + 1) * stride + x + 1] =
				integral[y * stride + x + 1] + rowSum;
		}
	}

	const dark = new Uint8Array(input.length);
	for (let y = 0; y < height; y++) {
		const top = Math.max(0, y - ADAPTIVE_RADIUS);
		const bottom = Math.min(height - 1, y + ADAPTIVE_RADIUS);
		for (let x = 0; x < width; x++) {
			const left = Math.max(0, x - ADAPTIVE_RADIUS);
			const right = Math.min(width - 1, x + ADAPTIVE_RADIUS);
			const sum =
				integral[(bottom + 1) * stride + right + 1] -
				integral[top * stride + right + 1] -
				integral[(bottom + 1) * stride + left] +
				integral[top * stride + left];
			const sampleCount = (right - left + 1) * (bottom - top + 1);
			if (input[y * width + x] <= sum / sampleCount - 2) {
				dark[y * width + x] = 1;
			}
		}
	}
	return dark;
}

function dilate(input: Uint8Array, width: number, height: number) {
	const output = new Uint8Array(input.length);
	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			let foreground = 0;
			for (let offsetY = -1; offsetY <= 1 && !foreground; offsetY++) {
				const sampleY = Math.min(height - 1, Math.max(0, y + offsetY));
				for (let offsetX = -1; offsetX <= 1; offsetX++) {
					const sampleX = Math.min(width - 1, Math.max(0, x + offsetX));
					if (input[sampleY * width + sampleX]) {
						foreground = 1;
						break;
					}
				}
			}
			output[y * width + x] = foreground;
		}
	}
	return output;
}

interface Component extends Omit<LcdBounds, "detection"> {
	pixels: number;
}

function connectedComponents(input: Uint8Array, width: number, height: number) {
	const visited = new Uint8Array(input.length);
	const queue = new Int32Array(input.length);
	const components: Component[] = [];

	for (let start = 0; start < input.length; start++) {
		if (!input[start] || visited[start]) continue;

		let head = 0;
		let tail = 1;
		queue[0] = start;
		visited[start] = 1;
		let minX = start % width;
		let maxX = minX;
		let minY = Math.floor(start / width);
		let maxY = minY;
		let pixels = 0;

		while (head < tail) {
			const current = queue[head++];
			const x = current % width;
			const y = Math.floor(current / width);
			pixels++;
			minX = Math.min(minX, x);
			maxX = Math.max(maxX, x);
			minY = Math.min(minY, y);
			maxY = Math.max(maxY, y);

			for (let offsetY = -1; offsetY <= 1; offsetY++) {
				const nextY = y + offsetY;
				if (nextY < 0 || nextY >= height) continue;
				for (let offsetX = -1; offsetX <= 1; offsetX++) {
					if (offsetX === 0 && offsetY === 0) continue;
					const nextX = x + offsetX;
					if (nextX < 0 || nextX >= width) continue;
					const next = nextY * width + nextX;
					if (!input[next] || visited[next]) continue;
					visited[next] = 1;
					queue[tail++] = next;
				}
			}
		}

		components.push({
			x: minX,
			y: minY,
			width: maxX - minX + 1,
			height: maxY - minY + 1,
			pixels,
		});
	}

	return components;
}

export function findLcdBounds(
	foreground: Uint8Array,
	width: number,
	height: number,
): LcdBounds | null {
	const imageArea = width * height;
	const components = connectedComponents(foreground, width, height);
	const score = (component: Component) => {
		const centerX = component.x + component.width / 2;
		const centerY = component.y + component.height / 2;
		const centerDistance = Math.hypot(
			(centerX - width / 2) / width,
			(centerY - height / 2) / height,
		);
		const aspectRatio = component.width / component.height;
		const areaRatio = (component.width * component.height) / imageArea;
		return (
			Math.abs(aspectRatio - 1.15) * 1.5 +
			Math.abs(areaRatio - 0.18) +
			centerDistance
		);
	};
	const select = (relaxed: boolean) =>
		components
			.filter((component) => {
				const boundingArea = component.width * component.height;
				const areaRatio = boundingArea / imageArea;
				const aspectRatio = component.width / component.height;
				const density = component.pixels / boundingArea;
				return (
					component.width >= width * (relaxed ? 0.2 : 0.25) &&
					component.height >= height * (relaxed ? 0.12 : 0.16) &&
					// Some monitors place pulse below SYS/DIA in one tall LCD. Accept
					// that combined display so each visible number row can be isolated.
					aspectRatio >= (relaxed ? 0.6 : 0.95) &&
					aspectRatio <= (relaxed ? 1.75 : 1.5) &&
					areaRatio >= (relaxed ? 0.035 : 0.065) &&
					areaRatio <= (relaxed ? 0.38 : 0.27) &&
					density >= 0.01 &&
					density <= 0.72
				);
			})
			.sort((left, right) => score(left) - score(right))[0];

	const strict = select(false);
	if (strict) {
		return {
			x: strict.x,
			y: strict.y,
			width: strict.width,
			height: strict.height,
			detection: "strict",
		};
	}
	const relaxed = select(true);
	return relaxed
		? {
				x: relaxed.x,
				y: relaxed.y,
				width: relaxed.width,
				height: relaxed.height,
				detection: "relaxed",
			}
		: null;
}

export function findSeparatePulseBounds(
	foreground: Uint8Array,
	width: number,
	height: number,
	main: LcdBounds,
): LcdBounds | null {
	const mainBottom = main.y + main.height;
	const mainCenterX = main.x + main.width / 2;
	const candidates = connectedComponents(foreground, width, height)
		.filter((component) => {
			const centerX = component.x + component.width / 2;
			const horizontalOverlap =
				Math.max(
					0,
					Math.min(component.x + component.width, main.x + main.width) -
						Math.max(component.x, main.x),
				) / Math.min(component.width, main.width);
			const aspectRatio = component.width / component.height;
			const density = component.pixels / (component.width * component.height);
			return (
				component.y >= main.y + main.height * 0.75 &&
				component.y <= mainBottom + main.height * 0.75 &&
				component.width >= main.width * 0.45 &&
				component.width <= main.width * 1.25 &&
				component.height >= main.height * 0.15 &&
				component.height <= main.height * 0.55 &&
				aspectRatio >= 1.8 &&
				aspectRatio <= 6 &&
				horizontalOverlap >= 0.6 &&
				density >= 0.01 &&
				density <= 0.72 &&
				Math.abs(centerX - mainCenterX) <= main.width * 0.35
			);
		})
		.sort((left, right) => {
			const score = (component: Component) => {
				const widthRatio = component.width / main.width;
				const heightRatio = component.height / main.height;
				const centerOffset =
					Math.abs(component.x + component.width / 2 - mainCenterX) /
					main.width;
				const gap = Math.max(0, component.y - mainBottom) / main.height;
				return (
					Math.abs(widthRatio - 0.95) +
					Math.abs(heightRatio - 0.32) +
					centerOffset +
					gap
				);
			};
			return score(left) - score(right);
		});

	const pulse = candidates[0];
	return pulse
		? {
				x: pulse.x,
				y: pulse.y,
				width: pulse.width,
				height: pulse.height,
				detection: "separate-pulse",
			}
		: null;
}

function resizeBilinear(
	input: Uint8Array,
	inputWidth: number,
	inputHeight: number,
) {
	const output = new Float32Array(MODEL_WIDTH * MODEL_HEIGHT);
	for (let outputY = 0; outputY < MODEL_HEIGHT; outputY++) {
		const sourceY = ((outputY + 0.5) * inputHeight) / MODEL_HEIGHT - 0.5;
		const top = Math.max(0, Math.floor(sourceY));
		const bottom = Math.min(inputHeight - 1, top + 1);
		const yWeight = Math.max(0, sourceY - top);
		for (let outputX = 0; outputX < MODEL_WIDTH; outputX++) {
			const sourceX = ((outputX + 0.5) * inputWidth) / MODEL_WIDTH - 0.5;
			const left = Math.max(0, Math.floor(sourceX));
			const right = Math.min(inputWidth - 1, left + 1);
			const xWeight = Math.max(0, sourceX - left);
			const topValue =
				input[top * inputWidth + left] * (1 - xWeight) +
				input[top * inputWidth + right] * xWeight;
			const bottomValue =
				input[bottom * inputWidth + left] * (1 - xWeight) +
				input[bottom * inputWidth + right] * xWeight;
			output[outputY * MODEL_WIDTH + outputX] =
				(topValue * (1 - yWeight) + bottomValue * yWeight) * 255;
		}
	}
	return output;
}

function extractRows(
	foreground: Uint8Array,
	bounds: LcdBounds,
	pulseBounds: LcdBounds | null,
) {
	const frameWidth = bounds.width;
	const frameHeight = bounds.height;
	const squareExtent = Math.min(frameWidth, frameHeight);
	const combinedDisplay = frameHeight / frameWidth >= 1.15;

	const extract = (startY: number, endY: number) => {
		const rowHeight = endY - startY;
		const row = new Uint8Array(squareExtent * rowHeight);
		for (let localY = startY; localY < endY; localY++) {
			for (let localX = 0; localX < squareExtent; localX++) {
				const insidePaperMask =
					localX >= frameWidth * (combinedDisplay ? 0.2 : 1 / 8) &&
					localX <= frameWidth * (combinedDisplay ? 0.95 : 7 / 8) &&
					localY >= frameHeight / 16 &&
					localY <= (frameHeight * 15) / 16;
				if (!insidePaperMask) continue;
				const source = (bounds.y + localY) * WORKING_WIDTH + bounds.x + localX;
				row[(localY - startY) * squareExtent + localX] = foreground[source];
			}
		}
		return resizeBilinear(row, squareExtent, rowHeight);
	};

	// A combined LCD is taller because pulse appears below SYS and DIA. The
	// number rows do not occupy exact thirds: the top status area and the
	// smaller pulse row need different padding. Slight overlap avoids clipping
	// seven-segment digits at a boundary.
	if (combinedDisplay) {
		const band = (start: number, end: number) => [
			Math.floor(frameHeight * start),
			Math.min(frameHeight, Math.ceil(frameHeight * end)),
		];
		const [systolicStart, systolicEnd] = band(0.1, 0.46);
		const [diastolicStart, diastolicEnd] = band(0.44, 0.76);
		const [pulseStart, pulseEnd] = band(0.76, 0.98);
		return {
			systolic: extract(systolicStart, systolicEnd),
			diastolic: extract(diastolicStart, diastolicEnd),
			pulse: extract(pulseStart, pulseEnd),
		};
	}

	const extractSeparatePulse = () => {
		if (!pulseBounds) return null;
		const cropWidth = Math.max(1, Math.floor(pulseBounds.width * 0.62));
		const row = new Uint8Array(cropWidth * pulseBounds.height);
		for (let localY = 0; localY < pulseBounds.height; localY++) {
			for (let localX = 0; localX < cropWidth; localX++) {
				const insideDisplay =
					localX >= cropWidth * 0.1 &&
					localX <= cropWidth * 0.95 &&
					localY >= pulseBounds.height * 0.15 &&
					localY <= pulseBounds.height * 0.8;
				if (!insideDisplay) continue;
				const source =
					(pulseBounds.y + localY) * WORKING_WIDTH + pulseBounds.x + localX;
				row[localY * cropWidth + localX] = foreground[source];
			}
		}
		return resizeBilinear(row, cropWidth, pulseBounds.height);
	};

	// Preserve the repository's training crop for separate-pulse monitors: its
	// width/height names were reversed, so the split is based on LCD width.
	const splitY = Math.min(squareExtent - 1, Math.floor(frameWidth / 2));
	if (splitY < 1 || squareExtent - splitY < 1) {
		throw new MonitorImagePreprocessingError(
			"The monitor display is too small to read.",
		);
	}
	return {
		systolic: extract(0, splitY),
		diastolic: extract(splitY, squareExtent),
		pulse: extractSeparatePulse(),
	};
}

export async function preprocessMonitorImage(
	image: File,
): Promise<PreprocessedMonitorRows> {
	const rgba = await imageToWorkingPixels(image);
	return preprocessWorkingRgba(rgba);
}

async function buildWorkingArtifacts(rgba: Uint8ClampedArray) {
	if (rgba.length !== WORKING_WIDTH * WORKING_HEIGHT * 4) {
		throw new MonitorImagePreprocessingError(
			"The working image must be 480 by 640 pixels.",
		);
	}
	const grayscale = toGrayscale(rgba);
	const smoothed = await bilateralFilter(
		grayscale,
		WORKING_WIDTH,
		WORKING_HEIGHT,
	);
	const gammaCorrected = applyGamma(smoothed, 0.7);
	const dark = adaptiveDarkPixels(
		gammaCorrected,
		WORKING_WIDTH,
		WORKING_HEIGHT,
	);
	const foreground = dilate(dark, WORKING_WIDTH, WORKING_HEIGHT);
	const lcdBounds = findLcdBounds(foreground, WORKING_WIDTH, WORKING_HEIGHT);
	const pulseBounds =
		lcdBounds && lcdBounds.height / lcdBounds.width < 1.15
			? findSeparatePulseBounds(
					foreground,
					WORKING_WIDTH,
					WORKING_HEIGHT,
					lcdBounds,
				)
			: null;
	return { foreground, lcdBounds, pulseBounds };
}

export async function debugPreprocessMonitorImage(
	image: File,
): Promise<MonitorImageDebugResult> {
	const workingRgba = await imageToWorkingPixels(image);
	return debugPreprocessWorkingRgba(workingRgba);
}

export async function debugPreprocessWorkingRgba(
	workingRgba: Uint8ClampedArray,
): Promise<MonitorImageDebugResult> {
	const { foreground, lcdBounds, pulseBounds } =
		await buildWorkingArtifacts(workingRgba);
	const rows = lcdBounds
		? extractRows(foreground, lcdBounds, pulseBounds)
		: null;
	return {
		workingRgba,
		foreground,
		lcdBounds,
		pulseBounds,
		systolic: rows?.systolic ?? null,
		diastolic: rows?.diastolic ?? null,
		pulse: rows?.pulse ?? null,
	};
}

export async function preprocessWorkingRgba(
	rgba: Uint8ClampedArray,
): Promise<PreprocessedMonitorRows> {
	const { foreground, lcdBounds, pulseBounds } =
		await buildWorkingArtifacts(rgba);
	if (!lcdBounds) {
		throw new MonitorImagePreprocessingError(
			"We could not find the monitor display. Retake the photo straight-on with the screen filling the frame.",
		);
	}

	return {
		...extractRows(foreground, lcdBounds, pulseBounds),
		lcdBounds,
		pulseBounds,
	};
}

export const BP_MODEL_INPUT = {
	width: MODEL_WIDTH,
	height: MODEL_HEIGHT,
} as const;
