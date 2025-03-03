import { api, HydrateClient } from "~/trpc/server";
import BpStockChart from "../_components/charts/bp-stock-chart";
import InfiniteFeed from "../_components/bp-feed/infinite-feed";
import HomeHeader from "../_components/header/home-header";
import BpChart from "../_components/charts/bp-chart";
import HeartRateChart from "../_components/charts/heart-rate-chart";
import MeasurementsChart from "../_components/charts/measurements-charts";
import { endOfDay, startOfDay, startOfYear, subDays } from "date-fns";
import HomeMetrics from "../_components/charts/home-metrics";

export default async function DiaryHomePage() {
  const toDate = endOfDay(new Date());
  const fromLastWeek = startOfDay(subDays(toDate, 7));
  const fromLastMonth = startOfDay(subDays(toDate, 30));
  const fromLastYear = startOfDay(subDays(toDate, 365));
  const fromStartOfYear = startOfYear(toDate);
  const fromAll = new Date(0);

  await Promise.all([
    api.chart.getStockChartData.prefetch({ fromDate: fromLastWeek, toDate }),
    api.chart.getStockChartData.prefetch({ fromDate: fromLastMonth, toDate }),
    api.chart.getStockChartData.prefetch({ fromDate: fromLastYear, toDate }),
    api.chart.getStockChartData.prefetch({ fromDate: fromStartOfYear, toDate }),
    api.chart.getStockChartData.prefetch({ fromDate: fromAll, toDate }),
    api.feed.getInfiniteDiary.prefetchInfinite({ limit: 10 }),
  ]);

  return (
    <HydrateClient>
      <div className="grid h-screen grid-cols-3 grid-rows-1">
        <div className="desktop:px-[5rem] desktop:col-span-2 desktop:py-10 mobile:py-6 col-span-5 flex flex-col items-center gap-10 px-6">
          <HomeHeader />
          <div className="grid h-full w-full grid-rows-3 gap-10">
            <div className="row-span-1">
              <HomeMetrics className="desktop:grid desktop:grid-cols-3 desktop:grid-rows-1 desktop:w-full desktop:pb-0 flex h-full max-w-[calc(100vw_-_3rem)] gap-6 pb-4" />
            </div>
            <div className="row-span-2">
              <BpStockChart />
            </div>
          </div>
        </div>
        <div className="desktop:block relative hidden w-full">
          <div className="absolute top-0 right-0 bottom-0 left-0">
            <InfiniteFeed />
          </div>
        </div>
      </div>
    </HydrateClient>
  );
}
