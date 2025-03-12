"use client";

import { DayFlag, DayPicker, SelectionState, UI } from "react-day-picker";
import { tw } from "~/lib/utils";
import CalendarNav from "../calendar/calendar-nav";
import LoadingCalendarDay from "./loading-calendar-day";
import LoadingCalendarFeed from "./loading-calendar-feed";

export default function LoadingCalendar() {
  const now = new Date();
  return (
    <div className="tablet:grid-cols-3 tablet:grid-rows-1 tablet:items-center tablet:gap-0 grid h-full w-full grid-cols-1 grid-rows-3 gap-2.5">
      <div className="tablet:col-span-2 col-span-1 row-span-2 h-full flex-1">
        <DayPicker
          mode="single"
          required
          showOutsideDays
          selected={now}
          classNames={{
            [UI.Root]: tw`desktop:border-b-0 h-full border-b-[0.15rem]`,

            [UI.MonthCaption]: tw`hidden`,
            [UI.MonthGrid]: tw`h-full`,
            [UI.Months]: tw`flex h-full flex-col`,
            [UI.Month]: tw`flex h-full flex-col border-t-[0.15rem] p-2`,

            [UI.Weeks]: tw`flex h-full flex-col`,
            [UI.Week]: tw`flex flex-1`,

            [UI.Weekdays]: tw`flex py-[0.4375rem]`,
            [UI.Weekday]: tw`w-full font-normal font-semibold`,

            [UI.Day]: tw`mt-2 w-full rounded-3xl p-0 text-center text-sm`,

            [SelectionState.range_end]: tw`day-range-end`,
            [SelectionState.selected]: tw`border-ring bg-accent text-accent-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground border-2`,
            [SelectionState.range_middle]: tw`aria-selected:bg-accent aria-selected:text-accent-foreground`,

            [DayFlag.outside]: tw`day-outside text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground opacity-50 aria-selected:opacity-30`,
            [DayFlag.disabled]: tw`text-muted-foreground opacity-50`,
            [DayFlag.hidden]: tw`invisible`,
          }}
          month={now}
          components={{
            Nav: CalendarNav,
            Day: LoadingCalendarDay,
          }}
        />
      </div>
      <div className="tablet:flex relative col-span-1 row-span-1 h-full flex-1">
        <div className="absolute top-0 right-0 bottom-0 left-0">
          <LoadingCalendarFeed />
        </div>
      </div>
    </div>
  );
}
