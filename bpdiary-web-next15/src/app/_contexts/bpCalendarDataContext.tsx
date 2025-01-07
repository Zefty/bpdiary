"use client";

import { addMonths, isSameDay, startOfMonth, subMonths } from "date-fns";
import React from "react";
import { createContext } from "react";
import { api, RouterOutputs } from "~/trpc/react";
import { useBpCalendarContext } from "./bpCaldendarContext";

type BloodPressureDiary = RouterOutputs["bloodPressure"]["getMonthlyDiary"];

/**
 * Daily Blood Pressure History Context
 */
export interface BpCalendarDataContext {
  data: BloodPressureDiary;
  dataFilteredBySelectedDate: BloodPressureDiary;
}

export const BpCalendarDataContext = createContext<BpCalendarDataContext | undefined>(
  undefined,
);

interface BpCalendarDataContextProviderProps {
  children: React.ReactNode;
}

export const BpCalendarDataContextProvider: React.FC<BpCalendarDataContextProviderProps> = ({
  children,
}) => {
  const calendarContext = useBpCalendarContext();

  const som = startOfMonth(calendarContext?.selectedMonth ?? new Date());

  const dataMonthly = api.bloodPressure.getMonthlyRollingDiary.useQuery({
    date: som,
  });

  void api.bloodPressure.getMonthlyRollingDiary.useQuery({
    date: subMonths(som, 1),
  });

  void api.bloodPressure.getMonthlyRollingDiary.useQuery({
    date: addMonths(som, 1),
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
