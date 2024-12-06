"use client";

import { TimePicker } from "./timePicker";
import { DatePicker, DatePickerRefs } from "./datePicker";
import { forwardRef, useRef } from "react";

export interface DateTimePickerRefs extends DatePickerRefs {}

export interface DateTimePickerProps {
  name?: string;
  defaultDate?: Date;
}

export const DateTimePicker = forwardRef<DatePickerRefs, DateTimePickerProps>(
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
