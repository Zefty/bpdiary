"use client";
import { BpCalendar } from "./bpCalendar";
import DailyBpHistory from "./dailyBpHistory";
import BpCalendarHeader from "./bpCalendarHeader";
import { useScreenOrientation } from "../../_hooks/screenOrientation";

export default function BpCalendarView() {
  const screen = useScreenOrientation();
  return (
    <div className="flex flex-col h-full w-full">
      <div className="p-3">
        <BpCalendarHeader />
      </div>
      <div className="flex h-full w-full items-center px-3 pb-3 gap-3">
        <div className="h-full flex-1">
          <BpCalendar />
        </div>

        {(screen === "landscape-primary" ||
          screen === "landscape-secondary") && (
          <div className="relative h-full flex-1">
            <div className="rounded-md border absolute bottom-0 left-0 right-0 top-0">
              <DailyBpHistory />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
