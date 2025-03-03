import RemindersForm from "~/app/_components/reminders/reminders-form";
import { Button } from "~/app/_components/shadcn/button";
import { Separator } from "~/app/_components/shadcn/separator";
import { SidebarTrigger } from "~/app/_components/shadcn/sidebar";
import { api } from "~/trpc/server";

export default async function Reminders() {
  const reminders = await api.reminder.getAllReminders();
  return (
    <div className="desktop:px-20 desktop:pt-10 desktop:pb-16 flex h-full flex-col p-6">
      <div className="desktop:flex-col desktop:items-start mb-6 flex items-center">
        <SidebarTrigger
          variant="muted"
          className="mobile:flex hidden h-10 px-6 py-2"
        />
        <h2 className="desktop:text-start w-full text-center text-2xl font-bold">
          Reminders
        </h2>
        <p className="desktop:block text-muted-foreground hidden">
          Setup reminders to help you stay on track. Note: This page is a work
          in progress and reminders are not yet fully functional.
        </p>
      </div>
      <RemindersForm reminders={reminders} />
      <Button
        type="submit"
        className="mt-4 h-12 w-40 rounded-full"
        form="reminders"
      >
        Update reminders
      </Button>
    </div>
  );
}
