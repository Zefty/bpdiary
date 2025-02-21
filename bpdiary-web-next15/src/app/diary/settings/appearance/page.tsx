import { AppearanceForm } from "~/app/_components/settings/appearance-form";
import { Separator } from "~/app/_components/shadcn/separator";

export default async function Appearance() {
  return (
    <div className="w-full space-y-6">
      <div>
        <h3 className="text-lg font-medium">Appearance</h3>
        <p className="text-muted-foreground text-sm">
          Customize the theme of the app.
        </p>
      </div>
      <Separator className="h-[0.125rem] w-[35rem]" />
      <AppearanceForm />
    </div>
  );
}
