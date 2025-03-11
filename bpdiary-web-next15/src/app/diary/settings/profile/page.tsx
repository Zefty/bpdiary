import { Suspense } from "react";
import LoadingProfile from "~/app/_components/loading-states/loading-profile";
import ProfileSC from "~/app/_components/settings/profile-sc";
import { Separator } from "~/app/_components/shadcn/separator";

export default async function Profile() {
  return (
    <div className="w-full space-y-6">
      <div>
        <h3 className="text-lg font-medium">Account</h3>
        <p className="text-muted-foreground text-sm">
          Update your profile and set your preferred timezone.
        </p>
      </div>
      <Separator className="desktop:w-[35rem] h-[0.125rem]" />
      <Suspense fallback={<LoadingProfile />}>
        <ProfileSC />
      </Suspense>
    </div>
  );
}
