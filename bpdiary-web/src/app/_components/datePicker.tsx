"use client";

import { add, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "~/lib/utils";
import { Button } from "~/app/_components/shadcn/button";
import { Calendar } from "~/app/_components/shadcn/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/app/_components/shadcn/popover";
import {
  useState,
  createContext,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Input } from "./shadcn/input";

export interface DatePickerRefs {
  value: Date | undefined;
  reset: () => void;
}

export interface DatePickerProps {
  children?: React.ReactNode;
  name?: string;
  defaultDate?: Date;
  showSeconds?: boolean;
}

export interface DateContext {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  showSeconds?: boolean;
}
export const DateContext = createContext<DateContext | undefined>(undefined);

export const DatePicker = forwardRef<DatePickerRefs, DatePickerProps>(
  ({ children, name, defaultDate, showSeconds }, ref) => {
    const [date, setDate] = useState<Date | undefined>(defaultDate);
    useImperativeHandle(
      ref,
      () => ({
        value: date,
        reset: () => setDate(new Date()),
      }),
      [],
    );

    /**
     * carry over the current time when a user clicks a new day
     * instead of resetting to 00:00
     */
    const handleSelect = (newDay: Date | undefined) => {
      if (!newDay) return;
      if (!date) {
        setDate(newDay);
        return;
      }
      const diff = newDay.getTime() - date.getTime();
      const diffInDays = diff / (1000 * 60 * 60 * 24);
      const newDateFull = add(date, { days: Math.ceil(diffInDays) });
      setDate(newDateFull);
    };

    return (
      <DateContext.Provider value={{ date, setDate, showSeconds }}>
        <Input
          value={date ? date.toISOString() : ""}
          readOnly
          type="hidden"
          name={name}
        />
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[280px] justify-start text-left font-normal",
                !date && "text-muted-foreground",
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? (
                format(date, showSeconds ? "PPP HH:mm:ss" : "PPP HH:mm")
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(d) => handleSelect(d)}
              initialFocus
            />
            {children}
          </PopoverContent>
        </Popover>
      </DateContext.Provider>
    );
  },
);
