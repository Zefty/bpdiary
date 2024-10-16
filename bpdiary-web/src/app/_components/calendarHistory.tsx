"use client";

import * as React from "react";
import { useRef } from "react";
import { DayProps, useDayRender } from "react-day-picker";

import { Calendar } from "~/app/_components/shadcn/calendar";
import { Gauge, HeartPulse } from "lucide-react";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

export function CalendarHistory() {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const divRef = useRef<HTMLDivElement>(null);
  const [date, setDate] = React.useState<Date | undefined>(now);
  const data = api.bloodPressure.getMonthlyDiary.useQuery();
  const strippedTime = data.data?.map((entry) => {
    return {
      createdAt: entry.updatedAt?.setHours(0, 0, 0, 0),
      systolic: entry.systolic,
      diastolic: entry.diastolic,
      pulse: entry.pulse,
    };
  });
  // md:w-[47rem]
  return (
      <Calendar
        mode="default"
        selected={date}
        className="rounded-md border"
        classNames={{
          root: "max-md:w-full h-full p-3 rounded-md border",
          months: "w-full h-full flex flex-col space-y-4 sm:space-x-4 sm:space-y-0",
          month: "h-full",
          table: "h-full w-full border-collapse space-y-1",
          tbody: "h-full",
          row: "flex w-full gap-2",
          head_cell:
            "text-muted-foreground rounded-md w-full font-normal text-[0.8rem]",
          cell: "mt-2 h-auto w-full text-center text-xs p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent [&:has([aria-selected])]:ring-2 ring-ring rounded first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        }}
        components={{
          Day: (props: DayProps) => {
            const buttonRef = useRef<HTMLButtonElement>(null);
            const dayRender = useDayRender(
              props.date,
              props.displayMonth,
              buttonRef,
            );
            const cellData = strippedTime?.find(
              (ele) => ele.createdAt === props.date.getTime(),
            );

            return (
              <div
                className="flex flex-col items-center rounded hover:bg-accent"
                ref={divRef}
                onClick={(e) => {
                  setDate(props.date);
                }}
                aria-selected={
                  props.date.getTime() === date?.getTime() ? "true" : undefined
                }
              >
                <div className={cn(dayRender.divProps.className, "mt-2")}>
                  {props.date.getDate()}
                </div>
                <div className="text-xs text-muted-foreground">
                  {cellData && (
                    <div className="mx-2 mt-2 flex items-center gap-2">
                      <Gauge className="text-primary" height={12} width={12} />
                      <span className="">
                        {cellData?.systolic} / {cellData?.diastolic}
                      </span>
                    </div>
                  )}
                  {cellData && (
                    <div className="mx-2 mb-2 flex items-center gap-2">
                      <HeartPulse
                        className="text-primary"
                        height={12}
                        width={12}
                      />
                      <span className="">{cellData?.pulse}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          },
        }}
      />
  );
}
