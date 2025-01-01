"use client";

import { DateMonthLongFormat } from "~/lib/utils";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/app/_components/shadcn/card";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "~/app/_components/shadcn/chart"
import { HeartPulse } from "lucide-react";
import { api } from "~/trpc/react";

const chartConfig = {
    pulse: {
        label: "Pulse",
        color: "hsl(var(--chart-2))",
    }
} satisfies ChartConfig


export default function HeartRateChart() {
    const currentDate = new Date();
    const dataPastSevenDays = api.bloodPressure.getPastSevenDaysDiary.useQuery();
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
                        <HeartPulse />
                    </div>
                    <CardTitle className="text-md">Heart Rate</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="flex flex-col h-full w-full p-4">
                <div className="pb-2">
                    {
                        chartData?.length ?
                            <>
                                <span className="font-bold">{chartData[chartData.length - 1]?.pulse} </span><span className="text-muted-foreground">bpm</span>
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
                                <linearGradient id="fillPulse" x1="0" y1="0" x2="0" y2="1">
                                    <stop
                                        offset="5%"
                                        stopColor="var(--color-pulse)"
                                        stopOpacity={0.8}
                                    />
                                    <stop
                                        offset="95%"
                                        stopColor="var(--color-pulse)"
                                        stopOpacity={0.1}
                                    />
                                </linearGradient>
                            </defs>
                            <Area
                                dataKey="pulse"
                                type="natural"
                                fill="url(#fillPulse)"
                                fillOpacity={0.4}
                                stroke="var(--color-pulse)"
                                stackId="a"
                            />
                        </AreaChart>
                    </ChartContainer>
                </div>
            </CardContent>
        </Card>
    )
}