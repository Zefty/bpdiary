"use client";

import { Label } from "~/app/_components/shadcn/label";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
} from "~/app/_components/shadcn/sheet";
import {
  DateTimePicker,
  DateTimePickerRefs,
} from "../custom-inputs/dateTimePicker";
import { NumberPicker, NumberPickerRefs } from "../custom-inputs/numberPicker";
import { Textarea } from "../shadcn/textarea";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { RouterOutputs } from "~/trpc/react";
import { LoaderCircle } from "lucide-react";

type BloodPressureDiary = RouterOutputs["bloodPressure"]["getInfiniteDiary"];

export interface BpEntryBaseRefs {
  resetForm: () => void;
}

export interface BpEntryBaseProps {
  openSheet: boolean;
  setOpenSheet: (open: boolean) => void;
  sheetHeader: React.ReactNode;
  sheetFooter: React.ReactNode;
  bpEntryData?: BloodPressureDiary["data"][0];
  addOrUpdateEntryAction: (formData: FormData) => void;
  isSubmitting?: boolean;
}

export const BpEntryBase = forwardRef<BpEntryBaseRefs, BpEntryBaseProps>(
  (
    {
      openSheet,
      setOpenSheet,
      sheetHeader,
      sheetFooter,
      bpEntryData,
      addOrUpdateEntryAction,
      isSubmitting,
    },
    ref,
  ) => {
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

    useImperativeHandle(
      ref,
      () => ({
        resetForm,
      }),
      [],
    );

    return (
      <Sheet open={openSheet} onOpenChange={setOpenSheet}>
        <SheetContent
          side="right"
          className="sm:max-w-[750px] p-0"
        >
          <div className={`flex flex-col items-center gap-3 w-full h-full p-9 ${isSubmitting ? "bg-slate-50 bg-opacity-50" : ""}`}>
            <SheetHeader className="w-full sm:text-center">
              {sheetHeader}
            </SheetHeader>
            <form
              className="relative w-full"
              id="bp-entry-base-form"
              action={addOrUpdateEntryAction}
            >
              {isSubmitting && (
                <div className="absolute bottom-0 left-0 right-0 top-0">
                  <div className="absolute left-1/2 top-1/2">
                    <LoaderCircle className="animate-spin" />
                  </div>
                </div>
              )}
              <fieldset
                className="grid w-full items-center gap-4"
                disabled={isSubmitting}
              >
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
                    initialValue={bpEntryData?.systolic}
                    onNextFocus={() => diastolicRef.current?.focus()}
                  />
                </div>
                <div className="flex flex-row items-center">
                  <Label htmlFor="name" className="grow">
                    Diastolic
                  </Label>
                  <NumberPicker
                    name="diastolic"
                    ref={diastolicRef}
                    initialValue={bpEntryData?.diastolic}
                    onNextFocus={() => pulseRef.current?.focus()}
                  />
                </div>
                <div className="flex flex-row items-center">
                  <Label htmlFor="name" className="grow">
                    Pulse
                  </Label>
                  <NumberPicker
                    name="pulse"
                    ref={pulseRef}
                    initialValue={bpEntryData?.pulse}
                    onNextFocus={() => notesRef.current?.focus()}
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
              </fieldset>
            </form>
            <SheetFooter className="w-full">
              {sheetFooter}
            </SheetFooter>
          </div>
        </SheetContent>
      </Sheet>
    );
  },
);