"use client";

import { DateMonthLongFormat } from "~/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/app/_components/shadcn/card";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/app/_components/shadcn/chart";
import { HeartPulse } from "lucide-react";
import { api } from "~/trpc/react";
import { endOfDay, startOfDay, subDays } from "date-fns";

const chartConfig = {
  pulse: {
    label: "Pulse",
    color: "hsl(var(--chart-hr))",
  },
} satisfies ChartConfig;

export default function HeartRateChart() {
  const toDate = endOfDay(new Date());
  const fromLastWeek = startOfDay(subDays(toDate, 7));
  const dataPastSevenDays = api.chart.getStockChartData.useQuery({
    fromDate: fromLastWeek,
    toDate,
  });
  const chartData = dataPastSevenDays.data?.map((entry) => ({
    date: entry.measuredAtDate,
    systolic: Math.ceil(entry.avgSystolic),
    diastolic: Math.ceil(entry.avgDiastolic),
    pulse: Math.ceil(entry.avgPulse),
  }));
  return (
    <Card className="bg-muted flex h-full w-full min-w-[10rem] flex-col border-none shadow-none">
      <CardHeader className="items-start p-4 pb-0">
        <div className="flex items-center gap-3">
          <div className="text-sidebar-primary-foreground flex aspect-square size-10 items-center justify-center rounded-md bg-teal-100">
            <HeartPulse className="h-[1.5rem] w-[1.5rem] text-teal-500" />
          </div>
          <CardTitle className="max-desktop:block hidden text-lg">
            Heart R.
          </CardTitle>
          <CardTitle className="desktop:block hidden text-lg">
            Heart Rate
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex h-full w-full flex-col p-4">
        <div className="pb-2">
          {chartData?.length ? (
            <>
              <span className="text-lg font-semibold">
                {`${chartData[chartData.length - 1]?.pulse} `}
              </span>
              <span className="text-muted-foreground text-sm">bpm</span>
            </>
          ) : (
            <span className="text-muted-foreground line-clamp-1">
              no recent measurement...
            </span>
          )}
        </div>
        <div className="flex-1">
          <ChartContainer config={chartConfig} className="h-[99%] w-full">
            <AreaChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 0,
                right: 0,
              }}
            >
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <defs>
                <linearGradient id="fillPulse" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-pulse)"
                    stopOpacity={0.4}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-pulse)"
                    stopOpacity={0.05}
                  />
                </linearGradient>
              </defs>
              <Area
                dataKey="pulse"
                type="natural"
                fill="url(#fillPulse)"
                fillOpacity={0.4}
                stroke="var(--color-pulse)"
                strokeWidth="0.125rem"
                stackId="a"
              />
            </AreaChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
