import { addMonths, startOfMonth, subMonths } from "date-fns";
import { api, HydrateClient } from "~/trpc/server";
import { BpCalendarContextProvider } from "~/app/_contexts/bpCaldendarContext";
import { BpCalendarDataContextProvider } from "~/app/_contexts/bpCalendarDataContext";
import CalendarView from "~/app/_components/calendar/calendar-view";
import DailyFeed from "~/app/_components/bp-feed/daily-feed";

export default async function CalendarPage() {
  const today = new Date();
  const som = startOfMonth(today);

  void api.calendar.getRollingMonthlyDiary.prefetch({ date: som });
  void api.calendar.getRollingMonthlyDiary.prefetch({
    date: subMonths(som, 1),
  });

  void api.calendar.getRollingMonthlyDiary.prefetch({
    date: addMonths(som, 1),
  });

  return (
    <HydrateClient>
      <BpCalendarContextProvider initialDate={today}>
        <BpCalendarDataContextProvider>
          <div className="tablet:grid-cols-3 tablet:grid-rows-1 tablet:items-center tablet:gap-0 grid h-full w-full grid-cols-1 grid-rows-3 gap-2.5">
            <div className="tablet:col-span-2 col-span-1 row-span-2 h-full flex-1">
              <CalendarView />
            </div>
            <div className="tablet:flex relative col-span-1 row-span-1 h-full flex-1">
              <div className="absolute top-0 right-0 bottom-0 left-0">
                <DailyFeed />
              </div>
            </div>
          </div>
        </BpCalendarDataContextProvider>
      </BpCalendarContextProvider>
    </HydrateClient>
  );
}
