import type { ExtractedReading } from "@/core/measurements/extractedReading";

export interface MonitorImage {
	bytes: Uint8Array;
	mimeType: string;
}

export interface MonitorReadingProvider {
	extractReading(image: MonitorImage): Promise<ExtractedReading>;
}

export class MonitorReadingExtractionNotImplementedError extends Error {
	constructor() {
		super("Image measurement extraction is not implemented yet.");
		this.name = "MonitorReadingExtractionNotImplementedError";
	}
}

export const monitorReadingProvider: MonitorReadingProvider = {
	async extractReading(_image) {
		throw new MonitorReadingExtractionNotImplementedError();
	},
};
