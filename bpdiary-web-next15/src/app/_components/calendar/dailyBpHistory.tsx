"use client";

import React, { useLayoutEffect, useRef, useState } from "react";
import { api, type RouterOutputs } from "~/trpc/react";
import { ScrollArea } from "../shadcn/scroll-area";
import DailyDiaryHistoryCard from "./dailyDiaryHistoryCard";
import { useBpDataContext } from "../../_contexts/bpDataContext";
import { HeartPulse } from "lucide-react";
import { useBpCalendarContext } from "../../_contexts/bpCaldendarContext";
import { format } from "date-fns";
import EditBpEntry from "../entry/editBpEntry";
import { BpEntryContextProvider } from "~/app/_contexts/bpEntryContext";

export default function DailyBpHistory() {
  const calendarContext = useBpCalendarContext();
  const dataContext = useBpDataContext();
  const noMeasurements =
    (dataContext?.dataFilteredBySelectedDate?.length ?? 0) === 0;
  const viewPortRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (viewPortRef.current) {
      const scrollPosition = sessionStorage.getItem("scrollPosition");
      viewPortRef.current.scrollTop = Number(scrollPosition) ?? 0;
    }
  });

  return (
    <BpEntryContextProvider>
      <ScrollArea
        className="bg-sidebar h-full max-h-screen overflow-y-auto"
        ref={viewPortRef}
        onScrollCapture={(event) => {
          sessionStorage.setItem(
            "scrollPosition",
            (event.target as HTMLDivElement).scrollTop.toString(),
          );
        }}
      >
        <div className="flex h-full flex-col items-center gap-3 py-3">
          <div className="flex h-10 items-center gap-3">
            <h1 className="text-2xl font-semibold leading-none tracking-tight">
              {format(calendarContext.selectedDate, "E, LLL d")}
            </h1>
            <HeartPulse />
          </div>
          {noMeasurements && (
            <h1 className="text-muted-foreground m-auto text-2xl font-semibold leading-none tracking-tight">
              No Measurements ...
            </h1>
          )}
          <EditBpEntry />
          <DailyDiaryHistoryCard />
        </div>
      </ScrollArea>
    </BpEntryContextProvider>
  );
}
