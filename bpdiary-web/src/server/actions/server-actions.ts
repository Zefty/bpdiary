"use server";

import { revalidatePath } from "next/cache";
import { permanentRedirect } from "next/navigation";
import { BpLog } from "../api/shared/types";
import { parseData, preprocessFormData } from "~/lib/utils";
import { api } from "~/trpc/server";

export async function LogBp(formData: FormData) {
  console.log("Logging BP entry");
  console.log(formData);

  try {
    const bpLog = parseData(preprocessFormData(formData, BpLog), BpLog);
    await api.bloodPressure.log(bpLog);
    return true;
  } catch (error) {
    console.error("Failed to parse data", error);
    return false;
  }

  // revalidatePath("/diary/addentry");
  // permanentRedirect("/diary/addentry");
}
