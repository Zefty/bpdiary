import { z } from "zod";

export const BpMeasurement = z.object({
  datetime: z.date(),
  systolic: z.number().int().optional(),
  diastolic: z.number().int().optional(),
  pulse: z.number().int().optional(),
  notes: z.string().optional(),
});

export const BpMeasurementWithId = BpMeasurement.extend({ id: z.number().int() });

export type BpMeasurement = z.infer<typeof BpMeasurement>;
export type BpMeasurementWithId = z.infer<typeof BpMeasurementWithId>;
