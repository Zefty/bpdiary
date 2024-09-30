import { z } from "zod";

export const BpLog = z.object({
  datetime: z.date(),
  systolic: z.number().int().optional(),
  diastolic: z.number().int().optional(),
  pulse: z.number().int().optional(),
  notes: z.string().optional(),
});

export const BpLogWithId = BpLog.extend({ id: z.number().int() });

export type BpLog = z.infer<typeof BpLog>;
export type BpLogWithId = z.infer<typeof BpLogWithId>;
