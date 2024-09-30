import { RouterOutputs } from "~/trpc/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./shadcn/card";
import { Gauge, Heart } from "lucide-react";
import Note from "./note";

type BloodPressureDiary =
  RouterOutputs["bloodPressure"]["getInfiniteDiary"]["data"][0];

export default function DiaryEntryCard({
  entry,
}: {
  entry: BloodPressureDiary;
}) {
  return (
    <Card className="w-[300px]">
      <CardHeader>
        <CardTitle>Measurement</CardTitle>
        <CardDescription>{`${entry.createdAt.toDateString()}, ${entry.createdAt.toLocaleTimeString("en-us").toUpperCase()}`}</CardDescription>
      </CardHeader>
      <CardContent>
        <CardDescription className="mb-2 flex justify-between">
          <div className="flex items-center gap-2">
            <Gauge />
            <span>
              {entry.systolic}/{entry.diastolic} mmHg
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Heart />
            <span>{entry.pulse} bpm</span>
          </div>
        </CardDescription>
        <CardDescription>
          <Note note={`Notes: ${entry.notes}`} />
          {/* Notes: {entry.notes} */}
        </CardDescription>
      </CardContent>
    </Card>
  );
}
