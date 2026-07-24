import { createServerFn } from "@tanstack/react-start";
import { setResponseHeader } from "@tanstack/start-server-core/request-response";
import { and, count, desc, eq, gt, isNull, lt, or } from "drizzle-orm";
import {
	createDiaryShareSchema,
	DIARY_SHARE_DURATION_DAYS,
	diaryShareTokenSchema,
	sharedDiaryPageInputSchema,
} from "@/core/sharing/diaryShare";
import { db } from "@/server/db";
import { diaryShare, measurement, user } from "@/server/db/schema";
import { serverEnv } from "@/server/lib/serverEnv";
import { authMiddleware } from "@/server/middlewares/auth";
import { createDiaryShareToken, hashDiaryShareToken } from "./shareTokens";

const shareDurationMs = DIARY_SHARE_DURATION_DAYS * 24 * 60 * 60 * 1000;
export const SHARED_DIARY_PAGE_SIZE = 50;

export const getActiveDiaryShare = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.handler(async ({ context }) => {
		const [share] = await db
			.select({
				createdAt: diaryShare.createdAt,
				expiresAt: diaryShare.expiresAt,
				includeNotes: diaryShare.includeNotes,
			})
			.from(diaryShare)
			.where(
				and(
					eq(diaryShare.userId, context.user.id),
					isNull(diaryShare.revokedAt),
					gt(diaryShare.expiresAt, new Date()),
				),
			)
			.orderBy(desc(diaryShare.createdAt))
			.limit(1);

		return share ?? null;
	});

export const createDiaryShare = createServerFn({ method: "POST" })
	.validator(createDiaryShareSchema.parse)
	.middleware([authMiddleware])
	.handler(async ({ data, context }) => {
		const token = createDiaryShareToken();
		const now = new Date();
		const expiresAt = new Date(now.getTime() + shareDurationMs);

		await db.transaction(async (tx) => {
			await tx
				.update(diaryShare)
				.set({ revokedAt: now })
				.where(
					and(
						eq(diaryShare.userId, context.user.id),
						isNull(diaryShare.revokedAt),
					),
				);

			await tx.insert(diaryShare).values({
				userId: context.user.id,
				tokenHash: hashDiaryShareToken(token),
				includeNotes: data.includeNotes,
				expiresAt,
			});
		});

		return {
			token,
			expiresAt,
			includeNotes: data.includeNotes,
		};
	});

export const revokeDiaryShare = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.handler(async ({ context }) => {
		await db
			.update(diaryShare)
			.set({ revokedAt: new Date() })
			.where(
				and(
					eq(diaryShare.userId, context.user.id),
					isNull(diaryShare.revokedAt),
				),
			);

		return { success: true };
	});

export const getSharedDiary = createServerFn({ method: "GET" })
	.validator(sharedDiaryPageInputSchema.parse)
	.handler(async ({ data }) => {
		setResponseHeader("Cache-Control", "private, no-store, max-age=0");
		setResponseHeader("Referrer-Policy", "no-referrer");
		setResponseHeader("X-Robots-Tag", "noindex, nofollow, noarchive");

		const parsedToken = diaryShareTokenSchema.safeParse(data.token);
		if (!parsedToken.success) return null;

		const [share] = await db
			.select({
				userId: diaryShare.userId,
				name: user.name,
				includeNotes: diaryShare.includeNotes,
				expiresAt: diaryShare.expiresAt,
			})
			.from(diaryShare)
			.innerJoin(user, eq(user.id, diaryShare.userId))
			.where(
				and(
					eq(diaryShare.tokenHash, hashDiaryShareToken(parsedToken.data)),
					isNull(diaryShare.revokedAt),
					gt(diaryShare.expiresAt, new Date()),
				),
			)
			.limit(1);

		if (!share) return null;

		if (serverEnv.DEPLOYMENT_ENV === "development" && data.cursor) {
			await new Promise<void>((resolve) => setTimeout(resolve, 1_500));
		}

		const cursorMeasuredAt = data.cursor
			? new Date(data.cursor.measuredAt)
			: null;
		const cursorCondition =
			data.cursor && cursorMeasuredAt
				? or(
						lt(measurement.measuredAt, cursorMeasuredAt),
						and(
							eq(measurement.measuredAt, cursorMeasuredAt),
							lt(measurement.id, data.cursor.id),
						),
					)
				: undefined;

		const measurements = await db
			.select({
				id: measurement.id,
				measuredAt: measurement.measuredAt,
				systolic: measurement.systolic,
				diastolic: measurement.diastolic,
				pulse: measurement.pulse,
				notes: measurement.notes,
			})
			.from(measurement)
			.where(and(eq(measurement.userId, share.userId), cursorCondition))
			.orderBy(desc(measurement.measuredAt), desc(measurement.id))
			.limit(SHARED_DIARY_PAGE_SIZE + 1);

		const hasNextPage = measurements.length > SHARED_DIARY_PAGE_SIZE;
		const pageMeasurements = measurements.slice(0, SHARED_DIARY_PAGE_SIZE);
		const lastMeasurement = pageMeasurements.at(-1);
		const nextCursor =
			hasNextPage && lastMeasurement
				? {
						measuredAt: lastMeasurement.measuredAt.toISOString(),
						id: lastMeasurement.id,
					}
				: null;
		const [measurementCount] = data.cursor
			? []
			: await db
					.select({ value: count() })
					.from(measurement)
					.where(eq(measurement.userId, share.userId));

		return {
			name: share.name,
			expiresAt: share.expiresAt,
			includeNotes: share.includeNotes,
			totalCount: measurementCount?.value ?? null,
			nextCursor,
			measurements: pageMeasurements.map((entry) => ({
				...entry,
				notes: share.includeNotes ? entry.notes : null,
			})),
		};
	});
