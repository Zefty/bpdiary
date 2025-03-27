import { cn } from "~/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../shadcn/popover";
import { format } from "date-fns";
import { ScrollArea } from "../shadcn/scroll-area";
import { Button } from "../shadcn/button";
import { ChevronUpIcon } from "lucide-react";

interface MonthYearPickerProps {
  className?: string;
  selectedMonthYear: Date;
  setSelectedMonthYear: (year: number, month: number) => void;
}

const months = [
  "Janurary",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const currentYear = new Date().getFullYear();
const years = Array.from(
  { length: currentYear - 1924 },
  (_, i) => currentYear - i,
);

export default function MonthYearPicker(props: MonthYearPickerProps) {
  const selectedMonth = props.selectedMonthYear.getMonth();
  const selectedYear = props.selectedMonthYear.getFullYear();
  return (
    <Popover>
      <div
        className={cn(
          "flex h-[4.35rem] w-full items-center justify-center border-t-[0.15rem]",
          props.className,
        )}
      >
        <PopoverTrigger className="bg-muted flex items-center gap-2 rounded-full px-4 py-2">
          <span className="text-3xl leading-none font-semibold tracking-tight">
            {format(props.selectedMonthYear, "LLLL")}
          </span>
          <span className="text-3xl">
            {format(props.selectedMonthYear, "y")}
          </span>
        </PopoverTrigger>
        <PopoverContent className="grid grid-cols-2 grid-rows-1 gap-2 rounded-xl">
          <ScrollArea hideScrollbar>
            <div className="flex h-[12rem] flex-col gap-1">
              {months.map((month, index) => {
                return (
                  <Button
                    key={month}
                    className={cn(
                      "flex h-8 w-full items-center justify-center rounded-full",
                      index === selectedMonth ? "bg-muted" : "",
                    )}
                    onClick={() => {
                      props.setSelectedMonthYear(selectedYear, index);
                    }}
                    variant="ghost"
                  >
                    {month}
                  </Button>
                );
              })}
            </div>
          </ScrollArea>
          <ScrollArea hideScrollbar>
            <div className="flex h-[10rem] flex-col gap-1">
              {years.map((year) => {
                return (
                  <Button
                    key={year}
                    className={cn(
                      "flex h-8 w-full items-center justify-center rounded-full",
                      year === selectedYear ? "bg-muted" : "",
                    )}
                    onClick={() => {
                      props.setSelectedMonthYear(year, selectedMonth);
                    }}
                    variant="ghost"
                  >
                    {year}
                  </Button>
                );
              })}
            </div>
          </ScrollArea>
        </PopoverContent>
      </div>
    </Popover>
  );
}
