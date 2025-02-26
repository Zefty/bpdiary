"use client";

import { Form } from "../shadcn/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "~/app/_hooks/use-toast";
import { useFieldArray, useForm } from "react-hook-form";
import RemindersView from "./reminders-view";
import { remindersFormSchema, RemindersFormValues } from "~/lib/types";
import { CreateOrUpdateReminders } from "~/server/actions/server-actions";

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

  function onSubmit(data: RemindersFormValues) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(CreateOrUpdateReminders)}
        className="desktop:grid desktop:grid-cols-2 mobile:flex mobile:flex-col w-full flex-1 gap-12"
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
