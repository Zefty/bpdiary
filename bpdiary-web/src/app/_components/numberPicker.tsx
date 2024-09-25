"use client";

import { KeyboardEvent, useState } from "react";
import { Input } from "~/app/_components/shadcn/input";
import { cn } from "~/lib/utils";

export default function NumberPicker({
  className,
  type,
}: {
  className?: string;
  type?: string;
}) {
  const [value, setValue] = useState(0);

  const padValue = (value: number) => {
    return value.toString().substring(0, 3).padStart(3, "0");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (["ArrowUp", "ArrowDown"].includes(e.key)) {
      const step = e.key === "ArrowUp" ? 1 : -1;
      const newValue =
        value + step > 999 ? 0 : value + step < 0 ? 999 : value + step;
      setValue(newValue);
    }
  };

  return (
    <Input
      // ref={ref}
      // id={id || picker}
      // name={name || picker}
      className={cn(
        "w-[72px] text-center font-mono text-base tabular-nums caret-transparent focus:bg-accent focus:text-accent-foreground [&::-webkit-inner-spin-button]:appearance-none",
        className,
      )}
      value={padValue(value)}
      onChange={(e) => {
        e.preventDefault();
        setValue(Number(e.target.value));
      }}
      type={type}
      inputMode="decimal"
      onKeyDown={(e) => {
        e.preventDefault();
        handleKeyDown(e);
      }}
      // {...props}
    />
  );
}
