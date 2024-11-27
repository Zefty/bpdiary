"use client";

import { Button } from "~/app/_components/shadcn/button";
import { LogBp } from "~/server/actions/server-actions";
import React, { useRef } from "react";
import { UseBpEntryContext } from "~/app/_contexts/bpEntryContext";
import { SheetDescription, SheetTitle } from "../shadcn/sheet";
import { BpEntryBase, BpEntryBaseRefs } from "./bpEntryBase";

export default function AddBpEntry() {
  const bpEntryBaseRef = useRef<BpEntryBaseRefs>(null);
  const context = UseBpEntryContext();
  return (
    <BpEntryBase
      ref={bpEntryBaseRef}
      openSheet={context.openSheet}
      setOpenSheet={context.setOpenSheet}
      sheetHeader={
        <div className="flex flex-col w-full justify-items-center">
          <SheetTitle>Log Measurement</SheetTitle>
          <SheetDescription>Log new blood pressure measurement.</SheetDescription>
        </div>
      }
      sheetFooter={
        <div className="flex w-full justify-between">
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
        </div>
      }
      bpEntryData={context.bpEntryData}
      addOrUpdateEntryAction={async (formData: FormData) => {
        sessionStorage.removeItem("scrollPosition");
        return await LogBp(formData);
      }}
    />
  );
}
