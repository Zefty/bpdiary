"use client";

import { BellPlus, Trash2 } from "lucide-react";
import BaseHeader from "../header/base-header";
import { Button } from "../shadcn/button";
import { ScrollArea } from "../shadcn/scroll-area";
import { FormControl, FormField, FormItem } from "../shadcn/form";
import { Switch } from "../shadcn/switch";
import {
  type Control,
  type FieldArrayWithId,
  type UseFieldArrayAppend,
  type UseFieldArrayRemove,
} from "react-hook-form";
import { useState } from "react";
import { type Reminder, type RemindersFormValues } from "~/lib/types";
import { ToggleGroup, ToggleGroupItem } from "../shadcn/toggle-group";
import { TimePicker } from "../custom-inputs/time-picker";

const mapLongDowToShortDow = {
  sunday: "Sun",
  monday: "Mon",
  tuesday: "Tue",
  wednesday: "Wed",
  thursday: "Thu",
  friday: "Fri",
  saturday: "Sat",
} as const;

const longDow = Object.keys(
  mapLongDowToShortDow,
) as (keyof typeof mapLongDowToShortDow)[];

const mapReminderToToggleGroupValues = (reminder?: Reminder) => {
  const ret = [] as string[];
  longDow.forEach((day) => {
    if (reminder?.[day]) {
      ret.push(mapLongDowToShortDow[day]);
    }
  });
  return ret;
};

export default function RemindersView({
  header,
  formControl,
  formKey,
  fields,
  append,
  remove,
}: {
  header: string;
  formControl: Control<RemindersFormValues>;
  formKey: keyof RemindersFormValues;
  fields: FieldArrayWithId<RemindersFormValues>[];
  append: UseFieldArrayAppend<RemindersFormValues>;
  remove: UseFieldArrayRemove;
}) {
  const [deleteMode, setDeleteMode] = useState(false);
  return (
    <div className="flex h-full flex-col gap-6">
      <BaseHeader className="flex justify-between px-0">
        <div className="bg-muted flex h-12 min-w-0 items-center rounded-full">
          <h3 className="truncate px-4 text-lg font-medium">{header}</h3>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setDeleteMode(!deleteMode)}
            type="button"
            variant="muted"
            size="circular"
          >
            <Trash2 width="1.5em" height="1.5em" />
          </Button>
          <Button
            onClick={() =>
              append({
                reminderTime: new Date(),
                sunday: false,
                monday: false,
                tuesday: false,
                wednesday: false,
                thursday: false,
                friday: false,
                saturday: false,
                active: true,
              })
            }
            type="button"
            variant="muted"
            size="circular"
          >
            <BellPlus width="1.5em" height="1.5em" />
          </Button>
        </div>
      </BaseHeader>
      <div className="relative flex-1">
        <div className="absolute top-0 right-0 bottom-0 left-0">
          <ScrollArea className="h-full">
            {fields.length > 0 ? (
              <div className="flex flex-col gap-4">
                {fields.map((field, index) => (
                  <FormField
                    key={field.id}
                    control={formControl}
                    name={formKey}
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="mr-auto space-y-4">
                          <TimePicker
                            showSeconds={false}
                            selectedDate={
                              field.value?.[index]?.reminderTime ?? new Date()
                            }
                            onDateChange={(value) => {
                              const newFields = field.value
                                ? [...field.value]
                                : [];
                              if (newFields[index]) {
                                newFields[index].reminderTime =
                                  value ?? new Date();
                              }
                              field.onChange(newFields);
                            }}
                          />
                          <FormControl>
                            <ToggleGroup
                              className="flex gap-2"
                              type="multiple"
                              value={mapReminderToToggleGroupValues(
                                field.value?.[index],
                              )}
                              onValueChange={(value) => {
                                const valueSet = new Set(value);

                                const newFields = field.value
                                  ? [...field.value]
                                  : [];

                                longDow.forEach((day) => {
                                  if (newFields[index]) {
                                    newFields[index][day] = valueSet.has(
                                      mapLongDowToShortDow[day],
                                    )
                                      ? true
                                      : false;
                                  }
                                });

                                field.onChange(newFields);
                              }}
                            >
                              {longDow.map((day) => (
                                <ToggleGroupItem
                                  className="w-[3rem] rounded-lg"
                                  value={mapLongDowToShortDow[day]}
                                  aria-label={day}
                                  key={day}
                                >
                                  {mapLongDowToShortDow[day]}
                                </ToggleGroupItem>
                              ))}
                            </ToggleGroup>
                          </FormControl>
                        </div>
                        <FormControl>
                          {deleteMode ? (
                            <Button
                              onClick={() => {
                                remove(index);
                              }}
                              type="button"
                            >
                              <Trash2 width="1.5em" height="1.5em" />
                            </Button>
                          ) : (
                            <Switch
                              checked={field.value?.[index]?.active}
                              onCheckedChange={(checked) => {
                                const newFields = field.value
                                  ? [...field.value]
                                  : [];
                                if (newFields[index]) {
                                  newFields[index].active = checked;
                                }
                                field.onChange(newFields);
                              }}
                            />
                          )}
                        </FormControl>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            ) : (
              <div className="flex h-full flex-col items-center">
                <h1 className="text-muted-foreground absolute top-[40%] text-xl leading-none font-semibold tracking-tight opacity-50">
                  No reminders ...
                </h1>
              </div>
            )}
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
