import { api, HydrateClient } from "~/trpc/server";
import BpStockChart from "../_components/charts/bp-stock-chart";
import InfiniteFeed from "../_components/bp-feed/infinite-feed";
import HomeHeader from "../_components/header/home-header";
import HomeMetrics from "../_components/charts/home-metrics";

export default async function DiaryHomePage() {
  await Promise.all([
    api.chart.getPastSevenDaysData.prefetch(),
    api.chart.getStockChartData.prefetch(),
    api.feed.getInfiniteDiary.prefetchInfinite({ limit: 10 }),
  ]);

  return (
    <HydrateClient>
      <div className="grid h-screen grid-cols-3 grid-rows-1">
        <div className="tablet:px-[2rem] desktop:px-[5rem] tablet:col-span-2 tablet:py-10 col-span-3 flex flex-col items-center gap-10 px-6 py-6">
          <HomeHeader />
          <div className="grid h-full w-full grid-rows-3 gap-8">
            <div className="flex row-span-1">
              <HomeMetrics className="flex h-full gap-6 pb-3" />
            </div>
            <div className="row-span-2">
              <BpStockChart />
            </div>
          </div>
        </div>
        <div className="relative w-full">
          <div className="absolute top-0 right-0 bottom-0 left-0">
            <InfiniteFeed />
          </div>
        </div>
      </div>
    </HydrateClient>
  );
}
