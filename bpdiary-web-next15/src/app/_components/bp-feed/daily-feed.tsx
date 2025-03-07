"use client";

import { ScrollArea } from "../shadcn/scroll-area";
import { useBpCalendarDataContext } from "../../_contexts/bpCalendarDataContext";
import { useBpCalendarContext } from "../../_contexts/bpCaldendarContext";
import { format } from "date-fns";
import DisplayCard from "./display-card";
import BaseHeader from "../header/base-header";

export default function DailyFeed() {
  const calendarContext = useBpCalendarContext();
  const dataContext = useBpCalendarDataContext();
  const noMeasurements =
    (dataContext?.dataFilteredBySelectedDate?.length ?? 0) === 0;

  return (
    <ScrollArea className="h-full max-h-screen overflow-y-auto border-l-[0.15rem]">
      <div className="flex h-full flex-col items-center">
        <BaseHeader className="tablet:flex my-10 hidden h-10 justify-center gap-3 border border-none shadow-none">
          <h1 className="text-2xl leading-none font-semibold tracking-tight">
            {format(calendarContext.selectedDate, "E, LLL d")}
          </h1>
        </BaseHeader>
        {noMeasurements ? (
          <h1 className="text-muted-foreground absolute top-[40%] text-xl leading-none font-semibold tracking-tight opacity-50">
            No measurements ...
          </h1>
        ) : (
          <DisplayCard data={dataContext?.dataFilteredBySelectedDate} />
        )}
      </div>
    </ScrollArea>
  );
}
