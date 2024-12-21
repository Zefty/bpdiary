"use client"

import { ChevronLeft, ChevronRight, TrendingUp } from "lucide-react"
import {
  Label,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/app/_components/shadcn/card"
import { ChartConfig, ChartContainer } from "~/app/_components/shadcn/chart"
import { DateMonthLongFormat } from "~/lib/utils"
import { api } from "~/trpc/react"
import { Button } from "../shadcn/button"

export const description = "A radial chart with text"

const chartConfig = {
  measurements: {
    label: "Measurements",
  },
  monthly: {
    label: "CurrentMonth",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export default function RingChart() {
  const data = api.bloodPressure.getIsBpRecordedMonthly.useQuery();

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const maxDays = new Date(currentDate.getFullYear(), currentMonth + 1, 0).getDate();

  const chartData = [{ month: currentMonth, measurements: data?.data?.length ?? 0 }]
  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row pb-0 gap-2 items-center">
        <Button>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="flex flex-col items-center">
          <CardTitle>Total Measurements</CardTitle>
          <CardDescription>{DateMonthLongFormat.format(currentDate)}</CardDescription>
        </div>
        <Button>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={90}
            endAngle={-270}
            innerRadius={80}
            outerRadius={110}
          >
            <PolarAngleAxis
              type="number"
              domain={[0, maxDays]}
              angleAxisId={0}
              tick={false}
            />
            <RadialBar dataKey="measurements" background cornerRadius={10} />
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
                          className="fill-foreground text-4xl font-bold"
                        >
                          {chartData[0]?.measurements}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy ?? 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Measurements
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        {/* <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div> */}
        <div className="leading-none text-muted-foreground">
          Showing total blood pressure measurements for the current month
        </div>
      </CardFooter>
    </Card>
  )
}
