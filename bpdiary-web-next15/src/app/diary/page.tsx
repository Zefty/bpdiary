import { api, HydrateClient } from "~/trpc/server";
import { SidebarTrigger } from "../_components/shadcn/sidebar";
import BpStockChart from "../_components/charts/bp-stock-chart";
import InfiniteFeed from "../_components/bp-feed/infinite-feed";
import HomeHeader from "../_components/header/home-header";
import BpChart from "../_components/charts/bp-chart";
import HeartRateChart from "../_components/charts/heart-rate-chart";
import MeasurementsChart from "../_components/charts/measurements-charts";

export default async function DiaryHomePage() {
  await Promise.all([
    api.bloodPressure.getPastSevenDaysDiary.prefetch(),
    api.bloodPressure.getThisWeekDiary.prefetch(),
    api.bloodPressure.getThisMonthDiary.prefetch(),
    api.bloodPressure.getThisYearDiary.prefetch(),
    api.bloodPressure.getInfiniteDiary.prefetchInfinite({
      limit: 10
    })
  ]);
  return (
    <HydrateClient>
      <div className="h-screen grid grid-rows-1 grid-cols-3 p-2 gap-2">
        <div className="flex flex-col items-center gap-2 col-span-3 md:col-span-2 ">
          <HomeHeader />
          <div className="h-full w-full flex flex-col items-center border rounded-md p-8">
            <div className="h-full w-full max-w-[1024px] grid grid-rows-1 grid-cols-3 gap-8">
              <div className="col-span-2">
                <BpStockChart />
              </div>
              <div className="col-span-1 grid grid-rows-3 grid-cols-1 gap-8">
                <BpChart />
                <HeartRateChart />
                <MeasurementsChart />
              </div>
            </div>
          </div>
        </div>
        <div className="relative hidden md:block w-full">
          <div className="absolute bottom-0 left-0 right-0 top-0">
            <InfiniteFeed />
          </div>
        </div>
      </div>
    </HydrateClient>
  )
}
