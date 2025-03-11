import { auth } from "~/server/auth";
import { ProfileForm } from "./profile-form";
import { type AdapterUser } from "next-auth";

export default async function ProfileSC() {
  const session = await auth();
  return <ProfileForm user={session?.user as AdapterUser} />;
}
