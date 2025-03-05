import { addMonths, startOfMonth, subMonths } from "date-fns";
import { api, HydrateClient } from "~/trpc/server";
import { BpCalendarContextProvider } from "~/app/_contexts/bpCaldendarContext";
import { BpCalendarDataContextProvider } from "~/app/_contexts/bpCalendarDataContext";
import CalendarView from "~/app/_components/calendar/calendar-view";
import CalendarHeader from "~/app/_components/calendar/calendar-header";
import DailyFeed from "~/app/_components/bp-feed/daily-feed";
import { BpEntryContextProvider } from "~/app/_contexts/bpEntryContext";
import { Separator } from "~/app/_components/shadcn/separator";

export default async function CalendarPage() {
  const today = new Date();
  // today.setHours(0, 0, 0, 0);
  const som = startOfMonth(today);

  await api.calendar.getRollingMonthlyDiary.prefetch({ date: som });
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
          <div className="laptop:grid-cols-3 laptop:grid-rows-1 laptop:items-center laptop:gap-0 grid h-full w-full grid-cols-1 grid-rows-3 gap-2.5">
            <div className="laptop:col-span-2 col-span-1 row-span-2 h-full flex-1">
              <CalendarView />
            </div>
            <div className="laptop:flex relative col-span-1 row-span-1 h-full flex-1">
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
