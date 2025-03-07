import RemindersForm from "~/app/_components/reminders/reminders-form";
import { Button, buttonVariants } from "~/app/_components/shadcn/button";
import { SidebarTrigger } from "~/app/_components/shadcn/sidebar";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/server";

export default async function Reminders() {
  const reminders = await api.reminder.getAllReminders();
  return (
    <div className="tablet:px-20 tablet:pt-10 tablet:pb-16 flex h-full flex-col p-6">
      <div className="tablet:flex-col tablet:items-start mb-6 flex items-center">
        <SidebarTrigger
          className={cn(
            "tablet:hidden flex",
            buttonVariants({ size: "circular", variant: "muted" }),
          )}
        />
        <h2 className="tablet:text-start w-full text-center text-2xl font-bold">
          Reminders
        </h2>
        <p className="tablet:block text-muted-foreground hidden">
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
