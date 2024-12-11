"use client";
import { Sun } from "lucide-react";
import { SidebarMenuButton } from "../shadcn/sidebar";

export default function ThemeToggle() {
  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
  };
  return (
    <SidebarMenuButton onClick={toggleTheme} className="h-12 pl-4 group-data-[collapsible=icon]:!size-12 group-data-[collapsible=icon]:!pl-4">
      <Sun />
      <span>Appearance</span>
    </SidebarMenuButton>
  );
}
