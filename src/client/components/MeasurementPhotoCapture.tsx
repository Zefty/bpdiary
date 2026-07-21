import { useMutation } from "@tanstack/react-query";
import {
	Camera,
	ImagePlus,
	LoaderCircle,
	RotateCcw,
	ScanLine,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
	type ExtractedReading,
	extractedReadingSchema,
} from "@/core/measurements/extractedReading";
import { Button } from "./shadcn/button";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

interface MeasurementPhotoCaptureProps {
	onExtracted: (reading: ExtractedReading) => void;
}

async function scanMonitorImage(image: File) {
	const formData = new FormData();
	formData.set("image", image);

	const response = await fetch("/api/measurement-scan", {
		method: "POST",
		body: formData,
	});
	const body: unknown = await response.json().catch(() => null);

	if (!response.ok) {
		const message =
			typeof body === "object" &&
			body !== null &&
			"message" in body &&
			typeof body.message === "string"
				? body.message
				: "The monitor image could not be processed.";
		throw new Error(message);
	}

	if (typeof body !== "object" || body === null || !("data" in body)) {
		throw new Error("The scan returned an invalid response.");
	}

	return extractedReadingSchema.parse(body.data);
}

export function MeasurementPhotoCapture({
	onExtracted,
}: MeasurementPhotoCaptureProps) {
	const inputRef = useRef<HTMLInputElement>(null);
	const [image, setImage] = useState<File | null>(null);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const [selectionError, setSelectionError] = useState<string | null>(null);
	const mutation = useMutation({
		mutationFn: scanMonitorImage,
		onSuccess: onExtracted,
	});

	useEffect(() => {
		if (!image) {
			setPreviewUrl(null);
			return;
		}

		const objectUrl = URL.createObjectURL(image);
		setPreviewUrl(objectUrl);
		return () => URL.revokeObjectURL(objectUrl);
	}, [image]);

	const chooseImage = (selected: File | undefined) => {
		mutation.reset();
		setSelectionError(null);

		if (!selected) return;
		if (!ACCEPTED_IMAGE_TYPES.has(selected.type)) {
			setSelectionError("Choose a JPEG, PNG, or WebP image.");
			return;
		}
		if (selected.size === 0 || selected.size > MAX_IMAGE_BYTES) {
			setSelectionError("The image must be smaller than 5 MB.");
			return;
		}

		setImage(selected);
	};

	const clearImage = () => {
		mutation.reset();
		setSelectionError(null);
		setImage(null);
		if (inputRef.current) inputRef.current.value = "";
	};

	return (
		<section className="rounded-3xl border border-border bg-secondary/35 p-4">
			<input
				ref={inputRef}
				type="file"
				accept="image/jpeg,image/png,image/webp"
				capture="environment"
				className="sr-only"
				onChange={(event) => chooseImage(event.target.files?.[0])}
				aria-label="Take or choose a photo of your blood pressure monitor"
			/>

			<div className="mb-3 text-center">
				<p className="text-sm font-semibold">Photograph the monitor display</p>
				<p className="mt-1 text-xs text-muted-foreground">
					Fill the photo with the screen and make every number easy to read.
				</p>
			</div>

			<div className="mx-auto max-w-sm rounded-[2rem] border border-border/80 bg-background p-3 shadow-[0_12px_30px_-22px_rgba(30,43,55,0.55)]">
				<div className="flex aspect-[16/9] items-center justify-center overflow-hidden rounded-2xl border border-slate-950/20 bg-slate-900 shadow-inner dark:bg-slate-950">
					{image && previewUrl ? (
						<img
							src={previewUrl}
							alt="Selected blood pressure monitor display"
							className="size-full object-contain"
						/>
					) : (
						<div className="flex flex-col items-center gap-2 text-center text-slate-300">
							<Camera className="size-7" />
							<span className="text-xs font-medium">Monitor screen</span>
						</div>
					)}
				</div>
				<div
					className="flex items-center justify-center gap-3 pt-3"
					aria-hidden="true"
				>
					<span className="size-2 rounded-full bg-muted-foreground/25" />
					<span className="size-5 rounded-full border border-border bg-secondary shadow-inner" />
					<span className="size-2 rounded-full bg-muted-foreground/25" />
				</div>
			</div>

			{image && previewUrl ? (
				<div className="mt-3 space-y-3">
					<div className="text-xs text-muted-foreground">
						<p className="truncate">{image.name}</p>
						<p className="mt-1">The complete photo will be scanned.</p>
					</div>
					<div className="flex flex-wrap gap-2">
						<Button
							type="button"
							size="sm"
							className="rounded-xl"
							disabled={mutation.isPending}
							onClick={() => mutation.mutate(image)}
						>
							{mutation.isPending ? (
								<LoaderCircle className="size-4 animate-spin" />
							) : (
								<ScanLine className="size-4" />
							)}
							{mutation.isPending ? "Reading photo" : "Read photo"}
						</Button>
						<Button
							type="button"
							variant="outline"
							size="sm"
							className="rounded-xl"
							disabled={mutation.isPending}
							onClick={() => inputRef.current?.click()}
						>
							<RotateCcw className="size-4" /> Replace
						</Button>
						<Button
							type="button"
							variant="ghost"
							size="sm"
							className="rounded-xl"
							disabled={mutation.isPending}
							onClick={clearImage}
						>
							Remove
						</Button>
					</div>
				</div>
			) : (
				<div className="mt-3 flex justify-center">
					<Button
						type="button"
						variant="outline"
						size="sm"
						className="rounded-xl"
						onClick={() => inputRef.current?.click()}
					>
						<ImagePlus className="size-4" /> Add photo
					</Button>
				</div>
			)}

			{(selectionError || mutation.error) && (
				<p role="alert" className="mt-3 text-sm text-destructive">
					{selectionError ?? mutation.error?.message} You can still enter the
					reading manually.
				</p>
			)}
		</section>
	);
}
