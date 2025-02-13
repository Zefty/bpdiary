"use client";

import { Calendar, Home, Link, Settings } from "lucide-react";
import { cn } from "~/lib/utils";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "../shadcn/sidebar";

const sidebarBodyItems = [
  {
    title: "Home",
    url: "/diary",
    icon: Home,
  },
  {
    title: "Diary",
    url: "/diary/calendar",
    icon: Calendar,
  },
  {
    title: "Settings",
    url: "/diary/settings",
    icon: Settings,
  },
];

export default function SidebarBody() {
  return (
    <>
      {sidebarBodyItems.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton
            asChild
            className={cn(
              "h-16 gap-6 pl-8 text-xl font-medium group-data-[collapsible=icon]:!size-12 group-data-[collapsible=icon]:!pl-[0.75rem] [&>svg]:size-6",
            )}
          >
            <Link href={item.url}>
              <item.icon strokeWidth={2.25} />
              <span className="group-data-[collapsible=icon]:hidden">
                {item.title}
              </span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </>
  );
}
