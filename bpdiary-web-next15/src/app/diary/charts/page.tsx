import BarChart from "~/app/_components/charts/bp-by-dow";
import InfoChart from "~/app/_components/charts/info-chart";
import TimeframeLineChart from "~/app/_components/charts/bp-stock-chart";
import RingChart from "~/app/_components/charts/ring-chart";
import { api, HydrateClient } from "~/trpc/server";

export default async function ChartsPage() {
    await Promise.all([
        // api.bloodPressure.getPastSevenDaysDiary.prefetch(),
        api.bloodPressure.getAverageBpPerDayOfWeek.prefetch(),
        api.bloodPressure.getDatesWithBpMeasurementsByMonth.prefetch(),
        api.bloodPressure.getAverageMeasurements.prefetch(),
    ]);

    return (
        <HydrateClient>
            {/* <div className="flex-1 flex flex-col items-center">
                <div className="m-8 text-2xl font-semibold leading-none tracking-tight">Charts</div>
                <div className="w-full flex-1 flex flex-row flex-wrap px-20 gap-10">
                    <div className="flex-1 mb-20">
                        <TimeframeLineChart />
                    </div>
                    <BarChart />
                    <div className="flex-1 mb-20">
                        <div className="w-[400px] h-full flex flex-col justify-between">
                            <RingChart />
                            <InfoChart />
                            <Component/>
                        </div>
                    </div>
                </div>
            </div> */}
            <div></div>
        </HydrateClient>
    );
}
