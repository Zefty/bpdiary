"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button, buttonVariants } from "../shadcn/button";
import { cn } from "~/lib/utils";
import BaseHeader from "../header/base-header";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../shadcn/collapsible";
import { ChevronDown } from "lucide-react";

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
    <>
      <Collapsible className="desktop:hidden mobile:block ml-2">
        <CollapsibleTrigger className="hover:bg-muted rounded-lg">
          <ChevronDown />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <BaseHeader className="flex-col items-start">
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
        </CollapsibleContent>
      </Collapsible>
      <BaseHeader className="mobile:hidden">
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
    </>
  );
}
