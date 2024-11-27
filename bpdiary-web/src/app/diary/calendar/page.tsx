import { addMonths, startOfMonth, subMonths } from "date-fns";
import { api, HydrateClient } from "~/trpc/server";
import BpCalendarView from "~/app/_components/calendar/bpCalendarView";
import { BpCalendarContextProvider } from "~/app/_contexts/bpCaldendarContext";
import { BpDataContextProvider } from "~/app/_contexts/bpDataContext";

export default async function Calendar() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const som = startOfMonth(today);

  await api.bloodPressure.getInfiniteDiary.prefetchInfinite({});
  await api.bloodPressure.getMonthlyRollingDiary.prefetch({date: som});
  void api.bloodPressure.getMonthlyRollingDiary.prefetch({
    date: subMonths(som, 1),
  });

  void api.bloodPressure.getMonthlyRollingDiary.prefetch({
    date: addMonths(som, 1),
  });

  return (
    <HydrateClient>
      <BpCalendarContextProvider initialDate={today}>
        <BpDataContextProvider>
          <BpCalendarView />
        </BpDataContextProvider>
      </BpCalendarContextProvider>
    </HydrateClient>
  );
}
