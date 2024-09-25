import { Button } from "~/app/_components/shadcn/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/app/_components/shadcn/card";
import { Label } from "~/app/_components/shadcn/label";
import { LogBp } from "~/server/actions/server-actions";
import { Textarea } from "./shadcn/textarea";
import { DateTimePicker } from "./dateTimePicker";
import NumberPicker from "./numberPicker";

export default async function AddBpEntry() {
  return (
    <Card className="my-10 w-[500px] border-0 shadow-none">
      <CardHeader>
        <CardTitle>Log Measurement</CardTitle>
        <CardDescription>Log new blood pressure measurement.</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="logBpForm" action={LogBp}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-row items-center">
              <Label htmlFor="name" className="grow">
                Date
              </Label>
              <DateTimePicker defaultDate={new Date()} />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Blood Pressure</Label>
            </div>
            <div className="flex flex-row items-center">
              <Label htmlFor="name" className="grow">
                Systolic
              </Label>
              <NumberPicker />
            </div>
            <div className="flex flex-row items-center">
              <Label htmlFor="name" className="grow">
                Diastolic
              </Label>
              <NumberPicker />
            </div>
            <div className="flex flex-row items-center">
              <Label htmlFor="name" className="grow">
                Pulse
              </Label>
              <NumberPicker />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Notes</Label>
              <Textarea id="name" placeholder="Add some notes here ..." />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" type="submit" form="logBpForm">
          Clear
        </Button>
        <Button type="submit" form="logBpForm">
          Log
        </Button>
      </CardFooter>
    </Card>
  );
}
