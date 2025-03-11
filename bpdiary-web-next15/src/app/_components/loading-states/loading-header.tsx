import { Bell } from "lucide-react";
import BaseHeader from "../header/base-header";
import LogBpFormTrigger from "../log-bp/log-bp-form-trigger";
import { Button, buttonVariants } from "../shadcn/button";
import { Skeleton } from "../shadcn/skeleton";
import { SidebarTrigger } from "../shadcn/sidebar";
import { cn } from "~/lib/utils";

export default async function LoadingHeader() {
  return (
    <BaseHeader className="flex-col items-start p-0">
      <div className="flex w-full items-start justify-start gap-2">
        <SidebarTrigger
          className={cn(
            "tablet:hidden mr-auto flex",
            buttonVariants({ size: "circular", variant: "muted" }),
          )}
        />
        <Skeleton className="mr-auto h-10 w-[30rem] rounded-lg align-middle" />
        <LogBpFormTrigger variant="muted" size="circular" />
        <Button variant="muted" size="circular">
          <Bell className="size-[1.5rem]" />
        </Button>
      </div>
      <Skeleton className="tablet:hidden mr-auto pt-4 align-middle text-3xl text-[1.5rem] leading-none font-semibold tracking-tight" />
      <Skeleton className="mr-auto h-4 w-[30rem] rounded-lg align-middle" />
    </BaseHeader>
  );
}
