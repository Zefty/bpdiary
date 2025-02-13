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
  PolarGrid,
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
import { ChartBar, LineChart } from "lucide-react";
import { api } from "~/trpc/react";
import { DateMonthLongFormat } from "~/lib/utils";

const chartConfig = {
  systolic: {
    label: "Systolic",
    color: "hsl(var(--chart-m))",
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
    <Card className="flex h-full w-full flex-col border-none bg-muted/50 shadow-none">
      <CardHeader className="items-start p-4 pb-0">
        <div className="flex items-center gap-3">
          <div className="flex aspect-square size-10 items-center justify-center rounded-md bg-blue-100 text-sidebar-primary-foreground">
            <LineChart className="h-[1.5rem] w-[1.5rem] text-blue-500" />
          </div>
          <CardTitle className="text-lg">Measurements</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex h-full w-full p-4">
        <div className="flex flex-col">
          <span className="text-md font-semibold">
            {DateMonthLongFormat.format(currentDate)}
          </span>
          <span className="text-sm text-muted-foreground">This Month</span>
        </div>
        <div className="flex-1">
          <ChartContainer config={chartConfig} className="h-[99%] w-full">
            <RadialBarChart
              data={chartData}
              startAngle={90}
              endAngle={-270}
              innerRadius={40}
              outerRadius={60}
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
                tickLine={false}
                axisLine={false}
              />
              <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="text-2xl font-bold"
                          >
                            {chartData[0]?.measurements ?? 0}
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </PolarRadiusAxis>
              <RadialBar
                dataKey="measurements"
                background={{
                  className: "!fill-blue-100",
                }}
                className="fill-blue-500"
                cornerRadius={10}
              />
            </RadialBarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
