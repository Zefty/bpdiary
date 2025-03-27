"use client";

import { type NavProps } from "react-day-picker";
import { Button, buttonVariants } from "../shadcn/button";
import { Calendar1, ChevronLeft, ChevronRight } from "lucide-react";
import { useBpCalendarContext } from "~/app/_contexts/bpCaldendarContext";
import { cn } from "~/lib/utils";
import BaseHeader from "../header/base-header";
import LogBpFormTrigger from "../log-bp/log-bp-form-trigger";
import CalendarExport from "./calendar-export";
import CalendarShare from "./calendar-share";
import { SidebarTrigger } from "../shadcn/sidebar";
import MonthYearPicker from "../custom-inputs/month-year-picker";

export default function CalendarNav(props: NavProps) {
  const calendarContext = useBpCalendarContext();
  const resetToToday = () => {
    const today = new Date();
    calendarContext.setSelectedDate(today);
    calendarContext.setSelectedMonth(today);
  };
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
      <MonthYearPicker
        className={props.className}
        selectedMonthYear={calendarContext.selectedMonth}
        setSelectedMonthYear={setSelectedDate}
      />
    </div>
  );
}
