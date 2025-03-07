"use server";

import { revalidatePath } from "next/cache";
import { api } from "~/trpc/server";
import {
  type AppearanceFormValues,
  type BpLogFormValues,
  type NotificationsFormValues,
  type ProfileFormValues,
  type RemindersFormValues,
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

export async function UpdateProfile(formData: ProfileFormValues) {
  console.log("Updating profile");
  console.log(formData);

  try {
    await api.user.updateProfile(formData);
    revalidatePath("/diary/settings/profile");
    return ServerActionSuccess;
  } catch (error) {
    console.error("Failed to parse data", error);
    return ServerActionFailed;
  }
}

export async function UpdateAppearance(formData: AppearanceFormValues) {
  console.log("Updating appearance");
  console.log(formData);

  try {
    await api.setting.updateSetting({
      settingName: "theme",
      settingValue: formData.theme,
    });
    revalidatePath("/diary/settings/appearance");
    return ServerActionSuccess;
  } catch (error) {
    console.error("Failed to parse data", error);
    return ServerActionFailed;
  }
}

export async function UpdateNotifications(formData: NotificationsFormValues) {
  console.log("Updating notifications");
  console.log(formData);

  try {
    await Promise.all([
      api.setting.createOrUpdateSetting({
        settingName: "reminder-toggle",
        settingValue: formData.toggle,
      }),
      api.setting.createOrUpdateSetting({
        settingName: "reminder-by-application",
        settingValue: formData.app?.toString() ?? "false",
      }),
      api.setting.createOrUpdateSetting({
        settingName: "reminder-by-email",
        settingValue: formData.email?.toString() ?? "false",
      }),
      api.setting.createOrUpdateSetting({
        settingName: "reminder-use-mobile-settings",
        settingValue: formData.mobile?.toString() ?? "false",
      }),
    ]);
    revalidatePath("/diary/settings/notifications");
    return ServerActionSuccess;
  } catch (error) {
    console.error("Failed to parse data", error);
    return ServerActionFailed;
  }
}
