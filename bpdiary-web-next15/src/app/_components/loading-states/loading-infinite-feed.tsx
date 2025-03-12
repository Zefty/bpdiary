import BaseHeader from "../header/base-header";
import HeartLoader from "../navigation/heart-loader";
import { ScrollArea } from "../shadcn/scroll-area";

export default function LoadingInfiniteFeed() {
  return (
    <ScrollArea className="h-full max-h-screen overflow-y-auto border-l-[0.15rem]">
      <div className="flex flex-col items-center">
        <BaseHeader className="my-10 h-10 justify-center border-none shadow-none">
          <h1 className="text-3xl leading-none font-semibold tracking-tight">
            Measurements
          </h1>
        </BaseHeader>
        <div className="relative flex h-[6rem] w-full items-center justify-center gap-2 px-2 pb-2">
          <HeartLoader variant="pulse" className="flex w-12 justify-center" />
        </div>
      </div>
    </ScrollArea>
  );
}
