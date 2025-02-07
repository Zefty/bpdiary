"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "~/app/_components/shadcn/card";
import { Area, AreaChart } from "recharts"

import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "~/app/_components/shadcn/chart"
import { Gauge } from "lucide-react";
import { api } from "~/trpc/react";
import { endOfDay, startOfDay, subDays } from "date-fns";

const chartConfig = {
    systolic: {
        label: "Systolic",
        color: "hsl(var(--chart-1))",
    }
} satisfies ChartConfig


export default function BpChart() {
    const toDate = endOfDay(new Date());
    const fromLastWeek = startOfDay(subDays(toDate, 7));
    const dataPastSevenDays = api.chart.getStockChartData.useQuery({ fromDate: fromLastWeek, toDate });
    const chartData = dataPastSevenDays.data?.map((entry) => ({
        date: entry.measuredAtDate,
        systolic: Math.ceil(entry.avgSystolic),
        diastolic: Math.ceil(entry.avgDiastolic),
        pulse: Math.ceil(entry.avgPulse),
    }))
    return (
        <Card className="flex flex-col h-full w-full">
            <CardHeader className="items-start p-4 pb-0">
                <div className="flex items-center gap-2">
                    <div className="flex aspect-square size-10 items-center justify-center rounded-md bg-primary text-sidebar-primary-foreground">
                        <Gauge width="1.5em" height="1.5em"/>
                    </div>
                    <CardTitle className="text-md">Blood Pressure</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="flex flex-col h-full w-full p-4">
                <div className="pb-2">
                    {
                        chartData?.length ?
                            <>
                                <span className="font-bold">{chartData[chartData.length - 1]?.systolic} </span><span className="text-muted-foreground">/{chartData[chartData.length - 1]?.diastolic} mmHg</span>
                            </> :
                            <span className="line-clamp-1 text-muted-foreground">
                                no recent measurement...
                            </span>
                    }
                </div>
                <div className="flex-1">
                    <ChartContainer config={chartConfig} className="w-full h-[99%]">
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
                                <linearGradient id="fillSystolic" x1="0" y1="0" x2="0" y2="1">
                                    <stop
                                        offset="5%"
                                        stopColor="var(--color-systolic)"
                                        stopOpacity={0.8}
                                    />
                                    <stop
                                        offset="95%"
                                        stopColor="var(--color-systolic)"
                                        stopOpacity={0.1}
                                    />
                                </linearGradient>
                            </defs>
                            <Area
                                dataKey="systolic"
                                type="natural"
                                fill="url(#fillSystolic)"
                                fillOpacity={0.4}
                                stroke="var(--color-systolic)"
                                stackId="a"
                            />
                        </AreaChart>
                    </ChartContainer>
                </div>
            </CardContent>
        </Card>
    )
}