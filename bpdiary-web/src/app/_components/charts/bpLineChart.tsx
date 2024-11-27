"use client";

import { TrendingUp } from "lucide-react";
import { CartesianGrid, Legend, Line, LineChart, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
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
import { DateMonthShortFormat } from "~/lib/utils";
import { api, RouterOutputs } from "~/trpc/react";
import { Switch } from "../shadcn/switch";
import { Label } from "../shadcn/label";
import { useState } from "react";

export const description = "A linear line chart";

const chartConfig = {
  systolic: {
    label: "Systolic",
    color: "hsl(var(--chart-3))",
  },
  diastolic: {
    label: "Diastolic",
    color: "hsl(var(--chart-2))",
  },
  pulse: {
    label: "Pulse",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

const TIMEFRAMES = ["W", "M", "YTD", "Y", "All"] as const;
type Timeframes = typeof TIMEFRAMES[number];

type DiaryData = RouterOutputs["bloodPressure"]["getPastSevenDaysDiary"];

export default function BpLineChart() {
  const [systolicVisible, setSystolicVisible] = useState(true);
  const [diastolicVisible, setDiastolicVisible] = useState(true);
  const [pulseVisible, setPulseVisible] = useState(true);
  const [timeframe, setTimeframe] = useState<Timeframes>("W");

  const dataPastSevenDays = api.bloodPressure.getPastSevenDaysDiary.useQuery();
  const dataPastMonth = api.bloodPressure.getPastMonthDiary.useQuery();
  const dataThisYear = api.bloodPressure.getThisYearDiary.useQuery();
  const dataPastYear = api.bloodPressure.getPastYearDiary.useQuery();
  const dataAll = api.bloodPressure.getWholeDiary.useQuery();

  const allChartData = new Map<Timeframes, DiaryData | undefined>();
  allChartData.set("W", dataPastSevenDays.data);
  allChartData.set("M", dataPastMonth.data);
  allChartData.set("YTD", dataThisYear.data);
  allChartData.set("Y", dataPastYear.data);
  allChartData.set("All", dataAll.data);

  const chartData = allChartData.get(timeframe)?.map((entry) => ({
    date: entry.createdAtDate,
    systolic: Math.ceil(entry.avgSystolic),
    diastolic: Math.ceil(entry.avgDiastolic),
    pulse: Math.ceil(entry.avgPulse),
  }));

  return (
    <Card className="w-full h-full">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Blood Pressure 7 Day History</CardTitle>
          <CardDescription>Past 7 Days (Average per day)</CardDescription>
        </div>
        <div className="flex">
          {TIMEFRAMES.map((chart) => {
            return (
              <button
                key={chart}
                data-active={timeframe === chart}
                className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-6 sm:py-6"
                onClick={() => setTimeframe(chart)}
              >
                <span className="text-xs text-muted-foreground">
                  {chart}
                </span>
              </button>
            )
          })}
        </div>
      </CardHeader>
      <CardContent className="p-5">
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: -20,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={true}
              axisLine={true}
              tickMargin={8}
              tickFormatter={(value: Date) => `${value.getDate()} ${DateMonthShortFormat.format(value)}`}
              interval="equidistantPreserveStart"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent />}
              defaultIndex={1}
            />
            {systolicVisible && <Line
              dataKey="systolic"
              type="natural"
              stroke="var(--color-systolic)"
              strokeWidth={2}
              dot={false}
            />}
            {diastolicVisible && <Line
              dataKey="diastolic"
              type="natural"
              stroke="var(--color-diastolic)"
              strokeWidth={2}
              dot={false}
            />}
            {pulseVisible && <Line
              dataKey="pulse"
              type="natural"
              stroke="var(--color-pulse)"
              strokeWidth={2}
              dot={false}
            />}
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex space-x-2">
          <div className="flex items-center space-x-2">
            <Switch id="systolic" className={`data-[state=checked]:bg-[${chartConfig.systolic.color}]`} checked={systolicVisible} onCheckedChange={() => setSystolicVisible(!systolicVisible)} />
            <Label htmlFor="airplane-mode">{chartConfig.systolic.label}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="diastolic" className={`data-[state=checked]:bg-[${chartConfig.diastolic.color}]`} checked={diastolicVisible} onCheckedChange={() => setDiastolicVisible(!diastolicVisible)} />
            <Label htmlFor="airplane-mode">{chartConfig.diastolic.label}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="pulse" className={`data-[state=checked]:bg-[${chartConfig.pulse.color}]`} checked={pulseVisible} onCheckedChange={() => setPulseVisible(!pulseVisible)} />
            <Label htmlFor="airplane-mode">{chartConfig.pulse.label}</Label>
          </div>
        </div>
        {/* <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div> */}
      </CardFooter>
    </Card>
  );
}
