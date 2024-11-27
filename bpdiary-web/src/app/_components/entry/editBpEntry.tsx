"use client";

import { Button } from "~/app/_components/shadcn/button";
import { EditBp } from "~/server/actions/server-actions";
import { BpEntryBase, BpEntryBaseRefs } from "./bpEntryBase";
import React, { useRef } from "react";
import { UseBpEntryContext } from "~/app/_contexts/bpEntryContext";
import { SheetClose, SheetDescription, SheetTitle } from "../shadcn/sheet";

export default function EditBpEntry() {
  const bpEntryBaseRef = useRef<BpEntryBaseRefs>(null);
  const context = UseBpEntryContext();
  const bpEntryData = context.bpEntryData;
  const EditBpWithId = EditBp.bind(null, bpEntryData?.id);
  return (
    <BpEntryBase
      ref={bpEntryBaseRef}
      openSheet={context.openSheet}
      setOpenSheet={context.setOpenSheet}
      sheetHeader={
        <div className="flex w-full flex-col justify-items-center">
          <SheetTitle>Edit Measurement</SheetTitle>
          <SheetDescription>Edit blood pressure measurement.</SheetDescription>
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
          <SheetClose asChild>
            <Button type="submit" form="bp-entry-base-form">
              Save changes
            </Button>
          </SheetClose>
        </div>
      }
      bpEntryData={context.bpEntryData}
      addOrUpdateEntryAction={async (formData: FormData) => {
        return await EditBpWithId(formData);
      }}
    />
  );
}
