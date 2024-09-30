"use client";

import { Button } from "~/app/_components/shadcn/button";
import { Input } from "~/app/_components/shadcn/input";
import { Label } from "~/app/_components/shadcn/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/app/_components/shadcn/sheet";
import { EditBp } from "~/server/actions/server-actions";
import { DateTimePicker, DateTimePickerRefs } from "./dateTimePicker";
import { NumberPicker, NumberPickerRefs } from "./numberPicker";
import { Textarea } from "./shadcn/textarea";
import { useContext, useRef } from "react";
import { EditBpEntryContext } from "./bpDiaryHistory";

export default function EditBpEntry() {
  const editBpEntryContext = useContext(EditBpEntryContext);
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
  const bpEntryData = editBpEntryContext?.bpEntryData;
  const editBpWithId = EditBp.bind(null, bpEntryData?.id);
  return (
    <Sheet
      open={editBpEntryContext?.openEditBpEntry}
      onOpenChange={editBpEntryContext?.setOpenEditBpEntry}
    >
      <SheetContent side="bottom" className="flex flex-col items-center">
        <SheetTitle>Edit Measurement</SheetTitle>
        <SheetDescription>Edit blood pressure measurement.</SheetDescription>
        <form
          className="w-[500px]"
          id="editBpForm"
          action={async (formData: FormData) => {
            const success = await editBpWithId(formData);
            console.log(success);
            // if (success) resetForm();
          }}
        >
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-row items-center">
              <Label htmlFor="name" className="grow">
                Date
              </Label>
              <DateTimePicker
                name="datetime"
                defaultDate={bpEntryData?.createdAt ?? new Date()}
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
              <NumberPicker
                name="systolic"
                ref={systolicRef}
                defaultValue={bpEntryData?.systolic}
              />
            </div>
            <div className="flex flex-row items-center">
              <Label htmlFor="name" className="grow">
                Diastolic
              </Label>
              <NumberPicker
                name="diastolic"
                ref={diastolicRef}
                defaultValue={bpEntryData?.diastolic}
              />
            </div>
            <div className="flex flex-row items-center">
              <Label htmlFor="name" className="grow">
                Pulse
              </Label>
              <NumberPicker
                name="pulse"
                ref={pulseRef}
                defaultValue={bpEntryData?.pulse}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Notes</Label>
              <Textarea
                name="notes"
                placeholder="Add some notes here ..."
                ref={notesRef}
                defaultValue={bpEntryData?.notes ?? ""}
              />
            </div>
          </div>
        </form>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit" form="editBpForm">
              Save changes
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
