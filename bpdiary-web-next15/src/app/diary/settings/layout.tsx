import { Metadata } from "next";
import SettingsNav from "~/app/_components/navigation/settings-nav";
import { Separator } from "~/app/_components/shadcn/separator";
import { SidebarTrigger } from "~/app/_components/shadcn/sidebar";

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
    <div className="desktop:px-20 desktop:pt-10 desktop:pb-16 flex h-full flex-col p-6">
      <div className="desktop:flex-col desktop:items-start flex items-center">
        <SidebarTrigger
          variant="default"
          className="mobile:flex hidden h-10 px-6 py-2"
        />
        <h2 className="desktop:text-start w-full text-center text-2xl font-bold">
          Settings
        </h2>
        <p className="desktop:block text-muted-foreground hidden">
          Manage your account settings and set preferences.
        </p>
      </div>
      <aside className="mb-6 -ml-2">
        <SettingsNav items={sidebarNavItems} />
      </aside>
      <div className="w-full flex-1">{children}</div>
    </div>
  );
}
