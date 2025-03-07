"use client";

import { TimePicker } from "./time-picker";
import { DatePicker, type DatePickerRefs } from "./date-picker";
import { forwardRef } from "react";

export type DatetimePickerRefs = DatePickerRefs;

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
DatetimePicker.displayName = "DatetimePicker";
