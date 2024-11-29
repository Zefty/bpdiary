"use server";

import { revalidatePath } from "next/cache";
import { BpLog } from "../api/shared/types";
import { parseData, preprocessFormData } from "~/lib/utils";
import { api } from "~/trpc/server";

export async function LogBp(formData: FormData) {
  console.log("Logging BP entry");
  console.log(formData);

  try {
    const bpLog = parseData(preprocessFormData(formData, BpLog), BpLog);
    await api.bloodPressure.log(bpLog);
    revalidatePath("/diary/history");
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
    const bpLog = parseData(preprocessFormData(formData, BpLog), BpLog);
    await api.bloodPressure.editLog({ ...bpLog, id: entryId });
    revalidatePath("/diary/history");
    return { message: "success" };
  } catch (error) {
    console.error("Failed to parse data", error);
    return { message: "failed" };
  }
}
