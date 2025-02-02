import { addMonths, startOfMonth, subMonths } from "date-fns";
import { api, HydrateClient } from "~/trpc/server";
import { BpCalendarContextProvider } from "~/app/_contexts/bpCaldendarContext";
import { BpCalendarDataContextProvider } from "~/app/_contexts/bpCalendarDataContext";
import CalendarView from "~/app/_components/calendar/calendar-view";
import CalendarHeader from "~/app/_components/calendar/calendar-header";
import DailyFeed from "~/app/_components/bp-feed/daily-feed";
import { BpEntryContextProvider } from "~/app/_contexts/bpEntryContext";

export default async function CalendarPage() {
  const today = new Date();
  // today.setHours(0, 0, 0, 0);
  const som = startOfMonth(today);

  await api.feed.getInfiniteDiary.prefetchInfinite({});
  await api.calendar.getMonthlyRollingDiary.prefetch({ date: som });
  void api.calendar.getMonthlyRollingDiary.prefetch({
    date: subMonths(som, 1),
  });

  void api.calendar.getMonthlyRollingDiary.prefetch({
    date: addMonths(som, 1),
  });

  return (
    <HydrateClient>
      <BpCalendarContextProvider initialDate={today}>
        <BpCalendarDataContextProvider>
            <div className="flex h-full w-full flex-col py-2 gap-2">
              <div className="px-2">
                <CalendarHeader />
              </div>
              <div className="flex h-full w-full items-center gap-2 px-2">
                <div className="h-full flex-1">
                  <CalendarView />
                </div>

                <div className="relative hidden h-full flex-1 md:flex">
                  <div className="absolute bottom-0 left-0 right-0 top-0 ">
                    <DailyFeed />
                  </div>
                </div>
              </div>
            </div>
        </BpCalendarDataContextProvider>
      </BpCalendarContextProvider>
    </HydrateClient>
  );
}
