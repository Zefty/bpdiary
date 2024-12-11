"use client";
import { Moon, Sun } from "lucide-react";
import { SidebarMenuButton } from "../shadcn/sidebar";
import Form from "next/form";

export default function ThemeToggle() {
  const toggleTheme = () => {
    const theme = localStorage.getItem("theme");
    localStorage.setItem(
      "theme",
      theme === "light" || theme === null ? "dark" : "light",
    );
    document.documentElement.classList.toggle("dark");
  };
  return (
    <Form action={async () => {

    }}>
      <SidebarMenuButton
        onClick={toggleTheme}
        className="h-12 pl-4 group-data-[collapsible=icon]:!size-12 group-data-[collapsible=icon]:!pl-4"
      >
        <Sun className="dark:hidden" />
        <Moon className="hidden dark:flex" />
        <span>Appearance</span>
      </SidebarMenuButton>
    </Form>
  );
}
