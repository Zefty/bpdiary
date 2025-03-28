"use client";

import { Clock } from "lucide-react";
import { Label } from "~/app/_components/shadcn/label";
import { TimePickerInput, type TimePickerInputRefs } from "./time-picker-input";
import { useRef } from "react";

interface TimePickerProps {
  showSeconds?: boolean;
  selectedDate: Date;
  onDateChange: (date: Date | undefined) => void;
}

export function TimePicker({
  showSeconds,
  selectedDate,
  onDateChange,
}: TimePickerProps) {
  // const dateContext = useContext(DateContext);
  const minuteRef = useRef<TimePickerInputRefs>(null);
  const hourRef = useRef<TimePickerInputRefs>(null);
  const secondRef = useRef<TimePickerInputRefs>(null);

  return (
    <div className="flex items-end gap-2">
      <div className="grid gap-1 text-center">
        <Label htmlFor="hours" className="text-xs">
          Hours
        </Label>
        <TimePickerInput
          picker="hours"
          date={selectedDate}
          setDate={onDateChange}
          ref={hourRef}
          onRightFocus={() => minuteRef.current?.focus()}
        />
      </div>
      <div className="grid gap-1 text-center">
        <Label htmlFor="minutes" className="text-xs">
          Minutes
        </Label>
        <TimePickerInput
          picker="minutes"
          date={selectedDate}
          setDate={onDateChange}
          ref={minuteRef}
          onLeftFocus={() => hourRef.current?.focus()}
          onRightFocus={() => secondRef.current?.focus()}
        />
      </div>
      {showSeconds && (
        <div className="grid gap-1 text-center">
          <Label htmlFor="seconds" className="text-xs">
            Seconds
          </Label>
          <TimePickerInput
            picker="seconds"
            date={selectedDate}
            setDate={onDateChange}
            ref={secondRef}
            onLeftFocus={() => minuteRef.current?.focus()}
          />
        </div>
      )}
      <div className="flex h-10 items-center">
        <Clock className="ml-2 h-4 w-4" />
      </div>
    </div>
  );
}
