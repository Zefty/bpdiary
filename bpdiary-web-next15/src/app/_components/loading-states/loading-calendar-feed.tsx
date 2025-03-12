"use client";

import { ScrollArea } from "@radix-ui/react-scroll-area";
import { useBpCalendarContext } from "~/app/_contexts/bpCaldendarContext";
import BaseHeader from "../header/base-header";
import { format } from "date-fns";
import HeartLoader from "../navigation/heart-loader";

export default function LoadingCalendarFeed() {
  const calendarContext = useBpCalendarContext();

  return (
    <ScrollArea className="h-full max-h-screen overflow-y-auto border-l-[0.15rem]">
      <div className="flex h-full flex-col items-center">
        <BaseHeader className="tablet:flex my-10 hidden h-10 justify-center gap-3 border border-none shadow-none">
          <h1 className="text-2xl leading-none font-semibold tracking-tight">
            {format(calendarContext.selectedDate, "E, LLL d")}
          </h1>
        </BaseHeader>
        <HeartLoader variant="pulse" className="flex w-12" />
      </div>
    </ScrollArea>
  );
}
