"use client";

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
import { DateTimePicker, DateTimePickerRefs } from "./dateTimePicker";
import { NumberPicker, NumberPickerRefs } from "./numberPicker";
import { useRef } from "react";

export default function AddBpEntry() {
  const dateTimePickerRef = useRef<DateTimePickerRefs>(null);
  const systolicRef = useRef<NumberPickerRefs>(null);
  const diastolicRef = useRef<NumberPickerRefs>(null);
  const pulseRef = useRef<NumberPickerRefs>(null);
  const notesRef = useRef<HTMLTextAreaElement>(null);

  const resetForm = () => {
    if (dateTimePickerRef.current) {
      dateTimePickerRef.current.reset();
    }
    if (systolicRef.current) {
      systolicRef.current.reset();
    }
    if (diastolicRef.current) {
      diastolicRef.current.reset();
    }
    if (pulseRef.current) {
      pulseRef.current.reset();
    }
    if (notesRef.current) {
      notesRef.current.value = "";
    }
  };

  return (
    <Card className="my-10 w-[500px] border-0 shadow-none">
      <CardHeader>
        <CardTitle>Log Measurement</CardTitle>
        <CardDescription>Log new blood pressure measurement.</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="logBpForm"
          action={async (formData: FormData) => {
            sessionStorage.removeItem("scrollPosition");
            const success = await LogBp(formData);
            if (success) resetForm();
          }}
        >
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-row items-center">
              <Label htmlFor="name" className="grow">
                Date
              </Label>
              <DateTimePicker
                name="datetime"
                defaultDate={new Date()}
                ref={dateTimePickerRef}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Blood Pressure</Label>
            </div>
            <div className="flex flex-row items-center">
              <Label htmlFor="name" className="grow">
                Systolic
              </Label>
              <NumberPicker name="systolic" ref={systolicRef} />
            </div>
            <div className="flex flex-row items-center">
              <Label htmlFor="name" className="grow">
                Diastolic
              </Label>
              <NumberPicker name="diastolic" ref={diastolicRef} />
            </div>
            <div className="flex flex-row items-center">
              <Label htmlFor="name" className="grow">
                Pulse
              </Label>
              <NumberPicker name="pulse" ref={pulseRef} />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Notes</Label>
              <Textarea
                name="notes"
                placeholder="Add some notes here ..."
                ref={notesRef}
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          type="reset"
          form="logBpForm"
          onClick={resetForm}
        >
          Clear
        </Button>
        <Button type="submit" form="logBpForm">
          Log
        </Button>
      </CardFooter>
    </Card>
  );
}