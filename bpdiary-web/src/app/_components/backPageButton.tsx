"use client";

import { ChevronLeft } from "lucide-react";
import { Button } from "./shadcn/button";
import { cn } from "~/lib/utils";
import { useRouter } from "next/navigation";

export default function BackPageButton({
  className,
}: {
  className: string | undefined;
}) {
  const router = useRouter();
  return (
    <Button className={cn("w-14", className)} onClick={() => router.back()}>
      <ChevronLeft className="h-4 w-4" />
    </Button>
  );
}
