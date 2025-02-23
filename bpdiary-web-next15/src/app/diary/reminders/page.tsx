import RemindersForm from "~/app/_components/reminders/reminders-form";
import { Button } from "~/app/_components/shadcn/button";
import { Separator } from "~/app/_components/shadcn/separator";
import { api } from "~/trpc/server";

export default async function Reminders() {
  const reminders = await api.reminder.getAllReminders();
  return (
    <div className="flex h-full flex-col px-20 pt-10 pb-16">
      <div>
        <h2 className="text-2xl font-bold">Reminders</h2>
        <p className="text-muted-foreground">
          Setup reminders to help you stay on track.
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
