"use client";

import * as React from "react";
import { DayFlag, DayPicker, SelectionState, UI } from "react-day-picker";
import CalendarNav from "./calendarNav";
import CalendarDay from "./calendarDay";
import { useBpCalendarContext } from "../../_contexts/bpCaldendarContext";

export function BpCalendar() {
  const calendarContext = useBpCalendarContext();

  return (
    <DayPicker
      mode="single"
      required
      showOutsideDays
      selected={calendarContext.selectedDate}
      onSelect={calendarContext.setSelectedDate}
      classNames={{
        [UI.Root]: "min-w-[360px] h-full p-2 rounded-md border",
        [UI.MonthCaption]: "hidden",

        [UI.MonthGrid]: "h-full",
        [UI.Months]: "flex flex-col h-full",
        [UI.Month]: "flex flex-col h-full",

        [UI.Weeks]: "flex flex-col h-full",
        [UI.Week]: "flex flex-1",

        [UI.Weekdays]: 'flex',
        [UI.Weekday]:
          "text-muted-foreground rounded-md w-full font-normal text-[0.8rem]",
          
        [UI.Day]: "mt-2 w-full text-center rounded-md text-sm p-0",

        [SelectionState.range_end]: 'day-range-end',
        [SelectionState.selected]:
          'bg-accent text-accent-foreground ring-2 ring-ring hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
        [SelectionState.range_middle]:
          'aria-selected:bg-accent aria-selected:text-accent-foreground',
        [DayFlag.outside]:
          'day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30',
        [DayFlag.disabled]: 'text-muted-foreground opacity-50',
        [DayFlag.hidden]: 'invisible',
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
