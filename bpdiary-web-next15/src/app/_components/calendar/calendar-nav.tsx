"use client";

import { type NavProps } from "react-day-picker";
import { Button, buttonVariants } from "../shadcn/button";
import { Calendar1, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { useBpCalendarContext } from "~/app/_contexts/bpCaldendarContext";
import { cn } from "~/lib/utils";
import BaseHeader from "../header/base-header";
import LogBpFormTrigger from "../log-bp/log-bp-form-trigger";
import CalendarExport from "./calendar-export";
import CalendarShare from "./calendar-share";
import { SidebarTrigger } from "../shadcn/sidebar";
import { Popover, PopoverContent, PopoverTrigger } from "../shadcn/popover";
import { ScrollArea } from "../shadcn/scroll-area";
import { useState } from "react";

const months = [
  "Janurary",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const currentYear = new Date().getFullYear();
const years = Array.from(
  { length: currentYear - 1924 },
  (_, i) => currentYear - i,
);

export default function CalendarNav(props: NavProps) {
  const calendarContext = useBpCalendarContext();
  const resetToToday = () => {
    const today = new Date();
    calendarContext.setSelectedDate(today);
    calendarContext.setSelectedMonth(today);
  };
  const selectedMonth = calendarContext.selectedMonth.getMonth();
  const selectedYear = calendarContext.selectedMonth.getFullYear();
  const setSelectedDate = (year: number, month: number) => {
    const newDate = new Date(year, month);
    calendarContext.setSelectedDate(newDate);
    calendarContext.setSelectedMonth(newDate);
  };

  return (
    <div className="flex flex-col items-center">
      <BaseHeader className="flex justify-between">
        <SidebarTrigger
          className={cn(
            "tablet:hidden flex",
            buttonVariants({ size: "circular", variant: "muted" }),
          )}
        />
        <LogBpFormTrigger variant="muted" size="circular" />
        <CalendarShare variant="muted" size="circular" />
        <CalendarExport variant="muted" size="circular" />
        <div className="ml-auto flex gap-2">
          <Button
            onClick={props.onPreviousClick}
            variant="muted"
            size="circular"
          >
            <ChevronLeft width="1.5em" height="1.5em" />
          </Button>
          <Button
            onClick={resetToToday}
            variant="muted"
            className="h-12 rounded-full"
          >
            <Calendar1 width="1.5em" height="1.5em" />
            <span className="tablet:block hidden">Today</span>
          </Button>
          <Button onClick={props.onNextClick} variant="muted" size="circular">
            <ChevronRight width="1.5em" height="1.5em" />
          </Button>
        </div>
      </BaseHeader>
      <Popover>
        <div
          className={cn(
            "flex h-[4.35rem] w-full items-center justify-center border-t-[0.15rem]",
            props.className,
          )}
        >
          <PopoverTrigger className="bg-muted flex items-center gap-2 rounded-full px-4 py-2">
            <span className="text-3xl leading-none font-semibold tracking-tight">
              {format(calendarContext.selectedMonth, "LLLL")}
            </span>
            <span className="text-3xl">
              {format(calendarContext.selectedMonth, "y")}
            </span>
          </PopoverTrigger>
          <PopoverContent className="grid grid-cols-2 grid-rows-1 gap-2 rounded-xl">
            <ScrollArea className="h-[10rem]" hideScrollbar>
              <div className="flex flex-col gap-1">
                {months.map((month, index) => {
                  return (
                    <Button
                      key={month}
                      className={cn(
                        "flex h-8 w-full items-center justify-center rounded-full",
                        index === selectedMonth ? "bg-muted" : "",
                      )}
                      onClick={() => {
                        setSelectedDate(selectedYear, index);
                      }}
                      variant="ghost"
                    >
                      {month}
                    </Button>
                  );
                })}
              </div>
            </ScrollArea>
            <ScrollArea className="h-[10rem]" hideScrollbar>
              {years.map((year) => {
                return (
                  <Button
                    key={year}
                    className={cn(
                      "flex h-8 w-full items-center justify-center rounded-full",
                      year === selectedYear ? "bg-muted" : "",
                    )}
                    onClick={() => {
                      setSelectedDate(year, selectedMonth);
                    }}
                    variant="ghost"
                  >
                    {year}
                  </Button>
                );
              })}
            </ScrollArea>
          </PopoverContent>
        </div>
      </Popover>
    </div>
  );
}
