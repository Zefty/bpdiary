import { describe, expect, it } from "vitest";
import {
	diaryShareTokenSchema,
	sharedDiaryPageInputSchema,
} from "@/core/sharing/diaryShare";
import {
	createDiaryShareToken,
	hashDiaryShareToken,
} from "@/server/sharing/shareTokens";

describe("diary share tokens", () => {
	it("creates URL-safe 256-bit tokens accepted by the domain schema", () => {
		const token = createDiaryShareToken();

		expect(token).toHaveLength(43);
		expect(diaryShareTokenSchema.safeParse(token).success).toBe(true);
	});

	it("stores a deterministic hash rather than the raw token", () => {
		const token = createDiaryShareToken();
		const hash = hashDiaryShareToken(token);

		expect(hash).toHaveLength(64);
		expect(hash).not.toContain(token);
		expect(hashDiaryShareToken(token)).toBe(hash);
	});

	it("creates a different secret each time", () => {
		expect(createDiaryShareToken()).not.toBe(createDiaryShareToken());
	});

	it("accepts a stable timestamp and id cursor for shared diary pages", () => {
		const token = createDiaryShareToken();
		const cursor = {
			measuredAt: "2026-07-24T01:23:45.000Z",
			id: 42,
		};

		expect(sharedDiaryPageInputSchema.parse({ token, cursor }).cursor).toEqual(
			cursor,
		);
		expect(() =>
			sharedDiaryPageInputSchema.parse({
				token,
				cursor: { measuredAt: "not-a-date", id: 42 },
			}),
		).toThrow();
		expect(() =>
			sharedDiaryPageInputSchema.parse({
				token,
				cursor: { measuredAt: cursor.measuredAt, id: 0 },
			}),
		).toThrow();
	});
});
