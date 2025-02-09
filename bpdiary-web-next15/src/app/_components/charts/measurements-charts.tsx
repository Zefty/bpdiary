"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/app/_components/shadcn/card";
import {
  Area,
  AreaChart,
  Label,
  PolarAngleAxis,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/app/_components/shadcn/chart";
import { ChartBar } from "lucide-react";
import { api } from "~/trpc/react";
import { DateMonthLongFormat } from "~/lib/utils";

const chartConfig = {
  systolic: {
    label: "Systolic",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export default function MeasurementsChart() {
  const data = api.chart.getDatesWithBpMeasurementsByMonth.useQuery();

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const maxDays = new Date(
    currentDate.getFullYear(),
    currentMonth + 1,
    0,
  ).getDate();

  const chartData = [
    { month: currentMonth, measurements: data?.data?.length ?? 0 },
  ];
  return (
    <Card className="flex h-full w-full flex-col">
      <CardHeader className="items-start p-4 pb-0">
        <div className="flex items-center gap-2">
          <div className="flex aspect-square size-10 items-center justify-center rounded-md bg-primary text-sidebar-primary-foreground">
            <ChartBar width="1.5em" height="1.5em" />
          </div>
          <CardTitle className="text-md">Total Measurements</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex h-full w-full p-4">
        <div className="flex flex-col justify-between">
          <span className="text-md font-semibold">
            {DateMonthLongFormat.format(currentDate)}
          </span>
          <div>
            <span className="text-md font-semibold">
              {chartData[0]?.measurements}&nbsp;
            </span>
            <span className="text-sm text-muted-foreground">Measurements</span>
          </div>
        </div>
        <div className="flex-1">
          <ChartContainer config={chartConfig} className="h-[99%] w-full">
            <RadialBarChart
              data={chartData}
              startAngle={90}
              endAngle={-270}
              innerRadius={35}
              outerRadius={45}
              margin={{
                left: 0,
                right: 0,
              }}
            >
              <PolarAngleAxis
                type="number"
                domain={[0, maxDays]}
                angleAxisId={0}
                tick={false}
              />
              <RadialBar dataKey="measurements" background cornerRadius={0} />
            </RadialBarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
