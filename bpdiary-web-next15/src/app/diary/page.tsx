import { api, HydrateClient } from "~/trpc/server";
import BpStockChart from "../_components/charts/bp-stock-chart";
import InfiniteFeed from "../_components/bp-feed/infinite-feed";
import HomeHeader from "../_components/header/home-header";
import BpChart from "../_components/charts/bp-chart";
import HeartRateChart from "../_components/charts/heart-rate-chart";
import MeasurementsChart from "../_components/charts/measurements-charts";
import { endOfDay, startOfDay, startOfYear, subDays } from "date-fns";

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
        <div className="col-span-5 flex flex-col items-center gap-14 px-[5rem] py-10 shadow-sm md:col-span-2">
          <HomeHeader />
          <div className="grid h-full w-full grid-rows-3 gap-14">
            <div className="row-span-1 grid grid-cols-3 grid-rows-1 gap-4">
              <BpChart />
              <HeartRateChart />
              <MeasurementsChart />
            </div>
            <div className="row-span-2">
              <BpStockChart />
            </div>
          </div>
        </div>
        <div className="relative hidden w-full md:block">
          <div className="absolute bottom-0 left-0 right-0 top-0">
            <InfiniteFeed />
          </div>
        </div>
      </div>
    </HydrateClient>
  );
}
