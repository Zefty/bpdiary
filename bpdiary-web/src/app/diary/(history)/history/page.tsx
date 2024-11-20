import { addMonths, startOfMonth, subMonths } from "date-fns";
import { notFound } from "next/navigation";
import BpDiaryHistory from "~/app/_components/dailyDiaryHistory";
import { CalendarHistory } from "~/app/_components/calendarHistory";
import { CalendarHistoryContextProvider, RollingDiaryHistoryDataContextProvider } from "~/app/_components/diaryHistoryContexts";
import { api, HydrateClient } from "~/trpc/server";
import BpHistory from "~/app/_components/history";

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
      <CalendarHistoryContextProvider initialDate={today}>
        <RollingDiaryHistoryDataContextProvider>
          <BpHistory />
          {/* <PaginationDiary currentPage={page} maxPages={maxPages?.pages} /> */}
        </RollingDiaryHistoryDataContextProvider>
      </CalendarHistoryContextProvider>
    </HydrateClient>
  );
}
