import { describe, expect, it } from "vitest";
import { tryCatch } from "@/core/lib/utils";

describe("tryCatch", () => {
	it("returns resolved data", async () => {
		await expect(tryCatch(Promise.resolve("ready"))).resolves.toEqual({
			data: "ready",
			error: null,
		});
	});

	it("returns rejected errors", async () => {
		const error = new Error("failed");

		await expect(tryCatch(Promise.reject(error))).resolves.toEqual({
			data: null,
			error,
		});
	});
});
