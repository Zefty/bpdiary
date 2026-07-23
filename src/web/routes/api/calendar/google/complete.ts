import { createFileRoute } from "@tanstack/react-router";
import { auth } from "@/server/auth";
import { completeGoogleCalendarConnection } from "@/server/calendar/calendarSync";

export const Route = createFileRoute("/api/calendar/google/complete")({
	server: {
		handlers: {
			GET: async ({ request }) => {
				const session = await auth.api.getSession({ headers: request.headers });
				if (!session || session.session.expiresAt < new Date()) {
					const loginUrl = new URL("/login", request.url);
					loginUrl.searchParams.set(
						"redirect",
						"/diary/reminders?calendar=error",
					);
					return Response.redirect(loginUrl, 303);
				}

				const remindersUrl = new URL("/diary/reminders", request.url);
				try {
					const result = await completeGoogleCalendarConnection(
						session.user.id,
						request.headers,
					);
					remindersUrl.searchParams.set(
						"calendar",
						result.failed ? "sync-error" : "connected",
					);
				} catch {
					remindersUrl.searchParams.set("calendar", "error");
				}

				return Response.redirect(remindersUrl, 303);
			},
		},
	},
});
