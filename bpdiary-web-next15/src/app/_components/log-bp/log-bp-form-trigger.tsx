"use client";
import { CalendarPlus2 } from "lucide-react";
import { useBpEntryContext } from "~/app/_contexts/bpEntryContext";
import { Button } from "../shadcn/button";
import { useBpCalendarContext } from "~/app/_contexts/bpCaldendarContext";
import { set } from "date-fns";

export default function LogBpFormTrigger() {
  const context = useBpEntryContext();
  const calendarContext = useBpCalendarContext();
  return (
    <Button
      className="flex items-center justify-between gap-3"
      onClick={() => {
        if (context) {
          const now = new Date();
          if (calendarContext) {
            context.setBpFormData({
              datetime: set(calendarContext.selectedDate, {
                hours: now.getHours(),
                minutes: now.getMinutes(),
                seconds: now.getSeconds(),
              }),
            });
          } else {
            context.setBpFormData({
              datetime: now,
            });
          }
          context.setOpen(!context.open);
        }
      }}
    >
      <CalendarPlus2 className="h-[1.5rem] w-[1.5rem]" />
      <span className="laptop:flex hidden">New Reading</span>
    </Button>
  );
}
