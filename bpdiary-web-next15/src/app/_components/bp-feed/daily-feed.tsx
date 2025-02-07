"use client";

import React, { useLayoutEffect, useRef } from "react";
import { ScrollArea } from "../shadcn/scroll-area";
import { useBpCalendarDataContext } from "../../_contexts/bpCalendarDataContext";
import { HeartPulse } from "lucide-react";
import { useBpCalendarContext } from "../../_contexts/bpCaldendarContext";
import { format } from "date-fns";
import DisplayCard from "./display-card";

export default function DailyFeed() {
    const calendarContext = useBpCalendarContext();
    const dataContext = useBpCalendarDataContext();
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
        <ScrollArea
            className="h-full max-h-screen overflow-y-auto rounded-md border"
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
                    <HeartPulse width="1.5em" height="1.5em"/>
                </div>
                {noMeasurements ? (
                    <h1 className="text-muted-foreground m-auto text-2xl font-semibold leading-none tracking-tight">
                        No Measurements ...
                    </h1>
                ) : <DisplayCard data={dataContext?.dataFilteredBySelectedDate} />
                }
            </div>
        </ScrollArea>
    );
}
