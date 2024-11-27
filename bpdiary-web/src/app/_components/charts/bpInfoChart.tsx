"use client"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "~/app/_components/shadcn/card"
import { DateMonthLongFormat } from "~/lib/utils"
import { api } from "~/trpc/react"

export function BpInfoChart() {
    const data = api.bloodPressure.getAverageMeasurements.useQuery();
    const viewData = data.data?.[0];
    const currentDate = new Date();
    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>Average Blood Pressure</CardTitle>
                <CardDescription>{DateMonthLongFormat.format(currentDate)}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col items-center py-6">
                <span>Avg. Systolic: {Math.round(Number(viewData?.avgSystolic))} mmHg</span>
                <span>Avg. Diastolic: {Math.round(Number(viewData?.avgDiastolic))} mmHg</span>
                <span>Avg. Pulse: {Math.round(Number(viewData?.avgPulse))} bpm</span>
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
