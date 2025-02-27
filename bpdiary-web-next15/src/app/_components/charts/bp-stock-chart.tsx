"use client";

import { Area, AreaChart, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/app/_components/shadcn/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/app/_components/shadcn/chart";
import { cn, DateMonthShortFormat } from "~/lib/utils";
import { api, RouterOutputs } from "~/trpc/react";
import { Switch } from "../shadcn/switch";
import { Label } from "../shadcn/label";
import { useState } from "react";
import { endOfDay, startOfDay, startOfYear, subDays } from "date-fns";
import { Button } from "../shadcn/button";
import { Popover, PopoverContent, PopoverTrigger } from "../shadcn/popover";
import { ChevronDown } from "lucide-react";

export const description = "A linear line chart";

const chartConfig = {
  systolic: {
    label: "Systolic",
    color: "hsl(var(--chart-bp))",
  },
  diastolic: {
    label: "Diastolic",
    color: "hsl(var(--chart-m))",
  },
  pulse: {
    label: "Pulse",
    color: "hsl(var(--chart-hr))",
  },
} satisfies ChartConfig;
type ChartTypes = keyof typeof chartConfig;

const TIMEFRAMES = ["W", "M", "YTD", "Y", "All"] as const;
type Timeframes = (typeof TIMEFRAMES)[number];

type DiaryData = RouterOutputs["chart"]["getStockChartData"];

export default function BpStockChart() {
  const initialVisibility = Object.keys(chartConfig).reduce(
    (acc, val) => {
      acc[val as ChartTypes] = true;
      return acc;
    },
    {} as { [Key in keyof typeof chartConfig]: boolean },
  );
  const [visibility, setVisibility] = useState(initialVisibility);
  const [timeframe, setTimeframe] = useState<Timeframes>("W");

  const toDate = endOfDay(new Date());
  const fromLastWeek = startOfDay(subDays(toDate, 7));
  const fromLastMonth = startOfDay(subDays(toDate, 30));
  const fromLastYear = startOfDay(subDays(toDate, 365));
  const fromStartOfYear = startOfYear(toDate);
  const fromAll = new Date(0);

  const week = api.chart.getStockChartData.useQuery({
    fromDate: fromLastWeek,
    toDate,
  });
  const month = api.chart.getStockChartData.useQuery({
    fromDate: fromLastMonth,
    toDate,
  });
  const year = api.chart.getStockChartData.useQuery({
    fromDate: fromLastYear,
    toDate,
  });
  const ytd = api.chart.getStockChartData.useQuery({
    fromDate: fromStartOfYear,
    toDate,
  });
  const all = api.chart.getStockChartData.useQuery({
    fromDate: fromAll,
    toDate,
  });

  const allChartData = new Map<Timeframes, DiaryData | undefined>();
  allChartData.set("W", week.data);
  allChartData.set("M", month.data);
  allChartData.set("YTD", ytd.data);
  allChartData.set("Y", year.data);
  allChartData.set("All", all.data);

  const chartData = allChartData.get(timeframe)?.map((entry) => ({
    date: entry.measuredAtDate,
    systolic: Math.ceil(entry.avgSystolic),
    diastolic: Math.ceil(entry.avgDiastolic),
    pulse: Math.ceil(entry.avgPulse),
  }));

  return (
    <Card className="flex h-full w-full flex-col border-none shadow-none">
      <CardHeader className="flex flex-row items-stretch space-y-0 p-0">
        <div className="bg-muted mr-auto flex items-center gap-1 rounded-lg px-2 py-2 sm:py-2">
          <CardTitle>Blood Pressure</CardTitle>
        </div>
        <Popover>
          <PopoverTrigger className="desktop:hidden flex w-[3rem] items-center justify-center rounded-lg border">
            <ChevronDown />
          </PopoverTrigger>
          <PopoverContent className="flex p-2" align="end">
            {TIMEFRAMES.map((chart) => {
              return (
                <Button
                  key={chart}
                  data-active={timeframe === chart}
                  className="hover:bg-muted data-[active=true]:bg-muted flex h-12 w-12 flex-1 flex-col justify-center gap-1 rounded-lg bg-transparent text-center"
                  onClick={() => setTimeframe(chart)}
                >
                  <span className="text-muted-foreground text-xs">{chart}</span>
                </Button>
              );
            })}
          </PopoverContent>
        </Popover>
        <div className="mobile:hidden desktop:flex">
          {TIMEFRAMES.map((chart) => {
            return (
              <Button
                key={chart}
                data-active={timeframe === chart}
                className="hover:bg-muted data-[active=true]:bg-muted flex h-12 w-12 flex-1 flex-col justify-center gap-1 rounded-lg bg-transparent text-center"
                onClick={() => setTimeframe(chart)}
              >
                <span className="text-muted-foreground text-xs">{chart}</span>
              </Button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="flex-1 px-0 py-6">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: -16,
              right: 12,
              top: 12,
            }}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <defs>
              <linearGradient
                id="fillSystolicStockChart"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="var(--color-systolic)"
                  stopOpacity={0.4}
                />
                <stop
                  offset="30%"
                  stopColor="var(--color-systolic)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <defs>
              <linearGradient
                id="fillDiastolicStockChart"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="var(--color-diastolic)"
                  stopOpacity={0.4}
                />
                <stop
                  offset="30%"
                  stopColor="var(--color-diastolic)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <defs>
              <linearGradient
                id="fillPulseStockChart"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="var(--color-pulse)"
                  stopOpacity={0.4}
                />
                <stop
                  offset="30%"
                  stopColor="var(--color-pulse)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: "1rem" }}
              tickMargin={16}
              tickFormatter={(value: Date) =>
                `${value.getDate()} ${DateMonthShortFormat.format(value)}`
              }
              interval="equidistantPreserveStart"
              // angle={-45}
              height={45}
            />
            <YAxis
              tick={{ fontSize: "1rem" }}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <Area
              dataKey={visibility.systolic ? "systolic" : ""}
              type="natural"
              fill="url(#fillSystolicStockChart)"
              fillOpacity={0.4}
              stroke="var(--color-systolic)"
              strokeWidth="0.125rem"
              dot={false}
              key={`systolic-${visibility.systolic}-${timeframe}`}
            />
            <Area
              dataKey={visibility.diastolic ? "diastolic" : ""}
              type="natural"
              fill="url(#fillDiastolicStockChart)"
              fillOpacity={0.4}
              stroke="var(--color-diastolic)"
              strokeWidth="0.125rem"
              dot={false}
              key={`diastolic-${visibility.diastolic}-${timeframe}`}
            />
            <Area
              dataKey={visibility.pulse ? "pulse" : ""}
              type="natural"
              fill="url(#fillPulseStockChart)"
              fillOpacity={0.4}
              stroke="var(--color-pulse)"
              strokeWidth="0.125rem"
              dot={false}
              key={`pulse-${visibility.pulse}-${timeframe}`}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 p-0 text-sm">
        <div className="flex gap-2">
          {Object.keys(chartConfig).map((key) => {
            const keyTyped = key as ChartTypes;
            return (
              <div key={key} className="flex items-center gap-2">
                <Switch
                  id={key.toLocaleLowerCase()}
                  className={cn(
                    key === "systolic"
                      ? "data-[state=checked]:bg-[hsl(var(--chart-bp))]"
                      : "",
                    key === "diastolic"
                      ? "data-[state=checked]:bg-[hsl(var(--chart-m))]"
                      : "",
                    key === "pulse"
                      ? "data-[state=checked]:bg-[hsl(var(--chart-hr))]"
                      : "",
                  )}
                  checked={visibility[keyTyped]}
                  onCheckedChange={() =>
                    setVisibility({
                      ...visibility,
                      [key]: !visibility[keyTyped],
                    })
                  }
                />
                <Label>{chartConfig[keyTyped].label}</Label>
              </div>
            );
          })}
        </div>
      </CardFooter>
    </Card>
  );
}
