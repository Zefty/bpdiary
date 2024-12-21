"use client";

import { TimePicker } from "./time-picker";
import { DatePicker, DatePickerRefs } from "./date-picker";
import { forwardRef, useRef } from "react";

export interface DatetimePickerRefs extends DatePickerRefs {}

export interface DatetimePickerProps {
  name?: string;
  defaultDate?: Date;
}

export const DatetimePicker = forwardRef<DatePickerRefs, DatetimePickerProps>(
  ({ name, defaultDate }, ref) => {
    return (
      <DatePicker name={name} defaultDate={defaultDate} ref={ref}>
        <div className="border-t border-border p-3">
          <TimePicker />
        </div>
      </DatePicker>
    );
  },
);
