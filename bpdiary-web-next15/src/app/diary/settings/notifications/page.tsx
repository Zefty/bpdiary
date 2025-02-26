import { z } from "zod";
import { NotificationsForm } from "~/app/_components/settings/notifications-form";
import { Separator } from "~/app/_components/shadcn/separator";
import { notificationsFormSchema, notificationToggleTypes } from "~/lib/types";
import { api } from "~/trpc/server";

export default async function Notifications() {
  const [reminderToggle, application, email, useMobileSettings] =
    await Promise.all([
      api.setting.retrieveSetting({ settingName: "reminder-toggle" }),
      api.setting.retrieveSetting({
        settingName: "reminder-by-application",
      }),
      api.setting.retrieveSetting({
        settingName: "reminder-by-email",
      }),
      api.setting.retrieveSetting({
        settingName: "reminder-use-mobile-settings",
      }),
    ]);

  const notificationSettings = notificationsFormSchema.parse({
    toggle: reminderToggle[0]?.settingValue ?? "all",
    app: Boolean(application[0]?.settingValue ?? true),
    email: Boolean(email[0]?.settingValue ?? false),
    mobile: Boolean(useMobileSettings[0]?.settingValue ?? false),
  });

  return (
    <div className="w-full space-y-6">
      <div>
        <h3 className="text-lg font-medium">Notifications & Reminders</h3>
        <p className="text-muted-foreground text-sm">
          Configure your notifications and reminders for measuring your blood
          pressure and/or taking your medication.
        </p>
      </div>
      <Separator className="desktop:w-[35rem] h-[0.125rem]" />
      <NotificationsForm notificationSettings={notificationSettings} />
    </div>
  );
}
