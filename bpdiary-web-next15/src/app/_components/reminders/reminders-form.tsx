"use client";

import { Form } from "../shadcn/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import RemindersView from "./reminders-view";
import {
  remindersFormSchema,
  ServerActionSuccess,
  type RemindersFormValues,
} from "~/lib/types";
import { CreateOrUpdateReminders } from "~/server/actions/server-actions";
import { useServerAction } from "~/app/_hooks/use-server-action";
import { toast } from "~/app/_hooks/use-toast";

export default function RemindersForm({
  reminders,
}: {
  reminders: Partial<RemindersFormValues>;
}) {
  const form = useForm<RemindersFormValues>({
    resolver: zodResolver(remindersFormSchema),
    defaultValues: reminders,
  });
  const {
    fields: bpFields,
    append: bpAppend,
    remove: bpRemove,
  } = useFieldArray({
    control: form.control,
    name: "bp", // unique name for your Field Array
  });
  const {
    fields: medFields,
    append: medAppend,
    remove: medRemove,
  } = useFieldArray({
    control: form.control,
    name: "med", // unique name for your Field Array
  });
  const [action, isRunning] = useServerAction(CreateOrUpdateReminders);
  console.log(isRunning);

  async function submit(data: RemindersFormValues) {
    const response = await action(data);
    if (response === ServerActionSuccess) {
      toast({
        description: "Your profile has been updated.",
      });
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(submit)}
        className="tablet:grid tablet:grid-cols-2 flex w-full flex-1 flex-col gap-12"
        id="reminders"
      >
        <RemindersView
          header="Blood Pressure Reminders"
          formControl={form.control}
          formKey="bp"
          fields={bpFields}
          append={bpAppend}
          remove={bpRemove}
        />
        <RemindersView
          header="Medication Reminders"
          formControl={form.control}
          formKey="med"
          fields={medFields}
          append={medAppend}
          remove={medRemove}
        />
      </form>
    </Form>
  );
}
