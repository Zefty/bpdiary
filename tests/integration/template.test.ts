import { describe, expect, it } from "vitest";
import { cn } from "@/client/lib/utils";
import { tryCatch } from "@/core/lib/utils";

describe("bp diary integration", () => {
	it("composes shared client and core utilities", async () => {
		const result = await tryCatch(Promise.resolve(cn("px-2", "px-4")));

		expect(result).toEqual({ data: "px-4", error: null });
	});
});
