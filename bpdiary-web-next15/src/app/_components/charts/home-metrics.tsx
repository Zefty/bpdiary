import BpChart from "./bp-chart";
import HeartRateChart from "./heart-rate-chart";
import MeasurementsChart from "./measurements-charts";
import { ScrollArea, ScrollBar } from "../shadcn/scroll-area";

export default async function HomeMetrics() {
  return (
    <ScrollArea className="h-full w-1 flex-1">
      <div className="flex h-full gap-6 pb-3">
        <BpChart />
        <HeartRateChart />
        <MeasurementsChart />
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
