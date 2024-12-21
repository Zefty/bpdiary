"use client";

import {
  KeyboardEvent,
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
  useEffect,
} from "react";
import { Input } from "~/app/_components/shadcn/input";
import { cn } from "~/lib/utils";

export interface NumberPickerRefs {
  value: number;
  reset: () => void;
  focus: () => void;
}

export interface NumberPickerProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  id?: string;
  name?: string;
  type?: string;
  initialValue?: number | null;
  onNextFocus?: () => void;
}

export const NumberPicker = forwardRef<NumberPickerRefs, NumberPickerProps>(
  ({ className, id, name, type, initialValue, onNextFocus, onChange, onKeyDown }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [value, setValue] = useState<number>(initialValue ?? 0);
    const [flag, setFlag] = useState<boolean>(false);

    /**
     * allow the user to enter the second digit within 2 seconds
     * otherwise start again with entering first digit
     */
    useEffect(() => {
      if (flag) {
        const timer = setTimeout(() => {
          setFlag(false);
        }, 2000);

        return () => clearTimeout(timer);
      }
    }, [flag]);

    useImperativeHandle(
      ref,
      () => ({
        value,
        reset: () => setValue(0),
        focus: () => inputRef.current?.focus(),
      }),
      [],
    );

    const padValue = (value: number) => {
      return value.toString().substring(0, 3).padStart(3, "0");
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (["Tab", "Enter"].includes(e.key)) {
        onNextFocus?.();
        return;
      }
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
          onChange?.(e);
          setValue(Number(e.target.value));
        }}
        type={type}
        inputMode="numeric"
        onKeyDown={(e) => {
          e.preventDefault();
          onKeyDown?.(e);
          handleKeyDown(e);
        }}
        // {...props}
      />
    );
  },
);
