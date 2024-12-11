import { isSameDay } from "date-fns";
import { Gauge, HeartPulse } from "lucide-react";
import { DayProps } from "react-day-picker";
import { useBpCalendarContext } from "~/app/_contexts/bpCaldendarContext";
import { useBpDataContext } from "~/app/_contexts/bpDataContext";
import { cn } from "~/lib/utils";

export default function CalendarDay(props: DayProps) {
  const calendarContext = useBpCalendarContext();
  const dataContext = useBpDataContext();
  const { day, modifiers, ...tdProps } = props;
  const cellData = dataContext?.data?.find((ele) =>
    isSameDay(ele.createdAt, day.date),
  );
  return (
    <td
      {...tdProps}
      className={cn(tdProps.className, "flex flex-col items-center")}
      onClick={(e) => {
        calendarContext?.setSelectedDate(day.date);
      }}
    >
      <div className="mt-2">{props.day.date.getDate()}</div>
      {cellData && (
        <div className="h-full hidden text-muted-foreground my-2 [@media(min-height:600px)]:flex flex-col justify-center gap-2 text-xs">
          <div className="flex items-center gap-2">
            <Gauge className="text-primary" height={12} width={12} />
            <span className="flex flex-col">
              <span className="underline underline-offset-[3px]">
                {cellData?.systolic}
              </span>
              <span>{cellData?.diastolic}</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <HeartPulse className="text-primary" height={12} width={12} />
            <span>{cellData?.pulse}</span>
          </div>
        </div>
      )}
    </td>
  );
}
