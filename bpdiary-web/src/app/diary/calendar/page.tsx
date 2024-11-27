import { addMonths, startOfMonth, subMonths } from "date-fns";
import { notFound } from "next/navigation";
import { api, HydrateClient } from "~/trpc/server";
import BpCalendarView from "~/app/_components/bpCalendarView";
import { BpCalendarContextProvider } from "~/app/_components/contexts/bpCaldendarContext";
import { BpDataContextProvider } from "~/app/_components/contexts/bpDataContext";

export default async function Calendar({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const page =
    searchParams.page === undefined ? 1 : parseInt(searchParams.page as string);

  if (page < 1) {
    notFound();
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const som = startOfMonth(today);

  await api.bloodPressure.getInfiniteDiary.prefetchInfinite({});
  await api.bloodPressure.getMonthlyRollingDiary.prefetch({date: som});
  void api.bloodPressure.getMonthlyRollingDiary.prefetch({
    date: subMonths(som, 1),
  });

  void api.bloodPressure.getMonthlyRollingDiary.prefetch({
    date: addMonths(som, 1),
  });

  // await api.bloodPressure.getMonthlyDiary.prefetch({year: today.getFullYear(), month: today.getMonth()});
  // await api.bloodPressure.getMonthlyPaginatedDiary.prefetchInfinite(
  //   {
  //     cursor: {
  //       year: today.getFullYear(), month: today.getMonth()
  //     },
  //   },
  //   {
  //     initialCursor: {
  //       year: today.getFullYear(),
  //       month: today.getMonth(),
  //     }
  //   },
  // );
  return (
    <HydrateClient>
      <BpCalendarContextProvider initialDate={today}>
        <BpDataContextProvider>
          <BpCalendarView />
          {/* <PaginationDiary currentPage={page} maxPages={maxPages?.pages} /> */}
        </BpDataContextProvider>
      </BpCalendarContextProvider>
    </HydrateClient>
  );
}
