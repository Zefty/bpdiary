import { cn } from "~/lib/utils";
import BpChart from "./bp-chart";
import HeartRateChart from "./heart-rate-chart";
import MeasurementsChart from "./measurements-charts";
import { ScrollArea, ScrollBar } from "../shadcn/scroll-area";

export default function HomeMetrics({ className }: { className?: string }) {
  return (
    <ScrollArea className="laptop:w-full h-full">
      <div className={className}>
        <BpChart />
        <HeartRateChart />
        <MeasurementsChart />
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
