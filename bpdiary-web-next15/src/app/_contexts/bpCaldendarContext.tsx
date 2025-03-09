"use client";

import React from "react";
import { createContext } from "react";

/**
 * Calendar context
 */
export interface BpCalendarContext {
  today: Date;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  selectedMonth: Date;
  setSelectedMonth: (date: Date) => void;
}

export const BpCalendarContext = createContext<BpCalendarContext>({
  today: new Date(),
  selectedDate: new Date(),
  setSelectedDate: function (date) {
    this.selectedDate = date;
  },
  selectedMonth: new Date(),
  setSelectedMonth: function (date) {
    this.selectedMonth = date;
  },
});

interface BpCalendarContextProviderProps {
  children: React.ReactNode;
  initialDate: Date;
}

export const BpCalendarContextProvider: React.FC<
  BpCalendarContextProviderProps
> = ({ children, initialDate }) => {
  const [selectedDate, setSelectedDate] = React.useState<Date>(initialDate);
  const [selectedMonth, setSelectedMonth] = React.useState<Date>(initialDate);

  return (
    <BpCalendarContext.Provider
      value={{
        today: initialDate,
        selectedDate,
        setSelectedDate,
        selectedMonth,
        setSelectedMonth,
      }}
    >
      {children}
    </BpCalendarContext.Provider>
  );
};

export const useBpCalendarContext = () => {
  return React.useContext(BpCalendarContext);
};
