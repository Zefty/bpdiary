"use client";

import { Button } from "~/app/_components/shadcn/button";
import { BaseBpForm, type BpEntryBaseRefs } from "./base-bp-form";
import React, { useRef } from "react";
import { useBpEntryContext } from "~/app/_contexts/bpEntryContext";
import { DialogTitle } from "../shadcn/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";

export function EditBpForm() {
  const bpEntryBaseRef = useRef<BpEntryBaseRefs>(null);
  const context = useBpEntryContext();
  // const bpFormData = context.bpFormData;

  return (
    <BaseBpForm
      ref={bpEntryBaseRef}
      open={context.open}
      setOpen={context.setOpen}
      header={
        <div className="flex w-full flex-col justify-items-center">
          <DialogTitle>Edit Measurement</DialogTitle>
          <DialogDescription>
            Edit blood pressure measurement.
          </DialogDescription>
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
            Save changes
          </Button>
        </>
      }
      bpFormData={context.bpFormData}
    />
  );
}
