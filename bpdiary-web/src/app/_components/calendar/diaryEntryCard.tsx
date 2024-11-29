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
import { Gauge, HeartPulse, Pencil } from "lucide-react";
import Note from "../custom-inputs/note";
import { Button } from "../shadcn/button";
import { useContext } from "react";
import { EditBpEntryContext } from "../zdeprecated/bpDiaryHistory";

type BloodPressureDiary =
  RouterOutputs["bloodPressure"]["getInfiniteDiary"]["data"][0];

export default function DiaryEntryCard({
  entry,
}: {
  entry: BloodPressureDiary;
}) {
  const editBpEntryContext = useContext(EditBpEntryContext);
  return (
    <Card className="w-[300px]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Measurement</CardTitle>
          <Button
            className="h-full"
            variant="ghost"
            onClick={() => {
              if (editBpEntryContext) {
                editBpEntryContext.setBpEntryData(entry);
                editBpEntryContext.setOpenEditBpEntry(
                  !editBpEntryContext.openEditBpEntry,
                );
              }
            }}
          >
            <Pencil size="16" strokeWidth="3" />
          </Button>
        </div>
        <CardDescription>{`${entry.createdAt.toDateString()}, ${entry.createdAt.toLocaleTimeString("en-us").toUpperCase()}`}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-2 flex justify-between text-sm text-muted-foreground">
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
        <div className="text-sm text-muted-foreground">
          <span className="font-medium underline underline-offset-2">
            Notes:
          </span>
          <Note note={entry.notes} />
        </div>
      </CardContent>
    </Card>
  );
}
