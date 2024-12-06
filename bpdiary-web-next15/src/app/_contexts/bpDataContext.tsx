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
export interface BpDataContext {
  data: BloodPressureDiary;
  dataFilteredBySelectedDate: BloodPressureDiary;
}

export const BpDataContext = createContext<BpDataContext | undefined>(
  undefined,
);

interface BpDataContextProviderProps {
  children: React.ReactNode;
}

export const BpDataContextProvider: React.FC<BpDataContextProviderProps> = ({
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
    <BpDataContext.Provider
      value={{
        data: dataMonthly.data ?? [],
        dataFilteredBySelectedDate:
          dataMonthly.data?.filter((entry) =>
            isSameDay(entry.createdAt, calendarContext?.selectedDate ?? 0),
          ) ?? [],
      }}
    >
      {children}
    </BpDataContext.Provider>
  );
};

export const useBpDataContext = () => {
  return React.useContext(BpDataContext);
};
