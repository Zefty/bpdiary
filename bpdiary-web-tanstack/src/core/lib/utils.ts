import type { Result } from "../types";

export async function tryCatch<T, E = Error>(
	promise: Promise<T>,
	forceError?: boolean,
): Promise<Result<T, E>> {
	try {
		if (forceError) {
			throw new Error("Debug forced error state!");
		}
		const data = await promise;
		return { data, error: null };
	} catch (error) {
		return { data: null, error: error as E };
	}
}
