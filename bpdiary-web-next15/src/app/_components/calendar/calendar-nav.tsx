import { type NavProps } from "react-day-picker";
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
  };
  return (
    <div
      className={cn(
        "flex w-full items-center justify-between",
        props.className,
      )}
    >
      <div className="flex h-[2.5rem] items-center gap-2 rounded-md bg-muted px-4">
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
