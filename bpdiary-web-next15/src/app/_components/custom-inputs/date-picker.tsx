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
import { createContext, forwardRef, useImperativeHandle } from "react";
import CalendarDropdown from "../calendar/calendar-dropdown";
import { UI } from "react-day-picker";

export interface DatePickerRefs {
  value: Date | undefined;
  reset: () => void;
}

export interface DatePickerProps {
  children?: React.ReactNode;
  name?: string;
  showSeconds?: boolean;
  selectedDate: Date;
  onDateChange: (date: Date | undefined) => void;
}

export interface DateContext {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  showSeconds?: boolean;
}
export const DateContext = createContext<DateContext | undefined>(undefined);

export const DatePicker = forwardRef<DatePickerRefs, DatePickerProps>(
  ({ children, name, showSeconds, selectedDate, onDateChange }, ref) => {
    useImperativeHandle(
      ref,
      () => ({
        value: selectedDate,
        reset: () => onDateChange?.(new Date()),
      }),
      [onDateChange, selectedDate],
    );

    /**
     * carry over the current time when a user clicks a new day
     * instead of resetting to 00:00
     */
    const handleSelect = (newDate: Date | undefined) => {
      if (!newDate) return;
      if (!selectedDate) {
        onDateChange(newDate);
        return;
      }
      const diff = newDate.getTime() - selectedDate.getTime();
      const diffInDays = diff / (1000 * 60 * 60 * 24);
      const newDateFull = add(selectedDate, { days: Math.ceil(diffInDays) });
      onDateChange(newDateFull);
    };

    return (
      <Popover data-name={name}>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-[17.25rem] justify-start text-left font-normal",
              !selectedDate && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedDate ? (
              format(selectedDate, showSeconds ? "PPP HH:mm:ss" : "PPP HH:mm")
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={selectedDate}
            month={selectedDate}
            onMonthChange={(d) => handleSelect(d)}
            onSelect={(d) => handleSelect(d)}
            autoFocus
            captionLayout="dropdown"
            classNames={{
              [UI.CaptionLabel]: "hidden",
              [UI.Dropdowns]: "flex w-full px-10 justify-center gap-4",
            }}
            components={{
              Dropdown: CalendarDropdown,
            }}
          />
          {children}
        </PopoverContent>
      </Popover>
    );
  },
);
DatePicker.displayName = "DatePicker";
