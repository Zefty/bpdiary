import { AdapterUser } from "next-auth";
import { ProfileForm } from "~/app/_components/settings/profile-form";
import { Separator } from "~/app/_components/shadcn/separator";
import { auth } from "~/server/auth";

export default async function Profile() {
  const session = await auth();
  return (
    <div className="w-full space-y-6">
      <div>
        <h3 className="text-lg font-medium">Account</h3>
        <p className="text-muted-foreground text-sm">
          Update your profile and set your preferred timezone.
        </p>
      </div>
      <Separator className="h-[0.125rem] w-[35rem]" />
      <ProfileForm user={session?.user as AdapterUser} />
    </div>
  );
}
