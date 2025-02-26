"use client";

import * as React from "react";
import { DayFlag, DayPicker, SelectionState, UI } from "react-day-picker";
import { useBpCalendarContext } from "../../_contexts/bpCaldendarContext";
import CalendarNav from "./calendar-nav";
import CalendarDay from "./calendar-day";
import { tw } from "~/lib/utils";

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
        [UI.Root]: tw`desktop:border-b-0 h-full border-b-[0.15rem]`,

        [UI.MonthCaption]: tw`hidden`,
        [UI.MonthGrid]: tw`h-full`,
        [UI.Months]: tw`flex h-full flex-col`,
        [UI.Month]: tw`flex h-full flex-col border-t-[0.15rem] p-2`,

        [UI.Weeks]: tw`flex h-full flex-col`,
        [UI.Week]: tw`flex flex-1`,

        [UI.Weekdays]: tw`flex py-[0.4375rem]`,
        [UI.Weekday]: tw`w-full rounded-md font-normal font-semibold`,

        [UI.Day]: tw`mt-2 w-full rounded-md p-0 text-center text-sm`,

        [SelectionState.range_end]: tw`day-range-end`,
        [SelectionState.selected]: tw`border-ring bg-accent text-accent-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground border-2`,
        [SelectionState.range_middle]: tw`aria-selected:bg-accent aria-selected:text-accent-foreground`,

        [DayFlag.outside]: tw`day-outside text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground opacity-50 aria-selected:opacity-30`,
        [DayFlag.disabled]: tw`text-muted-foreground opacity-50`,
        [DayFlag.hidden]: tw`invisible`,
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
