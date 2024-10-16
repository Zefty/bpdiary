import { notFound } from "next/navigation";
import BpDiaryHistory from "~/app/_components/bpDiaryHistory";
import { CalendarHistory } from "~/app/_components/calendarHistory";
import { ScrollArea } from "~/app/_components/shadcn/scroll-area";
import { api, HydrateClient } from "~/trpc/server";

export default async function History({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const page =
    searchParams.page === undefined ? 1 : parseInt(searchParams.page as string);

  if (page < 1) {
    notFound();
  }

  await api.bloodPressure.getInfiniteDiary.prefetchInfinite({});
  await api.bloodPressure.getMonthlyDiary.prefetch();
  return (
    <HydrateClient>
      <div className="flex w-full h-full items-center">
        <div className="flex-1 h-full">
          <CalendarHistory />
        </div>

        <div className="flex-1 h-full relative">
          <div className="absolute left-0 right-0 top-0 bottom-0">
            <BpDiaryHistory />
          </div>
        </div>
  
      </div>
      
      {/* <PaginationDiary currentPage={page} maxPages={maxPages?.pages} /> */}
    </HydrateClient>
  );
}
