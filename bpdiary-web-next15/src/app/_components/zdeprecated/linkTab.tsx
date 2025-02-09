"use client";

import { cva } from "class-variance-authority";
import { usePathname } from "next/navigation";
import React from "react";

export default function LinkTab({
  path,
  children,
}: {
  path: string;
  children?: React.ReactNode;
}) {
  const pathname = usePathname();
  return (
    <div
      className={`flex flex-col items-center ${path === pathname ? "text-primary" : ""}`}
    >
      {children}
    </div>
  );
}

const navigationMenuTriggerStyle = cva(
  "group inline-flex flex-col w-max items-center justify-center rounded-md bg-background px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-colors hover:bg-accent hover:text-primary",
);
