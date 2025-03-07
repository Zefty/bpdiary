"use client";
import { CalendarPlus2 } from "lucide-react";
import { useBpEntryContext } from "~/app/_contexts/bpEntryContext";
import { Button } from "../shadcn/button";
import { useBpCalendarContext } from "~/app/_contexts/bpCaldendarContext";
import { set } from "date-fns";

export default function LogBpFormTrigger({
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  const context = useBpEntryContext();
  const calendarContext = useBpCalendarContext();
  return (
    <Button
      className={className}
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
      {...props}
    >
      <CalendarPlus2 className="h-[1.5rem] w-[1.5rem]" />
    </Button>
  );
}
