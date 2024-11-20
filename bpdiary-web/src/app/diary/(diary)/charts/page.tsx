import BpLineChart from "~/app/_components/bpLineChart";

export default async function CHarts() {
  return (
    <div className="flex flex-col items-center">
      <div>Charts</div>
      <div className="flex flex-row gap-2">
        <BpLineChart />
        <BpLineChart />
      </div>
    </div>
  );
}
