import { useBpCalendarContext } from "~/app/_contexts/bpCaldendarContext";
import { Skeleton } from "../shadcn/skeleton";
import { type DayProps } from "react-day-picker";
import { cn } from "~/lib/utils";

export default function LoadingCalendarDay(props: DayProps) {
  const calendarContext = useBpCalendarContext();
  const { day, ...tdProps } = props;
  return (
    <td
      {...tdProps}
      className={cn(
        tdProps.className,
        "hover:bg-accent flex flex-col items-center",
      )}
      onClick={(_e) => {
        calendarContext.setSelectedDate(day.date);
      }}
    >
      <div className="mt-2">{props.day.date.getDate()}</div>
      <div className="tablet:hidden flex h-full items-center">
        <Skeleton className="h-6 w-12" />
      </div>
      <div className="text-muted-foreground tablet:flex my-2 hidden h-full flex-col justify-center gap-2 text-xs">
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-12" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-12" />
        </div>
      </div>
    </td>
  );
}
