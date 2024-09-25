"use client";

import * as React from "react";
import { add, format } from "date-fns";

import { TimePicker } from "./timePicker";
import { DatePicker } from "./datePicker";

export function DateTimePicker({ defaultDate }: { defaultDate?: Date }) {
  return (
    <DatePicker defaultDate={defaultDate}>
      <div className="border-t border-border p-3">
        <TimePicker />
      </div>
    </DatePicker>
  );
}
