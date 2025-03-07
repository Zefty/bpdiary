"use client";

import { Moon, Sun } from "lucide-react";
import { SidebarMenuButton } from "../shadcn/sidebar";
import { useTheme } from "next-themes";
import { cn } from "~/lib/utils";

export default function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();

  return (
    <SidebarMenuButton
      onClick={() => {
        const opposite = theme === "light" ? "dark" : "light";
        setTheme(opposite);
      }}
      className={cn("group/theme", className)}
    >
      <Sun className="size-6 stroke-[2.25] group-hover/theme:stroke-[2.75] dark:hidden" />
      <Moon className="hidden size-6 stroke-[2.25] group-hover/theme:stroke-[2.75] dark:flex" />
      <span>Appearance</span>
    </SidebarMenuButton>
  );
}
