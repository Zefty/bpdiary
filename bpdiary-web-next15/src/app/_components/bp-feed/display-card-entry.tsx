import { useBpEntryContext } from "~/app/_contexts/bpEntryContext";
import { RouterOutputs } from "~/trpc/react";
import { Fragment } from "react";
import { Separator } from "../shadcn/separator";
import { ChevronRight, Gauge, HeartPulse } from "lucide-react";
import { Button } from "../shadcn/button";
import Note from "../custom-inputs/note";

type BloodPressureDiary = RouterOutputs["feed"]["getInfiniteDiary"]["data"][0];

export default function DisplayCardEntry({
  entry,
}: {
  entry: BloodPressureDiary;
}) {
  const bpEntryContext = useBpEntryContext();
  return (
    <div className="group px-4 py-2">
      <div
        className="bg-muted hover:bg-accent rounded-md px-6 py-6"
        onClick={() => {
          if (bpEntryContext) {
            bpEntryContext.setBpFormData({
              datetime: entry.measuredAt,
              systolic: entry.systolic ?? undefined,
              diastolic: entry.diastolic ?? undefined,
              pulse: entry.pulse ?? undefined,
              notes: entry.notes ?? undefined,
              id: entry.id,
            });
            bpEntryContext.setOpen(!bpEntryContext.open);
          }
        }}
      >
        <div className="flex flex-col justify-between gap-2">
          <div className="flex items-center justify-between">
            <span className="font-medium">{`${entry.measuredAt.toDateString()}, ${entry.measuredAt.toLocaleTimeString("en-us").toUpperCase()}`}</span>
            <Button
              variant="outline"
              className="h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
            >
              <ChevronRight width="1.5em" height="1.5em" />
            </Button>
          </div>
          <div className="text-muted-foreground mb-2 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Gauge className="text-primary" width="1.5em" height="1.5em" />
              <span className="font-medium">
                {entry.systolic} / {entry.diastolic} mmHg
              </span>
            </div>
            <div className="flex items-center gap-2">
              <HeartPulse
                className="text-primary"
                width="1.5em"
                height="1.5em"
              />
              <span className="font-medium">{entry.pulse} bpm</span>
            </div>
          </div>
        </div>
        <div className="text-sm">
          <span className="font-medium underline underline-offset-2">
            Notes:
          </span>
          <Note note={entry.notes} className="text-muted-foreground" />
        </div>
        {/* <Separator className="mt-6 group-last:invisible" /> */}
      </div>
    </div>
  );
}
