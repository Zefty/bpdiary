"use client";

import { isSameDay } from "date-fns";
import { Gauge, HeartPulse } from "lucide-react";
import { type DayProps } from "react-day-picker";
import { useBpCalendarContext } from "~/app/_contexts/bpCaldendarContext";
import { useBpCalendarDataContext } from "~/app/_contexts/bpCalendarDataContext";
import { cn } from "~/lib/utils";

export default function CalendarDay(props: DayProps) {
  const calendarContext = useBpCalendarContext();
  const dataContext = useBpCalendarDataContext();
  const { day, ...tdProps } = props;
  const cellData = dataContext?.data?.find((ele) =>
    isSameDay(ele.measuredAt, day.date),
  );

  return (
    <td
      {...tdProps}
      className={cn(
        tdProps.className,
        "hover:bg-accent flex flex-col items-center",
      )}
      onClick={(_e) => {
        calendarContext.setSelectedDate(day.date);
      }}
    >
      <div className="mt-2">{props.day.date.getDate()}</div>
      {cellData && (
        <>
          <div className="tablet:hidden flex h-full items-center">
            <HeartPulse className="text-primary h-[1.5rem] w-[1.5rem]" />
          </div>
          <div className="text-muted-foreground tablet:flex my-2 hidden h-full flex-col justify-center gap-2 text-xs">
            <div className="flex items-center gap-2">
              <Gauge className="text-primary h-[1.5rem] w-[1.5rem]" />
              <span className="flex flex-col">
                <span className="underline underline-offset-[3px]">
                  {cellData?.systolic}
                </span>
                <span>{cellData?.diastolic}</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <HeartPulse className="text-primary h-[1.5rem] w-[1.5rem]" />
              <span>{cellData?.pulse}</span>
            </div>
          </div>
        </>
      )}
    </td>
  );
}
