import { z } from "zod";

export const ServerActionSuccess = "success";

export const ServerActionFailed = "failed";

export const DayOfWeek = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
] as const;

/* Blood pressure log form schema */

export const BpMeasurement = z.object({
  datetime: z.date(),
  systolic: z.number().int().optional(),
  diastolic: z.number().int().optional(),
  pulse: z.number().int().optional(),
  notes: z.string().optional(),
});

export const BpMeasurementWithId = BpMeasurement.extend({
  id: z.number().int(),
});

export type BpMeasurement = z.infer<typeof BpMeasurement>;
export type BpMeasurementWithId = z.infer<typeof BpMeasurementWithId>;

export const bpLogFormSchema = z.object({
  id: z.number().int().optional(),
  datetime: z.date(),
  systolic: z.number().int().optional(),
  diastolic: z.number().int().optional(),
  pulse: z.number().int().optional(),
  notes: z.string().optional(),
});

export type BpLogFormValues = z.infer<typeof bpLogFormSchema>;

/* Reminders form schema */
export const remindersSchema = z.array(
  z.object({
    id: z.number().optional(),
    reminderTime: z.date(),
    sunday: z.boolean().optional(),
    monday: z.boolean().optional(),
    tuesday: z.boolean().optional(),
    wednesday: z.boolean().optional(),
    thursday: z.boolean().optional(),
    friday: z.boolean().optional(),
    saturday: z.boolean().optional(),
    active: z.boolean().optional(),
  }),
);

export const remindersFormSchema = z.object({
  bp: remindersSchema,
  med: remindersSchema,
});

export type RemindersFormValues = z.infer<typeof remindersFormSchema>;

export type Reminders = z.infer<typeof remindersSchema>;

export type Reminder = Reminders[0];
