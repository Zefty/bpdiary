import { BpCalendar } from "./bpCalendar";
import DailyBpHistory from "./dailyBpHistory";
import BpCalendarHeader from "./bpCalendarHeader";

export default async function BpCalendarView() {
  return (
    <div className="flex h-full w-full flex-col">
      <div className="p-2">
        <BpCalendarHeader />
      </div>
      <div className="flex h-full w-full items-center gap-2 px-2 pb-2">
        <div className="h-full flex-1">
          <BpCalendar />
        </div>

        <div className="relative hidden h-full flex-1 md:flex">
          <div className="absolute bottom-0 left-0 right-0 top-0 rounded-md border">
            <DailyBpHistory />
          </div>
        </div>
      </div>
    </div>
  );
}
