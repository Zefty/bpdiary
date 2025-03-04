import { z } from "zod";
import { RouterOutputs } from "~/trpc/react";

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

export const TIMEFRAMES = ["W", "M", "YTD", "Y", "All"] as const;
export type Timeframes = (typeof TIMEFRAMES)[number];

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

/* Profile form schema */
export const profileFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Name must be at least 2 characters.",
    })
    .max(30, {
      message: "Name must not be longer than 30 characters.",
    }),
  email: z
    .string({
      required_error: "An email is required.",
    })
    .email({
      message: "Please enter a valid email address.",
    }),
  dob: z.date({
    required_error: "A date of birth is required.",
  }),
  timezone: z.string({
    required_error: "Please select a timezone.",
  }),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;

/* Appearance form schema */
export const appearanceFormSchema = z.object({
  theme: z.enum(["light", "dark"], {
    required_error: "Please select a theme.",
  }),
  // font: z.enum(["inter", "manrope", "system"], {
  //   invalid_type_error: "Select a font",
  //   required_error: "Please select a font.",
  // }),
});

export type AppearanceFormValues = z.infer<typeof appearanceFormSchema>;

/* Notifications form schema */
export const notificationToggleTypes = z.enum(["all", "bp", "med", "none"], {
  required_error: "You need to select a notification type.",
});

export const notificationsFormSchema = z.object({
  toggle: notificationToggleTypes,
  app: z.boolean().default(false).optional(),
  email: z.boolean().default(false).optional(),
  mobile: z.boolean().default(false).optional(),
});

export type NotificationsFormValues = z.infer<typeof notificationsFormSchema>;
