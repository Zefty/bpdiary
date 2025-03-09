"use client";

import { addMonths, isSameDay, startOfMonth, subMonths } from "date-fns";
import React from "react";
import { createContext } from "react";
import { api, type RouterOutputs } from "~/trpc/react";
import { useBpCalendarContext } from "./bpCaldendarContext";

type BloodPressureDiary = RouterOutputs["calendar"]["getMonthlyDiary"];

/**
 * Daily Blood Pressure History Context
 */
export interface BpCalendarDataContext {
  data: BloodPressureDiary;
  dataFilteredBySelectedDate: BloodPressureDiary;
}

export const BpCalendarDataContext = createContext<
  BpCalendarDataContext | undefined
>(undefined);

interface BpCalendarDataContextProviderProps {
  children: React.ReactNode;
}

export const BpCalendarDataContextProvider: React.FC<
  BpCalendarDataContextProviderProps
> = ({ children }) => {
  const calendarContext = useBpCalendarContext();

  // const som = startOfMonth(calendarContext?.selectedMonth ?? new Date());

  // void api.calendar.getRollingMonthlyDiary.useQuery({
  //   date: subMonths(som, 1),
  // });

  // void api.calendar.getRollingMonthlyDiary.useQuery({
  //   date: addMonths(som, 1),
  // });

  const date = calendarContext?.selectedMonth ?? new Date();

  const dataMonthly = api.calendar.getRollingMonthlyDiary.useQuery({
    datetime: date.toDateString() + " " + date.toLocaleTimeString(),
  });

  return (
    <BpCalendarDataContext.Provider
      value={{
        data: dataMonthly.data ?? [],
        dataFilteredBySelectedDate:
          dataMonthly.data?.filter((entry) =>
            isSameDay(entry.measuredAt, calendarContext?.selectedDate ?? 0),
          ) ?? [],
      }}
    >
      {children}
    </BpCalendarDataContext.Provider>
  );
};

export const useBpCalendarDataContext = () => {
  return React.useContext(BpCalendarDataContext);
};
