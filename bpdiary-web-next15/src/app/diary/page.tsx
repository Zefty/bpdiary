import { api, HydrateClient } from "~/trpc/server";
import { SidebarTrigger } from "../_components/shadcn/sidebar";
import BpLineChart from "../_components/charts/timeframe-line-chart";
import InfiniteFeed from "../_components/bp-feed/infinite-feed";
import CalendarHeader from "../_components/calendar/calendar-header";
import { BpEntryContextProvider } from "../_contexts/bpEntryContext";

export default async function DiaryHomePage() {
  await Promise.all([
    api.bloodPressure.getPastSevenDaysDiary.prefetch(),
    api.bloodPressure.getThisWeekDiary.prefetch(),
    api.bloodPressure.getThisMonthDiary.prefetch(),
    api.bloodPressure.getThisYearDiary.prefetch(),
  ]);
  return (
    <HydrateClient>
      <BpEntryContextProvider>
        <div className="flex h-full w-full flex-col">
          <div className="p-2">
            <CalendarHeader />
          </div>
          <div className="flex h-full w-full items-center gap-2 p-2">
            <div className="h-full flex-1">
              <BpLineChart />
            </div>

            <div className="relative hidden h-full flex-1 md:flex">
              <div className="absolute bottom-0 left-0 right-0 top-0">
                <InfiniteFeed />
              </div>
            </div>
          </div>
        </div>
      </BpEntryContextProvider>
    </HydrateClient>
  )
}
