"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../shadcn/button";
import { cn } from "~/lib/utils";
import BaseHeader from "../header/base-header";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string;
    title: string;
  }[];
}

export default function SettingsNav({
  className,
  items,
  ...props
}: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <BaseHeader className={cn("flex", className)} {...props}>
      {items.map((item) => (
        <Link key={item.href} href={item.href}>
          <Button
            variant="ghost"
            className={cn(
              "h-12 rounded-full",
              pathname === item.href && "bg-muted",
            )}
          >
            {item.title}
          </Button>
        </Link>
      ))}
    </BaseHeader>
  );
}
