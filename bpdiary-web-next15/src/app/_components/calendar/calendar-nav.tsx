import { NavProps } from "react-day-picker";
import { Button } from "../shadcn/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { useBpCalendarContext } from "~/app/_contexts/bpCaldendarContext";

export default function CalendarNav(props: NavProps) {
  const calendarContext = useBpCalendarContext();
  return (
    <div className="flex w-full items-center justify-between">
      <Button onClick={props.onPreviousClick}>
        <ChevronLeft width="1.5em" height="1.5em" />
      </Button>
      <span className="text-2xl font-semibold leading-none tracking-tight">
        {format(calendarContext.selectedMonth, "LLLL y")}
      </span>
      
      <Button onClick={props.onNextClick}>
        <ChevronRight width="1.5em" height="1.5em" />
      </Button>
    </div>
  );
}
