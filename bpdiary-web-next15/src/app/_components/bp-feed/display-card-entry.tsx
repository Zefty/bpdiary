import { useBpEntryContext } from "~/app/_contexts/bpEntryContext";
import { RouterOutputs } from "~/trpc/react";
import { Fragment } from "react";
import { Separator } from "../shadcn/separator";
import { ChevronRight, Gauge, HeartPulse } from "lucide-react";
import { Button } from "../shadcn/button";
import Note from "../custom-inputs/note";

type BloodPressureDiary =
    RouterOutputs["feed"]["getInfiniteDiary"]["data"][0];

export default function DisplayCardEntry({
    entry,
}: {
    entry: BloodPressureDiary;
}) {
    const bpEntryContext = useBpEntryContext();
    return (
        <div className="group">
            <div
                className="px-6 pt-6 hover:bg-accent border-l border-r group-first:border-t group-first:rounded-t-lg group-last:border-b group-last:rounded-b-lg "
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
                        <span className="font-medium text-muted-foreground">{`${entry.measuredAt.toDateString()}, ${entry.measuredAt.toLocaleTimeString("en-us").toUpperCase()}`}</span>
                        <Button variant="outline" className="h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100">
                            <ChevronRight width="1.5em" height="1.5em" />
                        </Button>


                    </div>
                    <div className="mb-2 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                            <Gauge className="text-primary" width="1.5em" height="1.5em" />
                            <span className="font-medium">
                                {entry.systolic} / {entry.diastolic} mmHg
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <HeartPulse className="text-primary" width="1.5em" height="1.5em" />
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
        </div>
    );
}