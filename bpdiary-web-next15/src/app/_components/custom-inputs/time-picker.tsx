"use client";

import { Clock } from "lucide-react";
import { Label } from "~/app/_components/shadcn/label";
import { TimePickerInput, TimePickerInputRefs } from "./time-picker-input";
import { useContext, useRef } from "react";
import { DateContext } from "./date-picker";

interface TimePickerProps {
  showSeconds?: boolean;
}

export function TimePicker({ showSeconds }: TimePickerProps) {
  const dateContext = useContext(DateContext);
  const minuteRef = useRef<TimePickerInputRefs>(null);
  const hourRef = useRef<TimePickerInputRefs>(null);
  const secondRef = useRef<TimePickerInputRefs>(null);
  showSeconds = showSeconds ?? dateContext?.showSeconds ?? false;

  const date = dateContext?.date;
  const setDate =
    dateContext?.setDate ??
    (() => {
      console.log("setDate not implemented");
    });

  return (
    <div className="flex items-end gap-2">
      <div className="grid gap-1 text-center">
        <Label htmlFor="hours" className="text-xs">
          Hours
        </Label>
        <TimePickerInput
          picker="hours"
          date={date}
          setDate={setDate}
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
          date={date}
          setDate={setDate}
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
            date={date}
            setDate={setDate}
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
