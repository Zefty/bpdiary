import {
	type ExtractedReading,
	validateExtractedReading,
} from "@/core/measurements/extractedReading";
import {
	type MonitorImage,
	type MonitorReadingProvider,
	monitorReadingProvider,
} from "@/server/vision/monitorReadingProvider";

export async function extractMeasurementFromImage(
	image: MonitorImage,
	provider: MonitorReadingProvider = monitorReadingProvider,
): Promise<ExtractedReading> {
	const extracted = await provider.extractReading(image);
	return validateExtractedReading(extracted);
}
