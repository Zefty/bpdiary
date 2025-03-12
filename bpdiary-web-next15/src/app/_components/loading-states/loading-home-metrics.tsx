import { ScrollArea } from "@radix-ui/react-scroll-area";
import { ScrollBar } from "../shadcn/scroll-area";
import { Skeleton } from "../shadcn/skeleton";

export default function LoadingHomeMetrics() {
  return (
    <ScrollArea className="h-full w-1 flex-1">
      <div className="flex h-full gap-6 pb-3">
        <Skeleton className="flex h-full w-full min-w-[14rem] flex-col rounded-3xl" />
        <Skeleton className="flex h-full w-full min-w-[14rem] flex-col rounded-3xl" />
        <Skeleton className="flex h-full w-full min-w-[14rem] flex-col rounded-3xl" />
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
