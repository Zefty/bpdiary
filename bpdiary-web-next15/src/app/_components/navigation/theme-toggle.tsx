"use client";

import { Moon, Sun } from "lucide-react";
import { SidebarMenuButton } from "../shadcn/sidebar";
import { useTheme } from "next-themes";
import { api } from "~/trpc/react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <SidebarMenuButton
      onClick={() => {
        const opposite = theme === "light" ? "dark" : "light";
        setTheme(opposite);
      }}
      className="h-12 pl-4 group-data-[collapsible=icon]:!size-12 group-data-[collapsible=icon]:!pl-4"
    >
      <Sun className="dark:hidden" />
      <Moon className="hidden dark:flex" />
      <span>Appearance</span>
    </SidebarMenuButton>
  );
}
