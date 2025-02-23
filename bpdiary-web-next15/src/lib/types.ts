import { z } from "zod";

export const DayOfWeek = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
] as const;

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
