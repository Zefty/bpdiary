"use server";

import { revalidatePath } from "next/cache";
import { api } from "~/trpc/server";
import {
  BpLogFormValues,
  RemindersFormValues,
  ServerActionFailed,
  ServerActionSuccess,
} from "~/lib/types";

export async function CreateOrUpdateBpMeasurement(formData: BpLogFormValues) {
  console.log("Logging BP entry");
  console.log(formData);

  try {
    await api.bloodPressure.createOrUpdateMeasurement(formData);
    revalidatePath("/diary");
    return ServerActionSuccess;
  } catch (error) {
    console.error("Failed to parse data", error);
    return ServerActionFailed;
  }
}

export async function CreateOrUpdateReminders(formData: RemindersFormValues) {
  console.log("Creating or updating reminders");
  console.log(formData);

  try {
    await api.reminder.createOrUpdateReminders(formData);
    revalidatePath("/diary/reminders");
    return ServerActionSuccess;
  } catch (error) {
    console.error("Failed to parse data", error);
    return ServerActionFailed;
  }
}
