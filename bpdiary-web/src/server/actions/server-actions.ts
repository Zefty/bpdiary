"use server";

import { revalidatePath } from "next/cache";

export async function LogBp() {
  console.log("Logged BP entry");
  revalidatePath("/diary/addentry");
}
