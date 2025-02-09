"use client";

import React, { useLayoutEffect, useRef } from "react";
import { ScrollArea } from "../shadcn/scroll-area";
import { useBpCalendarDataContext } from "../../_contexts/bpCalendarDataContext";
import { HeartPulse } from "lucide-react";
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
        <ScrollArea
            className="h-full max-h-screen overflow-y-auto border rounded-md"
        >
            <div className="flex h-full flex-col items-center gap-2">
                <BaseHeader className="h-14 gap-3 border-none shadow-none justify-center border">
                    <h1 className="text-2xl font-semibold leading-none tracking-tight">
                        {format(calendarContext.selectedDate, "E, LLL d")}
                    </h1>
                    <HeartPulse width="1.5em" height="1.5em" />
                </BaseHeader>
                {noMeasurements ? (
                    <h1 className="text-muted-foreground text-2xl font-semibold leading-none tracking-tight">
                        No Measurements ...
                    </h1>
                ) : <DisplayCard data={dataContext?.dataFilteredBySelectedDate} />
                }
            </div>
        </ScrollArea>
    );
}
