"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { toast } from "~/app/_hooks/use-toast";
import { cn } from "~/lib/utils";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../shadcn/form";
import { Input } from "../shadcn/input";
import { Button } from "../shadcn/button";
import { Popover, PopoverContent, PopoverTrigger } from "../shadcn/popover";
import { Calendar } from "../shadcn/calendar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../shadcn/command";
import { AdapterUser } from "next-auth";
import {
  profileFormSchema,
  ProfileFormValues,
  ServerActionSuccess,
} from "~/lib/types";
import { useServerAction } from "~/app/_hooks/use-server-action";
import { UpdateProfile } from "~/server/actions/server-actions";
import { UI } from "react-day-picker";

const timezones = Intl.supportedValuesOf("timeZone").map((timezone) => ({
  label: timezone,
  value: timezone,
}));

export function ProfileForm({ user }: { user?: AdapterUser }) {
  const defaultValues: Partial<ProfileFormValues> = {
    name: user?.name ?? undefined,
    email: user?.email ?? undefined,
    dob: user?.dob ? new Date(user.dob) : undefined,
    timezone: user?.timezone ?? undefined,
  };
  const [action, isRunning] = useServerAction(UpdateProfile);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
  });

  async function submit(data: ProfileFormValues) {
    const response = await action(data);
    if (response === ServerActionSuccess) {
      toast({
        description: "Your profile has been updated.",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submit)} className="flex flex-col">
        <div className="tablet:grid tablet:grid-cols-2 space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Your name"
                    {...field}
                    className="h-12 w-[20rem]"
                  />
                </FormControl>
                <FormDescription>
                  This is the name that will be displayed on your profile.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Your email"
                    {...field}
                    className="h-12 w-[20rem]"
                    disabled
                  />
                </FormControl>
                <FormDescription>This is your email address.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dob"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date of birth</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "h-12 w-[17.375rem] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      captionLayout="dropdown"
                      classNames={{
                        [UI.CaptionLabel]: "hidden",
                      }}
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  Your date of birth is used to calculate your age.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="timezone"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Timezone</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "h-12 w-[17.375rem] justify-between pl-3",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value
                          ? timezones.find(
                              (language) => language.value === field.value,
                            )?.label
                          : "Select timezone"}
                        <ChevronsUpDown className="opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[17.375rem] p-0">
                    <Command>
                      <CommandInput placeholder="Search timezone..." />
                      <CommandList>
                        <CommandEmpty>No timezone found.</CommandEmpty>
                        <CommandGroup>
                          {timezones.map((timezone) => (
                            <CommandItem
                              value={timezone.label}
                              key={timezone.value}
                              onSelect={() => {
                                form.setValue("timezone", timezone.value);
                              }}
                              className="justify-between"
                            >
                              {timezone.label}
                              <Check
                                className={cn(
                                  "mr-2",
                                  timezone.value === field.value
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  This is the timezone that will be used for displaying your
                  measurements.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          type="submit"
          disabled={isRunning}
          className="tablet:mt-0 mt-6 h-12 w-[12rem] rounded-full"
        >
          Update account
        </Button>
      </form>
    </Form>
  );
}
