"use client";

import * as React from "react";
import { useRef } from "react";
import { DayProps, useDayRender } from "react-day-picker";

import { Calendar } from "~/app/_components/shadcn/calendar";
import { Gauge, HeartPulse } from "lucide-react";
import { cn } from "~/lib/utils";
import { useCalendarHistory, useRollingDiaryHistoryData } from "./diaryHistoryContexts";
import { isSameDay } from "date-fns";

export function CalendarHistory() {
  const calendarContext = useCalendarHistory();
  const dataContext = useRollingDiaryHistoryData();
  const divRef = useRef<HTMLDivElement>(null);

  return (
    <Calendar
      mode="default"
      selected={calendarContext?.selectedDate}
      className="rounded-md border"
      classNames={{
        root: "min-w-[360px] h-full p-3 rounded-md border",
        months:
          "w-full h-full flex flex-col space-y-4 sm:space-x-4 sm:space-y-0",
        month: "flex flex-col h-full space-y-4",
        table: "h-full w-full border-collapse space-y-1",
        tbody: "flex flex-col h-full",
        row: "flex flex-1 w-full gap-2",
        head_cell:
          "text-muted-foreground rounded-md w-full font-normal text-[0.8rem]",
        cell: "mt-2 w-full text-center text-xs p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent [&:has([aria-selected])]:ring-2 ring-ring rounded first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
      }}
      onMonthChange={(month) => {
        calendarContext?.setSelectedDate(month);
        calendarContext?.setSelectedMonth(month);
      }}
      components={{
        Day: (props: DayProps) => {
          const buttonRef = useRef<HTMLButtonElement>(null);
          const dayRender = useDayRender(
            props.date,
            props.displayMonth,
            buttonRef,
          );
          const cellData = dataContext?.data?.find(
            (ele) => isSameDay(ele.createdAt, props.date),
          );

          return (
            <div
              className="flex h-full flex-col items-center rounded hover:bg-accent"
              ref={divRef}
              onClick={(e) => {
                calendarContext?.setSelectedDate(props.date);
              }}
              aria-selected={
                props.date.getTime() === calendarContext?.selectedDate?.getTime() ? "true" : undefined
              }
            >
              <div className={cn(dayRender.divProps.className, "mt-2")}>
                {props.date.getDate()}
              </div>
              {cellData && (
                <div className="my-2 flex flex-col gap-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Gauge className="text-primary" height={12} width={12} />
                    <span className="flex flex-col">
                      <span className="underline underline-offset-[3px]">
                        {cellData?.systolic}
                      </span>
                      <span>{cellData?.diastolic}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <HeartPulse
                      className="text-primary"
                      height={12}
                      width={12}
                    />
                    <span>{cellData?.pulse}</span>
                  </div>
                </div>
              )}
            </div>
          );
        },
      }}
    />
  );
}
