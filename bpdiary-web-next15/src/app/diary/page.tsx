import { api, HydrateClient } from "~/trpc/server";
import BpStockChart from "../_components/charts/bp-stock-chart";
import InfiniteFeed from "../_components/bp-feed/infinite-feed";
import HomeHeader from "../_components/header/home-header";
import HomeMetrics from "../_components/charts/home-metrics";
import { Suspense } from "react";
import LoadingHeader from "../_components/loading-states/loading-header";

export default async function DiaryHomePage() {
  // TODO: Been doing prefetching wrong, causing hydration errors
  //       Probably need to make HomeMetrics a server function that calls data apis then pass as props to client components
  //       Wrap HomeMetrics in a suspense boundary -> Do this to all other prefetching cases

  // void api.chart.getPastSevenDaysData.prefetch();
  // void api.chart.getStockChartData.prefetch();
  // void api.chart.getDatesWithBpMeasurementsByMonth.prefetch();
  // void api.feed.getInfiniteDiary.prefetchInfinite({ limit: 10 });

  return (
    <HydrateClient>
      <div className="grid h-screen grid-cols-3 grid-rows-1">
        <div className="tablet:px-[2rem] desktop:px-[5rem] tablet:col-span-2 tablet:py-10 col-span-3 flex flex-col items-center gap-10 px-6 py-6">
          <Suspense fallback={<LoadingHeader />}>
            <HomeHeader />
          </Suspense>
          <div className="grid h-full w-full grid-rows-3 gap-8">
            <div className="row-span-1 flex">
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
