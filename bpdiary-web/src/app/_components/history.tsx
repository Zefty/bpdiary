"use client";
import { CalendarHistory } from "./calendarHistory";
import DailyDiaryHistory from "./dailyDiaryHistory";
import { useScreenOrientation } from "./screenOrientation";

export default function BpHistory() {
  const screen = useScreenOrientation();
  return (
    <div className="flex h-full w-full items-center">
      <div className="h-full flex-1">
        <CalendarHistory />
      </div>

      {(screen === "landscape-primary" || screen === "landscape-secondary") && (
        <div className="relative h-full flex-1">
          <div className="absolute bottom-0 left-0 right-0 top-0">
            <DailyDiaryHistory />
          </div>
        </div>
      )}
    </div>
  );
}
