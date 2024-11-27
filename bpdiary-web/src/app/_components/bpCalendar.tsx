"use client";

import * as React from "react";
import { useRef } from "react";
import { CaptionProps, DayProps, useDayRender } from "react-day-picker";

import { Calendar } from "~/app/_components/shadcn/calendar";
import { ChevronLeft, ChevronRight, Gauge, HeartPulse } from "lucide-react";
import { cn } from "~/lib/utils";
import { addMonths, format, isSameDay, subMonths } from "date-fns";
import { useBpCalendarContext } from "./contexts/bpCaldendarContext";
import { useBpDataContext } from "./contexts/bpDataContext";
import { Button } from "./shadcn/button";

export function BpCalendar() {
  const calendarContext = useBpCalendarContext();
  const dataContext = useBpDataContext();
  const divRef = useRef<HTMLDivElement>(null);

  return (
    <Calendar
      mode="default"
      selected={calendarContext?.selectedDate}
      classNames={{
        root: "min-w-[360px] h-full p-3 rounded-md border",
        // caption: "hidden",
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
      month={calendarContext.selectedMonth}
      // onMonthChange={(month) => {
      //   calendarContext?.setSelectedDate(month);
      //   calendarContext?.setSelectedMonth(month);
      // }}
      components={{
        Caption: (props: CaptionProps) => {
          return (
            <div className="w-full flex justify-between items-center">
              <Button
                onClick={() => {
                  calendarContext.setSelectedDate(
                    subMonths(calendarContext.selectedMonth, 1),
                  );
                  calendarContext.setSelectedMonth(
                    subMonths(calendarContext.selectedMonth, 1),
                  );
                }}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-2xl font-semibold leading-none tracking-tight">
                {format(calendarContext.selectedMonth, "LLLL y")}
              </span>
              <Button
                onClick={() => {
                  calendarContext.setSelectedDate(
                    addMonths(calendarContext.selectedMonth, 1),
                  );
                  calendarContext.setSelectedMonth(
                    addMonths(calendarContext.selectedMonth, 1),
                  );
                }}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          );
        },
        Day: (props: DayProps) => {
          const buttonRef = useRef<HTMLButtonElement>(null);
          const dayRender = useDayRender(
            props.date,
            props.displayMonth,
            buttonRef,
          );
          const cellData = dataContext?.data?.find((ele) =>
            isSameDay(ele.createdAt, props.date),
          );

          return (
            <div
              className="flex h-full flex-col items-center rounded hover:bg-accent"
              ref={divRef}
              onClick={(e) => {
                calendarContext?.setSelectedDate(props.date);
              }}
              aria-selected={
                props.date.getTime() ===
                calendarContext?.selectedDate?.getTime()
                  ? "true"
                  : undefined
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
