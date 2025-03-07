"use client";

import { Button } from "~/app/_components/shadcn/button";
import { useRef } from "react";
import { useBpEntryContext } from "~/app/_contexts/bpEntryContext";
import { SheetDescription, SheetTitle } from "../shadcn/sheet";
import { BaseBpForm, BpEntryBaseRefs } from "./base-bp-form";

export function LogBpForm() {
  const bpEntryBaseRef = useRef<BpEntryBaseRefs>(null);
  const context = useBpEntryContext();

  return (
    <BaseBpForm
      ref={bpEntryBaseRef}
      open={context.open}
      setOpen={context.setOpen}
      header={
        <div className="flex w-full flex-col justify-items-center">
          <SheetTitle>Log Measurement</SheetTitle>
          <SheetDescription>
            Log new blood pressure measurement.
          </SheetDescription>
        </div>
      }
      footer={
        <>
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
        </>
      }
      bpFormData={context.bpFormData}
    />
  );
}
