"use client";

import * as React from "react";
import { DayFlag, DayPicker, SelectionState, UI } from "react-day-picker";
import { useBpCalendarContext } from "../../_contexts/bpCaldendarContext";
import CalendarNav from "./calendar-nav";
import CalendarDay from "./calendar-day";

export default function CalendarView() {
  const calendarContext = useBpCalendarContext();

  return (
    <DayPicker
      mode="single"
      required
      showOutsideDays
      selected={calendarContext.selectedDate}
      onSelect={calendarContext.setSelectedDate}
      classNames={{
        [UI.Root]: "h-full border rounded-md p-2",

        [UI.Nav]: "",
        [UI.MonthCaption]: "hidden",

        [UI.MonthGrid]: "h-full mt-2",
        [UI.Months]: "flex flex-col h-full",
        [UI.Month]: "flex flex-col h-full",

        [UI.Weeks]: "flex flex-col h-full",
        [UI.Week]: "flex flex-1",

        [UI.Weekdays]: "flex rounded-md bg-accent py-[0.4375rem] mt-2",
        [UI.Weekday]: "rounded-md w-full font-normal font-semibold",

        [UI.Day]: "mt-2 w-full text-center rounded-md text-sm p-0",

        [SelectionState.range_end]: "day-range-end",
        [SelectionState.selected]:
          "bg-accent text-accent-foreground border-2 border-ring hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
        [SelectionState.range_middle]:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",

        [DayFlag.outside]:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        [DayFlag.disabled]: "text-muted-foreground opacity-50",
        [DayFlag.hidden]: "invisible",
      }}
      month={calendarContext.selectedMonth}
      onMonthChange={(month) => {
        calendarContext.setSelectedDate(month);
        calendarContext.setSelectedMonth(month);
      }}
      components={{
        Nav: CalendarNav,
        Day: CalendarDay,
      }}
    />
  );
}
