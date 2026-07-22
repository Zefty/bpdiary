import { useEffect, useRef } from "react";
import type {
	LcdBounds,
	MonitorImageDebugResult,
} from "@/client/vision/bpImagePreprocessing";

interface PixelCanvasProps {
	pixels: ArrayLike<number>;
	width: number;
	height: number;
	valueScale?: number;
	lcdBounds?: LcdBounds | null;
	pulseBounds?: LcdBounds | null;
	label: string;
}

function PixelCanvas({
	pixels,
	width,
	height,
	valueScale = 1,
	lcdBounds,
	pulseBounds,
	label,
}: PixelCanvasProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		const context = canvas?.getContext("2d");
		if (!canvas || !context) return;

		const rgba = context.createImageData(width, height);
		for (let index = 0; index < pixels.length; index++) {
			const value = Math.round(pixels[index] * valueScale);
			const outputIndex = index * 4;
			rgba.data[outputIndex] = value;
			rgba.data[outputIndex + 1] = value;
			rgba.data[outputIndex + 2] = value;
			rgba.data[outputIndex + 3] = 255;
		}
		context.putImageData(rgba, 0, 0);

		if (lcdBounds) {
			context.strokeStyle = "#ef4444";
			context.lineWidth = 4;
			context.strokeRect(
				lcdBounds.x,
				lcdBounds.y,
				lcdBounds.width,
				lcdBounds.height,
			);
		}
		if (pulseBounds) {
			context.strokeStyle = "#22c55e";
			context.lineWidth = 4;
			context.strokeRect(
				pulseBounds.x,
				pulseBounds.y,
				pulseBounds.width,
				pulseBounds.height,
			);
		}
	}, [height, lcdBounds, pixels, pulseBounds, valueScale, width]);

	return (
		<canvas
			ref={canvasRef}
			width={width}
			height={height}
			role="img"
			aria-label={label}
			className="h-auto w-full rounded-xl border border-border bg-black [image-rendering:pixelated]"
		/>
	);
}

interface RgbaCanvasProps {
	pixels: Uint8ClampedArray;
	lcdBounds: LcdBounds | null;
	pulseBounds: LcdBounds | null;
}

function RgbaCanvas({ pixels, lcdBounds, pulseBounds }: RgbaCanvasProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		const context = canvas?.getContext("2d");
		if (!canvas || !context) return;

		const imageData = context.createImageData(480, 640);
		imageData.data.set(pixels);
		context.putImageData(imageData, 0, 0);
		if (lcdBounds) {
			context.strokeStyle = "#ef4444";
			context.lineWidth = 4;
			context.strokeRect(
				lcdBounds.x,
				lcdBounds.y,
				lcdBounds.width,
				lcdBounds.height,
			);
		}
		if (pulseBounds) {
			context.strokeStyle = "#22c55e";
			context.lineWidth = 4;
			context.strokeRect(
				pulseBounds.x,
				pulseBounds.y,
				pulseBounds.width,
				pulseBounds.height,
			);
		}
	}, [lcdBounds, pixels, pulseBounds]);

	return (
		<canvas
			ref={canvasRef}
			width={480}
			height={640}
			role="img"
			aria-label="The centered 480 by 640 working crop"
			className="h-auto w-full rounded-xl border border-border bg-black"
		/>
	);
}

interface MeasurementPhotoDebugProps {
	result: MonitorImageDebugResult;
}

export function MeasurementPhotoDebug({ result }: MeasurementPhotoDebugProps) {
	return (
		<div className="mt-3 rounded-2xl border border-dashed border-amber-500/50 bg-amber-500/5 p-3">
			<div className="mb-3">
				<p className="text-sm font-semibold">Preprocessing debug</p>
				{result.lcdBounds ? (
					<p className="mt-1 text-xs text-muted-foreground">
						LCD {result.lcdBounds.detection} match: x={result.lcdBounds.x}, y=
						{result.lcdBounds.y}, width={result.lcdBounds.width}, height=
						{result.lcdBounds.height}. The red box is the detected BP region.
						{result.pulseBounds
							? " The green box is the separate pulse display."
							: ""}
					</p>
				) : (
					<p className="mt-1 text-xs font-medium text-amber-800 dark:text-amber-200">
						No connected component matched the expected LCD shape. Compare the
						crop and mask below.
					</p>
				)}
			</div>

			<div className="grid grid-cols-2 gap-3">
				<figure>
					<RgbaCanvas
						pixels={result.workingRgba}
						lcdBounds={result.lcdBounds}
						pulseBounds={result.pulseBounds}
					/>
					<figcaption className="mt-1 text-xs text-muted-foreground">
						480×640 working crop
					</figcaption>
				</figure>
				<figure>
					<PixelCanvas
						pixels={result.foreground}
						width={480}
						height={640}
						valueScale={255}
						lcdBounds={result.lcdBounds}
						pulseBounds={result.pulseBounds}
						label="Thresholded foreground mask used to detect the monitor display"
					/>
					<figcaption className="mt-1 text-xs text-muted-foreground">
						Detection mask
					</figcaption>
				</figure>

				{result.systolic && result.diastolic && (
					<>
						<figure className="col-span-2">
							<PixelCanvas
								pixels={result.systolic}
								width={180}
								height={80}
								label="Final systolic model input"
							/>
							<figcaption className="mt-1 text-xs text-muted-foreground">
								Systolic model input · 180×80
							</figcaption>
						</figure>
						<figure className="col-span-2">
							<PixelCanvas
								pixels={result.diastolic}
								width={180}
								height={80}
								label="Final diastolic model input"
							/>
							<figcaption className="mt-1 text-xs text-muted-foreground">
								Diastolic model input · 180×80
							</figcaption>
						</figure>
					</>
				)}
				{result.pulse && (
					<figure className="col-span-2">
						<PixelCanvas
							pixels={result.pulse}
							width={180}
							height={80}
							label="Final pulse model input"
						/>
						<figcaption className="mt-1 text-xs text-muted-foreground">
							Pulse model input · 180×80
						</figcaption>
					</figure>
				)}
			</div>
		</div>
	);
}
