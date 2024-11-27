"use client";

import { Button } from "~/app/_components/shadcn/button";
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
import {
  DateTimePicker,
  DateTimePickerRefs,
} from "../custom-inputs/dateTimePicker";
import { NumberPicker, NumberPickerRefs } from "../custom-inputs/numberPicker";
import { Textarea } from "../shadcn/textarea";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { RouterOutputs } from "~/trpc/react";

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
  addOrUpdateEntryAction: (formData: FormData) => Promise<boolean>;
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
          className="flex flex-col items-center sm:max-w-[750px]"
        >
          <SheetHeader className="w-full sm:text-center">
            {sheetHeader}
          </SheetHeader>
          <form
            className="w-full"
            id="bp-entry-base-form"
            action={async (formData: FormData) => {
              const success = await addOrUpdateEntryAction(formData);
              console.log(success);
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
            </div>
          </form>
          <SheetFooter className="w-full">
            {sheetFooter}
            {/* <SheetClose asChild>
            <Button type="submit" form="editBpForm">
              Save changes
            </Button>
          </SheetClose> */}
          </SheetFooter>
        </SheetContent>
      </Sheet>
    );
  },
);

// export default function BpEntryBase({
//   openSheet,
//   setOpenSheet,
//   sheetHeader,
//   sheetFooter,
//   bpEntryData,
//   addOrUpdateEntryAction,
// }: BpEntryBaseProps) {
//   const dateTimePickerRef = useRef<DateTimePickerRefs>(null);
//   const systolicRef = useRef<NumberPickerRefs>(null);
//   const diastolicRef = useRef<NumberPickerRefs>(null);
//   const pulseRef = useRef<NumberPickerRefs>(null);
//   const notesRef = useRef<HTMLTextAreaElement>(null);

//   const resetForm = () => {
//     if (dateTimePickerRef.current) {
//       dateTimePickerRef.current.reset();
//     }
//     if (systolicRef.current) {
//       systolicRef.current.reset();
//     }
//     if (diastolicRef.current) {
//       diastolicRef.current.reset();
//     }
//     if (pulseRef.current) {
//       pulseRef.current.reset();
//     }
//     if (notesRef.current) {
//       notesRef.current.value = "";
//     }
//   };

//   return (
//     <Sheet
//       open={openSheet}
//       onOpenChange={setOpenSheet}
//     >
//       <SheetContent
//         side="right"
//         className="flex flex-col items-center sm:max-w-[750px]"
//       >
//         <SheetHeader className="sm:text-center w-full">
//           {sheetHeader}
//         </SheetHeader>
//         <form
//           className="w-full"
//           id="bp-entry-base-form"
//           action={async (formData: FormData) => {
//             const success = await addOrUpdateEntryAction(formData);
//             console.log(success);
//             if (success) resetForm();
//           }}
//         >
//           <div className="grid w-full items-center gap-4">
//             <div className="flex flex-row items-center">
//               <Label htmlFor="name" className="grow">
//                 Date
//               </Label>
//               <DateTimePicker
//                 name="datetime"
//                 defaultDate={bpEntryData?.createdAt ?? new Date()}
//                 ref={dateTimePickerRef}
//               />
//             </div>
//             <div className="flex flex-col space-y-1.5">
//               <Label htmlFor="name">Blood Pressure</Label>
//             </div>
//             <div className="flex flex-row items-center">
//               <Label htmlFor="name" className="grow">
//                 Systolic
//               </Label>
//               <NumberPicker
//                 name="systolic"
//                 ref={systolicRef}
//                 initialValue={bpEntryData?.systolic}
//                 onNextFocus={() => diastolicRef.current?.focus()}
//               />
//             </div>
//             <div className="flex flex-row items-center">
//               <Label htmlFor="name" className="grow">
//                 Diastolic
//               </Label>
//               <NumberPicker
//                 name="diastolic"
//                 ref={diastolicRef}
//                 initialValue={bpEntryData?.diastolic}
//                 onNextFocus={() => pulseRef.current?.focus()}
//               />
//             </div>
//             <div className="flex flex-row items-center">
//               <Label htmlFor="name" className="grow">
//                 Pulse
//               </Label>
//               <NumberPicker
//                 name="pulse"
//                 ref={pulseRef}
//                 initialValue={bpEntryData?.pulse}
//                 onNextFocus={() => notesRef.current?.focus()}
//               />
//             </div>
//             <div className="flex flex-col space-y-1.5">
//               <Label htmlFor="name">Notes</Label>
//               <Textarea
//                 name="notes"
//                 placeholder="Add some notes here ..."
//                 ref={notesRef}
//                 defaultValue={bpEntryData?.notes ?? ""}
//               />
//             </div>
//           </div>
//         </form>
//         <SheetFooter className="w-full">
//           {sheetFooter}
//           {/* <SheetClose asChild>
//             <Button type="submit" form="editBpForm">
//               Save changes
//             </Button>
//           </SheetClose> */}
//         </SheetFooter>
//       </SheetContent>
//     </Sheet>
//   );
// }
