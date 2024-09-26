"use client";

import {
  KeyboardEvent,
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import { Input } from "~/app/_components/shadcn/input";
import { cn } from "~/lib/utils";

export interface NumberPickerRefs {
  value: number;
  reset: () => void;
}

export interface NumberPickerProps {
  className?: string;
  id?: string;
  name?: string;
  type?: string;
}

export const NumberPicker = forwardRef<NumberPickerRefs, NumberPickerProps>(
  ({ className, id, name, type }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [value, setValue] = useState<number>(0);
    useImperativeHandle(
      ref,
      () => ({
        value,
        reset: () => setValue(0),
      }),
      [],
    );

    const padValue = (value: number) => {
      return value.toString().substring(0, 3).padStart(3, "0");
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (["ArrowUp", "ArrowDown"].includes(e.key)) {
        const step = e.key === "ArrowUp" ? 1 : -1;
        const newValue =
          value + step > 999 ? 0 : value + step < 0 ? 999 : value + step;
        setValue(newValue);
      } else if (e.key >= "0" && e.key <= "9") {
        const newValue = value + e.key;
        newValue.length > 3
          ? setValue(Number(e.key))
          : setValue(Number(newValue));
      }
    };

    return (
      <Input
        ref={inputRef}
        id={id}
        name={name}
        className={cn(
          "w-[6ch] text-center font-mono text-base tabular-nums caret-transparent focus:bg-accent focus:text-accent-foreground [&::-webkit-inner-spin-button]:appearance-none",
          className,
        )}
        value={padValue(value)}
        onChange={(e) => {
          e.preventDefault();
          setValue(Number(e.target.value));
        }}
        type={type}
        inputMode="numeric"
        onKeyDown={(e) => {
          e.preventDefault();
          handleKeyDown(e);
        }}
        // {...props}
      />
    );
  },
);
