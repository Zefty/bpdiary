import { Metadata } from "next";
import SettingsNav from "~/app/_components/navigation/settings-nav";
import { buttonVariants } from "~/app/_components/shadcn/button";
import { Separator } from "~/app/_components/shadcn/separator";
import { SidebarTrigger } from "~/app/_components/shadcn/sidebar";
import { cn } from "~/lib/utils";

export const metadata: Metadata = {
  title: "Forms",
  description: "Advanced form example using react-hook-form and Zod.",
};

const sidebarNavItems = [
  {
    title: "Profile",
    href: "/diary/settings/profile",
  },
  {
    title: "Notifications",
    href: "/diary/settings/notifications",
  },
  {
    title: "Appearance",
    href: "/diary/settings/appearance",
  },
  {
    title: "About & Support",
    href: "/diary/settings/about",
  },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="laptop:px-20 laptop:pt-10 laptop:pb-16 flex h-full flex-col p-6">
      <div className="laptop:flex-col laptop:items-start flex items-center">
        <SidebarTrigger
          className={cn(
            "laptop:hidden mr-auto flex",
            buttonVariants({ size: "circular", variant: "muted" }),
          )}
        />
        <h2 className="laptop:text-start w-full text-center text-2xl font-bold">
          Settings
        </h2>
        <p className="laptop:block text-muted-foreground hidden">
          Manage your account settings and set preferences.
        </p>
      </div>
      <aside className="my-2 -ml-2">
        <SettingsNav items={sidebarNavItems} />
      </aside>
      <div className="w-full flex-1">{children}</div>
    </div>
  );
}
