"use client";

import { Button } from "~/app/_components/shadcn/button";
import { LogBp } from "~/server/actions/server-actions";
import { useRef, useTransition } from "react";
import { BpEntryContextProvider, useBpEntryContext } from "~/app/_contexts/bpEntryContext";
import { SheetDescription, SheetTitle } from "../shadcn/sheet";
import { BaseBpForm, BpEntryBaseRefs } from "./base-bp-form";
import { useServerAction } from "~/app/_hooks/use-server-action";
import { useToast } from "~/app/_hooks/use-toast";

export default function LogBpFormProvider({ children } : { children?: React.ReactNode }) {
  return (
    <BpEntryContextProvider>
      <LogBpForm />
      {children}
    </BpEntryContextProvider>
  )
}

export function LogBpForm() {
  const bpEntryBaseRef = useRef<BpEntryBaseRefs>(null);
  const context = useBpEntryContext();
  const [LogBpAction, isLogging] = useServerAction(LogBp);
  const { toast } = useToast();

  return (
    <BaseBpForm
      ref={bpEntryBaseRef}
      openSheet={context.openSheet}
      setOpenSheet={context.setOpenSheet}
      sheetHeader={
        <div className="flex w-full flex-col justify-items-center">
          <SheetTitle>Log Measurement</SheetTitle>
          <SheetDescription>
            Log new blood pressure measurement.
          </SheetDescription>
        </div>
      }
      sheetFooter={
        <fieldset className="flex w-full justify-between" disabled={isLogging}>
          <Button
            variant="outline"
            type="reset"
            form="bp-entry-base-form"
            onClick={bpEntryBaseRef.current?.resetForm}
          >
            Clear
          </Button>
          <Button type="submit" form="bp-entry-base-form">
            Log
          </Button>
        </fieldset>
      }
      bpEntryData={context.bpEntryData}
      addOrUpdateEntryAction={async (formData: FormData) => {
        sessionStorage.removeItem("scrollPosition");
        const res = await LogBpAction(formData);
        if (res?.message === "success") {
          bpEntryBaseRef.current?.resetForm();
          context.setOpenSheet(!context.openSheet)
          toast({
            title: "Logged new blood pressure measurement!"
          })
        }
      }}
      isSubmitting={isLogging}
    />
  );
}
