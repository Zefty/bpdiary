"use server";

import { revalidatePath } from "next/cache";
import { BpMeasurement } from "../api/shared/types";
import { parseData, preprocessFormData } from "~/lib/utils";
import { api } from "~/trpc/server";

export async function LogBp(formData: FormData) {
  console.log("Logging BP entry");
  console.log(formData);

  try {
    const bpMeasurement = parseData(
      preprocessFormData(formData, BpMeasurement),
      BpMeasurement,
    );
    await api.bloodPressure.logMeasurement(bpMeasurement);
    revalidatePath("/diary");
    return { message: "success" };
  } catch (error) {
    console.error("Failed to parse data", error);
    return { message: "failed" };
  }
}

export async function EditBp(entryId: number | undefined, formData: FormData) {
  console.log("Editing BP entry");
  console.log(entryId);
  console.log(formData);

  try {
    if (entryId === undefined) throw new Error("Entry ID is undefined");
    const bpMeasurement = parseData(
      preprocessFormData(formData, BpMeasurement),
      BpMeasurement,
    );
    await api.bloodPressure.editMeasurement({ ...bpMeasurement, id: entryId });
    revalidatePath("/diary");
    return { message: "success" };
  } catch (error) {
    console.error("Failed to parse data", error);
    return { message: "failed" };
  }
}
