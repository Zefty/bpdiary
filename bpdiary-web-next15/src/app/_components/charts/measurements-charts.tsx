"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/app/_components/shadcn/card";
import {
  Label,
  PolarAngleAxis,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";

import {
  type ChartConfig,
  ChartContainer,
} from "~/app/_components/shadcn/chart";
import { LineChart } from "lucide-react";
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
    <Card className="bg-muted flex h-full w-full min-w-[14rem] flex-col rounded-3xl border-none shadow-none">
      <CardHeader className="items-start p-4 pb-0">
        <div className="flex items-center gap-3">
          <div className="text-sidebar-primary-foreground flex aspect-square size-10 items-center justify-center rounded-full bg-blue-100">
            <LineChart className="h-[1.5rem] w-[1.5rem] text-blue-500" />
          </div>
          <CardTitle className="text-lg">Measurements</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex h-full w-full p-4">
        <div className="mr-2 mb-2 flex flex-col justify-center">
          <span className="text-md font-semibold">
            {DateMonthLongFormat.format(currentDate)}
          </span>
          <span className="text-muted-foreground text-sm">This Month</span>
        </div>
        <div className="flex-1">
          <ChartContainer config={chartConfig} className="h-[99%] w-full">
            <RadialBarChart
              data={chartData}
              startAngle={90}
              endAngle={-270}
              innerRadius="90%"
              outerRadius="135%"
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
                            fill="var(--color-foreground)"
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
                  className: "fill-blue-100!",
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
