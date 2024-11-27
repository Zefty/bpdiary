"use client";

import React, { useLayoutEffect, useRef, useState } from "react";
import { api, type RouterOutputs } from "~/trpc/react";
import { ScrollArea } from "./shadcn/scroll-area";
import EditBpEntry from "./editBpEntry";
import { EditBpEntryContext } from "./bpDiaryHistory";
import DailyDiaryHistoryCard from "./dailyDiaryHistoryCard";
import { useBpDataContext } from "./contexts/bpDataContext";
import { HeartPulse } from "lucide-react";
import { useBpCalendarContext } from "./contexts/bpCaldendarContext";
import { format } from "date-fns";

type BloodPressureDiary = RouterOutputs["bloodPressure"]["getMonthlyDiary"];

export default function DailyBpHistory() {
  const calendarContext = useBpCalendarContext();
  const dataContext = useBpDataContext();
  const displayHistory =
    (dataContext?.dataFilteredBySelectedDate?.length ?? 0) > 0;

  const viewPortRef = useRef<HTMLDivElement>(null);

  const [openEditBpEntry, setOpenEditBpEntry] = useState(false);
  const [bpEntryData, setBpEntryData] = useState<BloodPressureDiary[0]>();

  useLayoutEffect(() => {
    if (viewPortRef.current) {
      const scrollPosition = sessionStorage.getItem("scrollPosition");
      viewPortRef.current.scrollTop = Number(scrollPosition) ?? 0;
    }
  });

  return (
    <EditBpEntryContext.Provider
      value={{
        openEditBpEntry,
        setOpenEditBpEntry,
        bpEntryData,
        setBpEntryData,
      }}
    >
      <ScrollArea
        className="h-full max-h-screen overflow-y-auto"
        ref={viewPortRef}
        onScrollCapture={(event) => {
          sessionStorage.setItem(
            "scrollPosition",
            (event.target as HTMLDivElement).scrollTop.toString(),
          );
        }}
      >
        {displayHistory ? (
          <div className="flex flex-col items-center gap-3 py-3">
            <div className="h-10 flex items-center gap-3">
              <h1 className="text-2xl font-semibold leading-none tracking-tight">
                {format(calendarContext.selectedDate, "E, LLL d")}
              </h1>
              <HeartPulse />
            </div>
            <EditBpEntry />
            <DailyDiaryHistoryCard />
          </div>
        ) : (
          <div className="h-full flex flex-col justify-center">
            <h1 className="m-auto text-2xl font-semibold leading-none tracking-tight text-muted-foreground">
              No Measurements ...
            </h1>
          </div>
        )}
      </ScrollArea>
    </EditBpEntryContext.Provider>
  );
}
