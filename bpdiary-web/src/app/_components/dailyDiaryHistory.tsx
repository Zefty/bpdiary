"use client";

import React, { useLayoutEffect, useRef, useState } from "react";
import { api, type RouterOutputs } from "~/trpc/react";
import { ScrollArea } from "./shadcn/scroll-area";
import DiaryEntryCard from "./diaryEntryCard";
import EditBpEntry from "./editBpEntry";
import { EditBpEntryContext } from "./bpDiaryHistory";
import {
  useCalendarHistory,
  useRollingDiaryHistoryData,
} from "./diaryHistoryContexts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./shadcn/card";
import DailyDiaryHistoryCard from "./dailyDiaryHistoryCard";

type BloodPressureDiary = RouterOutputs["bloodPressure"]["getMonthlyDiary"];

export default function DailyDiaryHistory() {
  const dataContext = useRollingDiaryHistoryData();
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
          <div className="flex flex-col items-center gap-2">
            <h1 className="m-8 text-2xl font-semibold leading-none tracking-tight">
              Measurements Today ❤️
            </h1>
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
