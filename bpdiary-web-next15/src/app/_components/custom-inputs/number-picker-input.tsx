import { Input } from "~/app/_components/shadcn/input";

import { cn } from "~/lib/utils";
import React, { useImperativeHandle, useRef } from "react";

export interface NumberPickerInputRefs {
  value: string;
  reset: () => void;
  focus: () => void;
}

export interface NumberPickerInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  number?: number;
  setNumber: (number: number | undefined) => void;
  onRightFocus?: () => void;
  onLeftFocus?: () => void;
}

const NumberPickerInput = React.forwardRef<
  NumberPickerInputRefs,
  NumberPickerInputProps
>(
  (
    {
      className,
      type = "tel",
      value,
      id,
      name,
      number,
      setNumber,
      onChange,
      onKeyDown,
      onLeftFocus,
      onRightFocus,
      ...props
    },
    ref,
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [flag, setFlag] = React.useState<boolean>(false);

    /**
     * allow the user to enter the second digit within 2 seconds
     * otherwise start again with entering first digit
     */
    React.useEffect(() => {
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
        value: inputRef.current?.value || "",
        reset: () => setNumber(0),
        focus: () => inputRef.current?.focus(),
      }),
      [],
    );

    const padValue = (value: string | undefined) => {
      if (value === undefined) return "";
      return value?.substring(0, 3).padStart(3, "0");
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Tab") return;
      e.preventDefault();
      if (e.key === "ArrowRight") onRightFocus?.();
      if (e.key === "ArrowLeft") onLeftFocus?.();
      if (["ArrowUp", "ArrowDown"].includes(e.key)) {
        const step = e.key === "ArrowUp" ? 1 : -1;
        const newValue = number !== undefined ? Math.max(number + step, 0) : 1;
        if (flag) setFlag(false);
        setNumber(newValue);
      }
      if (e.key === "Backspace") {
        if (number === undefined) return;
        setNumber(Math.floor(number / 10));
      }
      if (e.key >= "0" && e.key <= "9") {
        let newValue = Number(e.key);
        if (number !== undefined && flag) {
          newValue = Number(`${number}${newValue}`.substring(0, 3));
        }
        if (!flag) setFlag(true);
        setNumber(newValue);
      }
    };

    return (
      <Input
        ref={inputRef}
        id={id || name}
        name={name}
        className={cn(
          "focus:bg-accent focus:text-accent-foreground w-[6.5ch] text-center font-mono text-base tabular-nums caret-transparent [&::-webkit-inner-spin-button]:appearance-none",
          className,
        )}
        placeholder="000"
        value={value || padValue(number?.toString())}
        onChange={(e) => {
          e.preventDefault();
          onChange?.(e);
        }}
        type={type}
        inputMode="decimal"
        onKeyDown={(e) => {
          onKeyDown?.(e);
          handleKeyDown(e);
        }}
        {...props}
      />
    );
  },
);

NumberPickerInput.displayName = "NumberPickerInput";

export { NumberPickerInput };
