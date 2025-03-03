"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "~/app/_hooks/use-toast";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
  Form,
} from "../shadcn/form";
import { RadioGroup, RadioGroupItem } from "../shadcn/radio-group";
import { Switch } from "../shadcn/switch";
import { Checkbox } from "../shadcn/checkbox";
import { Button } from "../shadcn/button";
import { useForm } from "react-hook-form";
import { Label } from "../shadcn/label";
import {
  notificationsFormSchema,
  NotificationsFormValues,
  ServerActionSuccess,
} from "~/lib/types";
import { UpdateNotifications } from "~/server/actions/server-actions";
import { useServerAction } from "~/app/_hooks/use-server-action";

export function NotificationsForm({
  notificationSettings,
}: {
  notificationSettings: NotificationsFormValues;
}) {
  const form = useForm<NotificationsFormValues>({
    resolver: zodResolver(notificationsFormSchema),
    defaultValues: notificationSettings,
  });
  const [action, isRunning] = useServerAction(UpdateNotifications);

  async function submit(data: NotificationsFormValues) {
    const response = await action(data);
    if (response === ServerActionSuccess) {
      toast({
        description: "Your notification settings has been updated.",
      });
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(submit)}
        className="flex flex-col gap-6"
      >
        <FormField
          control={form.control}
          name="toggle"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Notify and remind me about...</FormLabel>
              <FormControl className="mt-2">
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-y-0 space-x-3">
                    <FormControl>
                      <RadioGroupItem value="all" />
                    </FormControl>
                    <FormLabel className="font-normal">All reminders</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-y-0 space-x-3">
                    <FormControl>
                      <RadioGroupItem value="bp" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Measure blood pressure
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-y-0 space-x-3">
                    <FormControl>
                      <RadioGroupItem value="med" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Take medication
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-y-0 space-x-3">
                    <FormControl>
                      <RadioGroupItem value="none" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Silence all reminders
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
          <Label>Notification Types</Label>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="app"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel>Application</FormLabel>
                    <FormDescription>
                      Notify me through the app.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel>Email</FormLabel>
                    <FormDescription>
                      Receive emails for reminders.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
        <FormField
          control={form.control}
          name="mobile"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-y-0 space-x-3">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Use different settings for my mobile devices
                </FormLabel>
                <FormDescription>
                  You can manage your mobile notifications in the{" "}
                  <Link href="/examples/forms">mobile settings</Link> page.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="h-12 w-[12rem] rounded-full"
          disabled={isRunning}
        >
          Update notifications
        </Button>
      </form>
    </Form>
  );
}
