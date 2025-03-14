"use client";

import { addMonths, isSameDay, startOfMonth, subMonths } from "date-fns";
import React from "react";
import { createContext } from "react";
import { api, type RouterOutputs } from "~/trpc/react";
import { useBpCalendarContext } from "./bpCaldendarContext";
import { getDatetimeString } from "~/lib/utils";

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

  const som = startOfMonth(calendarContext?.selectedMonth ?? new Date());

  void api.calendar.getRollingMonthlyDiary.useQuery({
    datetime: getDatetimeString(subMonths(som, 1)),
  });

  void api.calendar.getRollingMonthlyDiary.useQuery({
    datetime: getDatetimeString(addMonths(som, 1)),
  });

  const [data] = api.calendar.getRollingMonthlyDiary.useSuspenseQuery({
    datetime: getDatetimeString(som),
  });

  return (
    <BpCalendarDataContext.Provider
      value={{
        data: data ?? [],
        dataFilteredBySelectedDate:
          data?.filter((entry) =>
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
