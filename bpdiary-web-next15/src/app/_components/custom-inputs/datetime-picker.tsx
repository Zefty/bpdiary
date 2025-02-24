"use client";

import { TimePicker } from "./time-picker";
import { DatePicker, DatePickerRefs } from "./date-picker";
import { forwardRef, useRef } from "react";
import { Input } from "../shadcn/input";

export interface DatetimePickerRefs extends DatePickerRefs {}

export interface DatetimePickerProps {
  name?: string;
  selectedDate: Date;
  onDateChange: (date: Date | undefined) => void;
}

export const DatetimePicker = forwardRef<DatePickerRefs, DatetimePickerProps>(
  ({ name, selectedDate, onDateChange }, ref) => {
    return (
      <DatePicker
        name={name}
        selectedDate={selectedDate}
        onDateChange={onDateChange}
        ref={ref}
      >
        <div className="border-border border-t p-3">
          <TimePicker selectedDate={selectedDate} onDateChange={onDateChange} />
        </div>
      </DatePicker>
    );
  },
);
