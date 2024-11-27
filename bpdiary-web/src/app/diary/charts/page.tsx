import BpBarChart from "~/app/_components/bpBarChart";
import { BpInfoChart } from "~/app/_components/bpInfoChart";
import BpLineChart from "~/app/_components/bpLineChart";
import { BpRingChart } from "~/app/_components/bpRingChart";
import { api, HydrateClient } from "~/trpc/server";

export default async function Charts() {
    await Promise.all([
        api.bloodPressure.getPastSevenDaysDiary.prefetch(),
        api.bloodPressure.getThisWeekDiary.prefetch(),
        api.bloodPressure.getThisMonthDiary.prefetch(),
        api.bloodPressure.getThisYearDiary.prefetch(),
        api.bloodPressure.getWholeDiary.prefetch(),
        api.bloodPressure.getAverageBpPerDayOfWeek.prefetch(),
        api.bloodPressure.getIsBpRecordedMonthly.prefetch(),
        api.bloodPressure.getAverageMeasurements.prefetch(),
    ]);

    return (
        <HydrateClient>
            <div className="flex-1 flex flex-col items-center">
                <div className="m-8 text-2xl font-semibold leading-none tracking-tight">Charts</div>
                <div className="w-full flex-1 flex flex-row flex-wrap px-20 gap-10">
                    <div className="flex-1 mb-20">
                        <BpLineChart />
                    </div>
                    {/* <BpBarChart /> */}
                    <div className="flex-1 mb-20">
                        <div className="w-[400px] h-full flex flex-col justify-between">
                            <BpRingChart />
                            <BpInfoChart />
                        </div>
                    </div>
                </div>
            </div>
        </HydrateClient>
    );
}
