import { type NavProps } from "react-day-picker";
import { Button, buttonVariants } from "../shadcn/button";
import { Calendar1, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { useBpCalendarContext } from "~/app/_contexts/bpCaldendarContext";
import { cn } from "~/lib/utils";
import BaseHeader from "../header/base-header";
import LogBpFormTrigger from "../log-bp/log-bp-form-trigger";
import CalendarExport from "./calendar-export";
import CalendarShare from "./calendar-share";
import { SidebarTrigger } from "../shadcn/sidebar";
import { LogBpFormProvider } from "~/app/_contexts/bpEntryContext";

export default function CalendarNav(props: NavProps) {
  const calendarContext = useBpCalendarContext();
  const resetToToday = () => {
    const today = new Date();
    calendarContext.setSelectedDate(today);
    calendarContext.setSelectedMonth(today);
  };
  return (
    <div className="flex flex-col items-center">
      <BaseHeader className="flex justify-between">
        <LogBpFormProvider>
          <SidebarTrigger
            className={cn(
              "laptop:hidden flex",
              buttonVariants({ size: "circular", variant: "muted" }),
            )}
          />
          <LogBpFormTrigger variant="muted" size="circular" />
          <CalendarShare variant="muted" size="circular" />
          <CalendarExport variant="muted" size="circular" />
          <div className="ml-auto flex gap-2">
            <Button
              onClick={props.onPreviousClick}
              variant="muted"
              size="circular"
            >
              <ChevronLeft width="1.5em" height="1.5em" />
            </Button>
            <Button
              onClick={resetToToday}
              variant="muted"
              className="h-12 rounded-full"
            >
              <Calendar1 width="1.5em" height="1.5em" />
              <span className="laptop:block hidden">Today</span>
            </Button>
            <Button onClick={props.onNextClick} variant="muted" size="circular">
              <ChevronRight width="1.5em" height="1.5em" />
            </Button>
          </div>
        </LogBpFormProvider>
      </BaseHeader>
      <div
        className={cn(
          "flex h-[4.35rem] w-full items-center justify-center border-t-[0.15rem]",
          props.className,
        )}
      >
        <div className="bg-muted flex items-center gap-2 rounded-full px-4 py-2">
          <span className="text-3xl leading-none font-semibold tracking-tight">
            {format(calendarContext.selectedMonth, "LLLL")}
          </span>
          <span className="text-3xl">
            {format(calendarContext.selectedMonth, "y")}
          </span>
        </div>
      </div>
    </div>
  );
}
