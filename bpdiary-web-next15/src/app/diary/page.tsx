import { api, HydrateClient } from "~/trpc/server";
import BpStockChart from "../_components/charts/bp-stock-chart";
import InfiniteFeed from "../_components/bp-feed/infinite-feed";
import HomeHeader from "../_components/header/home-header";
import BpChart from "../_components/charts/bp-chart";
import HeartRateChart from "../_components/charts/heart-rate-chart";
import MeasurementsChart from "../_components/charts/measurements-charts";
import { auth } from "~/server/auth";
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
    api.feed.getInfiniteDiary.prefetchInfinite({ limit: 10 })
  ]);
  const session = await auth();
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
