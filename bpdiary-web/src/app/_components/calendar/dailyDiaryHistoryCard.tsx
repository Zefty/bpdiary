"use client";

import { RouterOutputs } from "~/trpc/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../shadcn/card";
import { ChevronRight, Gauge, HeartPulse, Pencil } from "lucide-react";
import Note from "../custom-inputs/note";
import { Button } from "../shadcn/button";
import { Fragment, useContext } from "react";
import { Separator } from "../shadcn/separator";
import { useBpCalendarContext } from "../../_contexts/bpCaldendarContext";
import { useBpDataContext } from "../../_contexts/bpDataContext";
import { UseBpEntryContext } from "~/app/_contexts/bpEntryContext";

export default function DailyDiaryHistoryCard() {
  const calendarContext = useBpCalendarContext();
  const dataContext = useBpDataContext();
  const bpEntryContext = UseBpEntryContext();
  const data = dataContext?.dataFilteredBySelectedDate ?? [];
  return (
    data.length > 0 && (
      <Card className="w-3/4">
        <CardContent className="flex w-full flex-col p-0">
          {data?.map((entry) => (
            <Fragment key={entry.id}>
              <div
                className="group px-6 pt-6 hover:bg-accent"
                onClick={() => {
                  if (bpEntryContext) {
                    bpEntryContext.setBpEntryData(entry);
                    bpEntryContext.setOpenSheet(
                      !bpEntryContext.openSheet,
                    );
                  }
                }}
              >
                <div className="flex flex-col justify-between gap-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-muted-foreground">{`${entry.createdAt.toDateString()}, ${entry.createdAt.toLocaleTimeString("en-us").toUpperCase()}`}</span>
                    <Button variant="outline" className="h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100">
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                    
                    
                  </div>
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Gauge className="text-primary" />
                      <span className="font-medium">
                        {entry.systolic} / {entry.diastolic} mmHg
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <HeartPulse className="text-primary" />
                      <span className="font-medium">{entry.pulse} bpm</span>
                    </div>
                  </div>
                </div>
                <div className="text-sm">
                  <span className="font-medium underline underline-offset-2">
                    Notes:
                  </span>
                  <Note note={entry.notes} />
                </div>
                <Separator className="mt-6 group-last:invisible" />
              </div>
            </Fragment>
          ))}
        </CardContent>
      </Card>
    )
  );
}
