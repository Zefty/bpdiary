import { queryOptions } from "@tanstack/react-query";
import { getGoogleCalendarConnection } from "@/server/calendar/calendarConnections";
import { listMeasurements } from "@/server/measurements/measurements";
import { getProfile } from "@/server/profile/profile";
import { listReminders } from "@/server/reminders/reminders";
import { getActiveDiaryShare } from "@/server/sharing/diaryShares";

export const diary = {
	queries: {
		measurements: () =>
			queryOptions({
				queryKey: ["measurements"],
				queryFn: () => listMeasurements(),
			}),
		reminders: () =>
			queryOptions({
				queryKey: ["reminders"],
				queryFn: () => listReminders(),
			}),
		calendarConnection: () =>
			queryOptions({
				queryKey: ["calendar-connection"],
				queryFn: () => getGoogleCalendarConnection(),
			}),
		profile: () =>
			queryOptions({
				queryKey: ["profile"],
				queryFn: () => getProfile(),
			}),
		activeShare: () =>
			queryOptions({
				queryKey: ["diary-share"],
				queryFn: () => getActiveDiaryShare(),
			}),
	},
};
