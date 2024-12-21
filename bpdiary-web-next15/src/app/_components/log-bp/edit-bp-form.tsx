"use client";

import { Button } from "~/app/_components/shadcn/button";
import { EditBp } from "~/server/actions/server-actions";
import { BpFormBase, BpEntryBaseRefs } from "./bp-form-base";
import React, { useRef } from "react";
import { useBpEntryContext } from "~/app/_contexts/bpEntryContext";
import { SheetClose, SheetDescription, SheetTitle } from "../shadcn/sheet";
import { useServerAction } from "~/app/_hooks/use-server-action";
import { useToast } from "~/app/_hooks/use-toast";

export default function EditBpEntry() {
  const bpEntryBaseRef = useRef<BpEntryBaseRefs>(null);
  const context = useBpEntryContext();
  const bpEntryData = context.bpEntryData;
  const EditBpWithId = EditBp.bind(null, bpEntryData?.id);
  const [EditBpWithIdAction, isEditing] = useServerAction(EditBpWithId);
  const { toast } = useToast();
  
  return (
    <BpFormBase
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
        <fieldset className="flex w-full justify-between" disabled={isEditing}>
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
        </fieldset>
      }
      bpEntryData={bpEntryData}
      addOrUpdateEntryAction={async (formData: FormData) => {
        const res = await EditBpWithIdAction(formData);
        if (res?.message === "success") {
          bpEntryBaseRef.current?.resetForm();
          context.setOpenSheet(!context.openSheet);
          toast({
            title: "Edited entry!",
          })
        }
      }}
      isSubmitting={isEditing}
    />
  );
}
