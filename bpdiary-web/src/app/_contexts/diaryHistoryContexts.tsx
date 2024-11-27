// "use client";

// import { addMonths, isSameDay, startOfMonth, subMonths } from "date-fns";
// import React from "react";
// import { createContext, useContext } from "react";
// import { api, RouterOutputs } from "~/trpc/react";

// type BloodPressureDiary = RouterOutputs["bloodPressure"]["getMonthlyDiary"];
// type PaginatedDiary =
//   RouterOutputs["bloodPressure"]["getMonthlyPaginatedDiary"];

// /**
//  * Calendar history context
//  */
// export interface CalendarHistoryContext {
//   today: Date;
//   selectedDate: Date | undefined;
//   setSelectedDate: (date: Date) => void;
//   selectedMonth: Date | undefined;
//   setSelectedMonth: (date: Date) => void;
//   // diary: BloodPressureDiary;
// }

// export const CalendarHistoryContext = createContext<
//   CalendarHistoryContext | undefined
// >(undefined);

// interface CalendarHistoryContextProviderProps {
//   children: React.ReactNode;
//   initialDate: Date;
// }

// export const CalendarHistoryContextProvider: React.FC<
//   CalendarHistoryContextProviderProps
// > = ({ children, initialDate }) => {
//   const [selectedDate, setSelectedDate] = React.useState<Date>(initialDate);
//   const som = startOfMonth(selectedDate);
//   const [selectedMonth, setSelectedMonth] = React.useState<Date>(som);

//   return (
//     <CalendarHistoryContext.Provider
//       value={{
//         today: initialDate,
//         selectedDate,
//         setSelectedDate,
//         selectedMonth,
//         setSelectedMonth,
//         // diary: dataMonthly.data ?? [],
//       }}
//     >
//       {children}
//     </CalendarHistoryContext.Provider>
//   );
// };

// export const useCalendarHistory = () => {
//   return React.useContext(CalendarHistoryContext);
// };

// /**
//  * Calendar history context
//  */
// export interface RollingDiaryHistoryDataContext {
//   data: BloodPressureDiary;
//   dataFilteredBySelectedDate: BloodPressureDiary;
// }

// export const RollingDiaryHistoryDataContext = createContext<
//   RollingDiaryHistoryDataContext | undefined
// >(undefined);

// interface RollingDiaryHistoryDataContextProviderProps {
//   children: React.ReactNode;
// }

// export const RollingDiaryHistoryDataContextProvider: React.FC<
//   RollingDiaryHistoryDataContextProviderProps
// > = ({ children }) => {
//   const calendarContext = useCalendarHistory();

//   const som = startOfMonth(calendarContext?.selectedMonth ?? new Date());

//   const dataMonthly = api.bloodPressure.getMonthlyRollingDiary.useQuery({
//     date: som,
//   });

//   void api.bloodPressure.getMonthlyRollingDiary.useQuery({
//     date: subMonths(som, 1),
//   });

//   void api.bloodPressure.getMonthlyRollingDiary.useQuery({
//     date: addMonths(som, 1),
//   });

//   return (
//     <RollingDiaryHistoryDataContext.Provider
//       value={{
//         data: dataMonthly.data ?? [],
//         dataFilteredBySelectedDate: dataMonthly.data?.filter(
//           (entry) => isSameDay(entry.createdAt, calendarContext?.selectedDate ?? 0)
//         ) ?? []
//       }}
//     >
//       {children}
//     </RollingDiaryHistoryDataContext.Provider>
//   );
// };

// export const useRollingDiaryHistoryData = () => {
//   return React.useContext(RollingDiaryHistoryDataContext);
// };

// /**
//  * Calendar history context
//  */

// export interface PaginatedDiaryHistoryDataContext {
//   data: BloodPressureDiary;
//   getNextMonthData: any;
//   getPreviousMonthData: any;
// }

// export const PaginatedDiaryHistoryDataContext = createContext<
//   PaginatedDiaryHistoryDataContext | undefined
// >(undefined);

// interface PaginatedDiaryHistoryDataContextProviderProps {
//   children: React.ReactNode;
//   initialMonth: {
//     year: number;
//     month: number;
//   };
// }

// export const PaginatedDiaryHistoryDataContextProvider: React.FC<
//   PaginatedDiaryHistoryDataContextProviderProps
// > = ({ children, initialMonth }) => {
//   const { data, fetchNextPage, fetchPreviousPage } =
//     api.bloodPressure.getMonthlyPaginatedDiary.useInfiniteQuery(
//       {
//         cursor: {
//           year: initialMonth.year,
//           month: initialMonth.month,
//         },
//       },
//       {
//         getNextPageParam: (lastPage, allPages, lastPageParam) => {
//           lastPageParam.month += 1;
//           return lastPageParam;
//         },
//         getPreviousPageParam: (firstPage, allPages, firstPageParam) => {
//           firstPageParam.month -= 1;
//           return firstPageParam;
//         },
//         initialCursor: {
//           year: initialMonth.year,
//           month: initialMonth.month,
//         },
//       },
//     );

//   // console.log(data?.pages.flatMap((page) => page.data));
//   // console.log(data?.pages.flatMap((page) => page));
//   return (
//     <PaginatedDiaryHistoryDataContext.Provider
//       value={{
//         data: data?.pages.flatMap((page) => page.data) ?? [],
//         getNextMonthData: fetchNextPage,
//         getPreviousMonthData: fetchPreviousPage,
//       }}
//     >
//       {children}
//     </PaginatedDiaryHistoryDataContext.Provider>
//   );
// };

// export const usePaginatedDiaryHistoryData = () => {
//   return useContext(PaginatedDiaryHistoryDataContext);
// };
