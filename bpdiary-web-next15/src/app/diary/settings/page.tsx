import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const cookieStore = await cookies();
  const lastVisited = cookieStore.get("bpdiary.settings-last-visited")?.value;
  
  if (lastVisited) {
    redirect(lastVisited);
  }
  redirect("/diary/settings/profile");
}
