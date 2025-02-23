import { NotificationsForm } from "~/app/_components/settings/notifications-form";
import { Separator } from "~/app/_components/shadcn/separator";

export default async function Notifications() {
  return (
    <div className="w-full space-y-6">
      <div>
        <h3 className="text-lg font-medium">Notifications & Reminders</h3>
        <p className="text-muted-foreground text-sm">
          Configure your notifications and reminders for measuring your blood
          pressure and/or taking your medication.
        </p>
      </div>
      <Separator className="h-[0.125rem] w-[35rem]" />
      <NotificationsForm />
    </div>
  );
}
