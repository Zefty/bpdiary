import { createServerFn } from "@tanstack/react-start";
import { and, desc, eq } from "drizzle-orm";
import {
	measurementIdSchema,
	measurementInputSchema,
} from "@/core/measurements/measurement";
import { db } from "@/server/db";
import { measurement } from "@/server/db/schema";
import { authMiddleware } from "@/server/middlewares/auth";

export const listMeasurements = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.handler(async ({ context }) => {
		return db
			.select()
			.from(measurement)
			.where(eq(measurement.userId, context.user.id))
			.orderBy(desc(measurement.measuredAt))
			.limit(500);
	});

export const saveMeasurement = createServerFn({ method: "POST" })
	.validator(measurementInputSchema.parse)
	.middleware([authMiddleware])
	.handler(async ({ data, context }) => {
		const measuredAt = new Date(data.measuredAt);
		if (Number.isNaN(measuredAt.valueOf()))
			throw new Error("Invalid measurement date");

		if (data.id) {
			const [updated] = await db
				.update(measurement)
				.set({
					measuredAt,
					systolic: data.systolic,
					diastolic: data.diastolic,
					pulse: data.pulse ?? null,
					notes: data.notes || null,
					updatedAt: new Date(),
				})
				.where(
					and(
						eq(measurement.id, data.id),
						eq(measurement.userId, context.user.id),
					),
				)
				.returning();
			if (!updated) throw new Error("Measurement not found");
			return updated;
		}

		const [created] = await db
			.insert(measurement)
			.values({
				userId: context.user.id,
				measuredAt,
				systolic: data.systolic,
				diastolic: data.diastolic,
				pulse: data.pulse ?? null,
				notes: data.notes || null,
			})
			.returning();
		return created;
	});

export const deleteMeasurement = createServerFn({ method: "POST" })
	.validator(measurementIdSchema.parse)
	.middleware([authMiddleware])
	.handler(async ({ data, context }) => {
		const [deleted] = await db
			.delete(measurement)
			.where(
				and(
					eq(measurement.id, data.id),
					eq(measurement.userId, context.user.id),
				),
			)
			.returning({ id: measurement.id });
		if (!deleted) throw new Error("Measurement not found");
		return deleted;
	});
