"use client"

import { ChevronLeft, ChevronRight, TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, LabelList, Legend, XAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "~/app/_components/shadcn/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "~/app/_components/shadcn/chart"
import { api } from "~/trpc/react"

export const description = "A multiple bar chart"

const chartConfig = {
    systolic: {
        label: "Systolic",
        color: "hsl(var(--chart-1))",
    },
    diastolic: {
        label: "Diastolic",
        color: "hsl(var(--chart-2))",
    },
    pulse: {
        label: "Pulse",
        color: "hsl(var(--chart-3))",
    },
} satisfies ChartConfig;

function dayOfWeekAsString(dayIndex: number) {
    return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][dayIndex] || '';
}

export default function BpByDOW() {
    const data = api.bloodPressure.getAverageBpPerDayOfWeek.useQuery();
    const chartData = data?.data?.map((entry) => ({
        dayOfWeek: entry.dayOfWeek,
        systolic: Math.ceil(entry.avgSystolic),
        diastolic: Math.ceil(entry.avgDiastolic),
        pulse: Math.ceil(entry.avgPulse),
    }));
    return (
        <Card className="w-[500px]">
            <CardHeader>
                <ChevronLeft className="h-4 w-4" />
                <CardTitle>Blood Pressure by Day of Week</CardTitle>
                <CardDescription>Average blood pressure over the days of the week</CardDescription>
                <ChevronRight className="h-4 w-4" />
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart accessibilityLayer data={chartData}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="dayOfWeek"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={dayOfWeekAsString}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent />}
                        />
                        <Bar dataKey="systolic" fill="var(--color-systolic)" radius={4} >
                            <LabelList
                                position="top"
                                offset={12}
                                className="fill-foreground"
                                fontSize={12}
                            />
                        </Bar>
                        <Bar dataKey="diastolic" fill="var(--color-diastolic)" radius={4} >
                            <LabelList
                                position="top"
                                offset={12}
                                className="fill-foreground"
                                fontSize={12}
                            />
                        </Bar>
                        <Legend verticalAlign="top" height={36} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                {/* <div className="flex gap-2 font-medium leading-none">
                    Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
                </div>
                <div className="leading-none text-muted-foreground">
                    Showing total visitors for the last 6 months
                </div> */}
            </CardFooter>
        </Card>
    )
}
