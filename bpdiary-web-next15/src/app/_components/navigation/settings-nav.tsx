"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button, buttonVariants } from "../shadcn/button";
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
    <BaseHeader>
      {items.map((item) => (
        <Button
          key={item.href}
          variant="ghost"
          className={cn(pathname === item.href && "bg-muted")}
        >
          <Link href={item.href}>{item.title}</Link>
        </Button>
      ))}
    </BaseHeader>
  );
}
