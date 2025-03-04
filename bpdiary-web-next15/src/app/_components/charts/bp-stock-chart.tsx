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
import { endOfDay, interval, startOfDay, startOfYear, subDays } from "date-fns";
import { Button, buttonVariants } from "../shadcn/button";
import { Popover, PopoverContent, PopoverTrigger } from "../shadcn/popover";
import { CalendarHeart, ChevronDown } from "lucide-react";
import { scaleTime, scaleUtc } from "d3-scale";
import { Timeframes, TIMEFRAMES } from "~/lib/types";

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

  
  const allChartData = (api.chart.getStockChartData.useQuery()).data;


  const chartData = allChartData?.get(timeframe)?.map((entry) => ({
    date: entry.measuredAtDate.valueOf(),
    systolic: Math.ceil(entry.avgSystolic),
    diastolic: Math.ceil(entry.avgDiastolic),
    pulse: Math.ceil(entry.avgPulse),
  }));

  const numOfTicks = ["W", "M"].includes(timeframe) ? 5 : 10;


  const xAxisFormatter = (value: number | Date) => {
    const date = new Date(value);
    return `${date.getDate()} ${DateMonthShortFormat.format(date)}`;
  };

  const numericValues = chartData?.map((d) => d.date) ?? [];
  const timeScale = scaleUtc().domain([
    Math.min(...numericValues),
    Math.max(...numericValues),
  ]);
  const xAxisArgs = {
    domain: timeScale.domain().map((date) => date.valueOf()),
    ticks: timeScale.ticks(numOfTicks),
    scale: timeScale,
    type: "number" as const,
  };

  return (
    <Card className="bg-muted flex h-full w-full flex-col rounded-3xl border-none p-4 shadow-none">
      <CardHeader className="flex flex-row items-stretch space-y-0 p-0">
        <div className="mr-auto flex items-center gap-1 rounded-lg py-2 sm:py-2">
          <CardTitle>Blood Pressure</CardTitle>
        </div>
        <Popover>
          <PopoverTrigger
            className={cn(
              "desktop:hidden bg-background flex size-10 items-center justify-center rounded-full border",
            )}
          >
            <ChevronDown className="size-4" />
          </PopoverTrigger>
          <PopoverContent className="w-full rounded-full p-2" align="end">
            {TIMEFRAMES.map((chart) => {
              return (
                <Button
                  key={chart}
                  data-active={timeframe === chart}
                  className="hover:bg-muted data-[active=true]:bg-muted size-10 flex-col justify-center rounded-full bg-transparent text-center"
                  onClick={() => setTimeframe(chart)}
                >
                  <span className="text-muted-foreground text-xs">{chart}</span>
                </Button>
              );
            })}
          </PopoverContent>
        </Popover>
        <div className="mobile:hidden desktop:flex bg-background gap-2 rounded-full p-2">
          {TIMEFRAMES.map((chart) => {
            return (
              <Button
                key={chart}
                data-active={timeframe === chart}
                className="hover:bg-muted data-[active=true]:bg-muted flex size-10 flex-col justify-center rounded-full bg-transparent text-center"
                onClick={() => setTimeframe(chart)}
              >
                <span className="text-muted-foreground text-xs">{chart}</span>
              </Button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="flex-1 px-0 py-6">
        {chartData?.length === 0 &&
          (
            <div className="flex flex-col items-center justify-center w-full h-full text-muted-foreground gap-2">
              <CalendarHeart className="size-8 stroke-[1.5]" />
              <span className="line-clamp-1">
                No data...
              </span>
            </div>
          )
        }
        {(chartData && chartData?.length > 0) && (
          <ChartContainer config={chartConfig} className="h-full w-full">
            <AreaChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: -12,
                right: 12,
                top: 12,
              }}
            >
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" labelIsDate />}
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
                tickLine={true}
                axisLine={true}
                tick={{ fontSize: "0.8rem" }}
                tickMargin={16}
                tickFormatter={xAxisFormatter}
                // scale="time"
                // type="number"
                // domain={["auto", "auto"]}
                // domain={[chartData?.[0]?.date ?? 0, "dataMax"]}
                height={35}
                // interval="equidistantPreserveStart"
                {...xAxisArgs}
              />
              <YAxis
                tick={{ fontSize: "0.8rem" }}
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
        )
        }
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
