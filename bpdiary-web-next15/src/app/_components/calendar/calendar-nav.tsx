import { NavProps } from "react-day-picker";
import { Button } from "../shadcn/button";
import { Calendar1, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { useBpCalendarContext } from "~/app/_contexts/bpCaldendarContext";
import { cn } from "~/lib/utils";

export default function CalendarNav(props: NavProps) {
  const calendarContext = useBpCalendarContext();
  const resetToToday = () => {
    const today = new Date();
    calendarContext.setSelectedDate(today);
    calendarContext.setSelectedMonth(today);
  }
  return (
    <div className={cn("flex w-full items-center justify-between p-2", props.className)}>
      <div className="px-4 h-[2.5rem] flex gap-2 items-center rounded-md bg-accent">
        <span className="text-2xl font-semibold leading-none tracking-tight">
          {format(calendarContext.selectedMonth, "LLLL")}
        </span>
        <span className="text-2xl">
          {format(calendarContext.selectedMonth, "y")}
        </span>
      </div>
      <div className="flex gap-2">
        <Button onClick={props.onPreviousClick}>
          <ChevronLeft width="1.5em" height="1.5em" />
        </Button>

        <Button onClick={resetToToday}>
          <Calendar1 width="1.5em" height="1.5em" /> Today
        </Button>

        <Button onClick={props.onNextClick}>
          <ChevronRight width="1.5em" height="1.5em" />
        </Button>
      </div>
    </div>
  );
}
