import React from "react";
import { type DropdownProps, useDayPicker } from "react-day-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../shadcn/select";
import { cn } from "~/lib/utils";

export default function CalendarDropdown(props: DropdownProps) {
  const { options, ...selectProps } = props;
  const { goToMonth, months } = useDayPicker();
  const isMonthDropdown = options?.[0]?.label === "January";
  const selected = options?.find(
    (option) => option.value === selectProps.value,
  );

  return (
    <Select
      value={selectProps.value?.toString()}
      onValueChange={(value) => {
        const monthOrYear = parseInt(value);
        if (isMonthDropdown) {
          const year = months[0]?.date.getFullYear();
          if (year) {
            const date = new Date(year, monthOrYear);
            goToMonth(date);
          }
        } else {
          const month = months[0]?.date.getMonth();
          if (month) {
            const date = new Date(monthOrYear, month);
            goToMonth(date);
          }
        }
      }}
    >
      <SelectTrigger
        className={cn(
          "border-none p-0 shadow-none",
          isMonthDropdown && "w-[6.75rem]",
        )}
      >
        <SelectValue placeholder={selected?.label} />
      </SelectTrigger>
      <SelectContent>
        {options?.map(({ value, label, disabled }) => (
          <SelectItem key={value} value={value.toString()} disabled={disabled}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
