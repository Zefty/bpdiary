import RemindersForm from "~/app/_components/reminders/reminders-form";
import { Button } from "~/app/_components/shadcn/button";
import { Separator } from "~/app/_components/shadcn/separator";
import { SidebarTrigger } from "~/app/_components/shadcn/sidebar";
import { api } from "~/trpc/server";

export default async function Reminders() {
  const reminders = await api.reminder.getAllReminders();
  return (
    <div className="desktop:px-20 desktop:pt-10 desktop:pb-16 mobile:px-5 mobile:pt-5 mobile:pb-8 flex h-full flex-col">
      <div>
        <div className="flex items-center gap-4">
          <SidebarTrigger
            variant="default"
            className="mobile:flex hidden h-10 px-6 py-2"
          />
          <h2 className="text-2xl font-bold">Reminders</h2>
        </div>
        <p className="text-muted-foreground">
          Setup reminders to help you stay on track. Note: This page is a work
          in progress and reminders are not yet fully functional.
        </p>
      </div>
      <Separator className="mt-2 mb-8 h-[0.15rem]" />
      <RemindersForm reminders={reminders} />
      <Button type="submit" className="mt-4 w-40" form="reminders">
        Update reminders
      </Button>
    </div>
  );
}
