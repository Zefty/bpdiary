"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/app/_components/shadcn/card";
import { Area, AreaChart } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/app/_components/shadcn/chart";
import { Activity, CalendarHeart, Gauge } from "lucide-react";
import { api } from "~/trpc/react";
import { endOfDay, startOfDay, subDays } from "date-fns";

const chartConfig = {
  systolic: {
    label: "Systolic",
    color: "hsl(var(--chart-bp))",
  },
} satisfies ChartConfig;

export default function BpChart() {
  const dataPastSevenDays = api.chart.getPastSevenDaysData.useQuery();
  const chartData = dataPastSevenDays.data?.map((entry) => ({
    date: entry.measuredAtDate,
    systolic: Math.ceil(entry.avgSystolic),
    diastolic: Math.ceil(entry.avgDiastolic),
    pulse: Math.ceil(entry.avgPulse),
  }));
  return (
    <Card className="bg-muted flex h-full w-full min-w-[14rem] flex-col rounded-3xl border-none shadow-none">
      <CardHeader className="items-start p-4 pb-0">
        <div className="flex items-center gap-3">
          <div className="text-sidebar-primary-foreground flex aspect-square size-10 items-center justify-center rounded-full bg-red-100">
            <Activity className="text-primary h-[1.5rem] w-[1.5rem]" />
          </div>
          <CardTitle className="text-lg whitespace-nowrap">
            Blood Pressure
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex h-full w-full flex-col p-4">
        <div className="pb-2">
          {chartData && chartData?.length > 0 && (
            <>
              <span className="text-lg font-semibold">
                {`${chartData[chartData.length - 1]?.systolic}/${chartData[chartData.length - 1]?.diastolic} `}
              </span>
              <span className="text-muted-foreground text-sm">mmHg</span>
            </>
          )}
        </div>
        <div className="flex-1">
          {chartData?.length === 0 && (
            <div className="text-muted-foreground flex h-full w-full flex-col items-center gap-2">
              <CalendarHeart className="size-8 stroke-[1.5]" />
              <span className="line-clamp-1">No data...</span>
            </div>
          )}
          {chartData && chartData?.length > 0 && (
            <ChartContainer config={chartConfig} className="h-[99%] w-full">
              <AreaChart
                accessibilityLayer
                data={chartData}
                margin={{
                  left: 0,
                  right: 0,
                }}
              >
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />
                <defs>
                  <linearGradient id="fillSystolic" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-systolic)"
                      stopOpacity={0.4}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-systolic)"
                      stopOpacity={0.05}
                    />
                  </linearGradient>
                </defs>
                <Area
                  dataKey="systolic"
                  type="natural"
                  fill="url(#fillSystolic)"
                  fillOpacity={0.4}
                  stroke="var(--color-systolic)"
                  strokeWidth="0.125rem"
                  stackId="a"
                />
              </AreaChart>
            </ChartContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
