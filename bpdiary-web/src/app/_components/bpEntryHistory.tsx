import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/app/_components/shadcn/card";
import { RouterOutputs } from "~/trpc/react";
type BloodPressureEntry =
  RouterOutputs["bloodPressure"]["getPaginatedDiary"][0];

export default function BpEntryHistory({
  entry,
}: {
  entry: BloodPressureEntry;
}) {
  return (
    <Card className="w-[500px]">
      <CardHeader>
        <CardTitle>Measurement</CardTitle>
        <CardDescription>{`${entry.createdAt.toDateString()}, ${entry.createdAt.toLocaleTimeString()}`}</CardDescription>
      </CardHeader>
      <CardContent>
        <CardDescription>Systolic: {entry.systolic} mmHg</CardDescription>
        <CardDescription>Diastolic: {entry.diastolic} mmHg</CardDescription>
        <CardDescription>Pulse: {entry.pulse} bpm</CardDescription>
        <CardDescription>Notes: {entry.notes}</CardDescription>
      </CardContent>
      <CardFooter className="flex justify-between"></CardFooter>
    </Card>
  );
}
