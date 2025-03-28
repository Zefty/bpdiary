import { startOfMonth } from "date-fns";
import { api, HydrateClient } from "~/trpc/server";
import { BpCalendarContextProvider } from "~/app/_contexts/bpCaldendarContext";
import { BpCalendarDataContextProvider } from "~/app/_contexts/bpCalendarDataContext";
import CalendarView from "~/app/_components/calendar/calendar-view";
import DailyFeed from "~/app/_components/bp-feed/daily-feed";
import { getDatetimeString } from "~/lib/utils";
import { Suspense } from "react";
import LoadingCalendar from "~/app/_components/loading-states/loading-calendar";
import { LogBpFormProvider } from "~/app/_contexts/bpEntryContext";

export default async function CalendarPage() {
  const today = new Date();
  const som = startOfMonth(today);

  void api.calendar.getRollingMonthlyDiary.prefetch({
    datetime: getDatetimeString(som),
  });

  return (
    <HydrateClient>
      <BpCalendarContextProvider initialDate={today}>
        <Suspense fallback={<LoadingCalendar />}>
          <BpCalendarDataContextProvider>
            <LogBpFormProvider>
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
            </LogBpFormProvider>
          </BpCalendarDataContextProvider>
        </Suspense>
      </BpCalendarContextProvider>
    </HydrateClient>
  );
}

export const dynamic = "force-dynamic";
