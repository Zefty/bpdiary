import { createFileRoute } from "@tanstack/react-router";
import { json } from "@tanstack/react-start";
import { auth } from "@/server/auth";
import { extractMeasurementFromImage } from "@/server/measurements/extractMeasurement";
import { MonitorReadingExtractionNotImplementedError } from "@/server/vision/monitorReadingProvider";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

function hasSupportedImageSignature(bytes: Uint8Array, mimeType: string) {
	if (mimeType === "image/jpeg") {
		return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
	}

	if (mimeType === "image/png") {
		return (
			bytes[0] === 0x89 &&
			bytes[1] === 0x50 &&
			bytes[2] === 0x4e &&
			bytes[3] === 0x47
		);
	}

	if (mimeType === "image/webp") {
		return (
			String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" &&
			String.fromCharCode(...bytes.slice(8, 12)) === "WEBP"
		);
	}

	return false;
}

export const Route = createFileRoute("/api/measurement-scan")({
	server: {
		handlers: {
			POST: async ({ request }) => {
				const session = await auth.api.getSession({ headers: request.headers });
				if (!session || session.session.expiresAt < new Date()) {
					return json({ message: "Unauthorized" }, { status: 401 });
				}

				let formData: FormData;
				try {
					formData = await request.formData();
				} catch {
					return json({ message: "Invalid image upload." }, { status: 400 });
				}

				const image = formData.get("image");
				if (!(image instanceof File)) {
					return json({ message: "Choose an image to scan." }, { status: 400 });
				}

				if (!ACCEPTED_IMAGE_TYPES.has(image.type)) {
					return json(
						{ message: "Use a JPEG, PNG, or WebP image." },
						{ status: 415 },
					);
				}

				if (image.size === 0 || image.size > MAX_IMAGE_BYTES) {
					return json(
						{ message: "The image must be smaller than 5 MB." },
						{ status: 413 },
					);
				}

				const bytes = new Uint8Array(await image.arrayBuffer());
				if (!hasSupportedImageSignature(bytes, image.type)) {
					return json(
						{ message: "The selected file is not a valid image." },
						{ status: 415 },
					);
				}

				try {
					const reading = await extractMeasurementFromImage({
						bytes,
						mimeType: image.type,
					});
					return json({ data: reading });
				} catch (error) {
					if (error instanceof MonitorReadingExtractionNotImplementedError) {
						return json({ message: error.message }, { status: 501 });
					}

					return json(
						{ message: "The monitor image could not be processed." },
						{ status: 500 },
					);
				}
			},
		},
	},
});
