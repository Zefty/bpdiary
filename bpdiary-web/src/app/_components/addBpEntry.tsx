import { Button } from "~/app/_components/shadcn/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/app/_components/shadcn/card";
import { Input } from "~/app/_components/shadcn/input";
import { Label } from "~/app/_components/shadcn/label";
import { LogBp } from "~/server/actions/server-actions";

export default async function AddBpEntry() {
  return (
    <Card className="my-20 w-[500px] border-0 shadow-none">
      <CardHeader>
        <CardTitle>Log Measurement</CardTitle>
        <CardDescription>Log new blood pressure measurement.</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="logBpForm" action={LogBp}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Date</Label>
              <Input id="name" placeholder="Name of your project" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Blood Pressure</Label>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Systolic</Label>
              <Input id="name" placeholder="Name of your project" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Diastolic</Label>
              <Input id="name" placeholder="Name of your project" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Pulse</Label>
              <Input id="name" placeholder="Name of your project" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Notes</Label>
              <Input id="name" placeholder="Name of your project" />
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
