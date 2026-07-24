import {
	useMutation,
	useQueryClient,
	useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
	BellRing,
	CalendarCheck2,
	CalendarX2,
	CircleAlert,
	Clock3,
	LoaderCircle,
	Pill,
	Plus,
	RefreshCw,
	Trash2,
} from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { Button } from "@/client/components/shadcn/button";
import { Card, CardContent } from "@/client/components/shadcn/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/client/components/shadcn/dialog";
import {
	Field,
	FieldError,
	FieldLabel,
} from "@/client/components/shadcn/field";
import { Input } from "@/client/components/shadcn/input";
import { ScrollArea } from "@/client/components/shadcn/scroll-area";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/client/components/shadcn/select";
import { authClient } from "@/client/lib/authClient";
import {
	type ReminderInput,
	reminderDaySchema,
} from "@/core/reminders/reminder";
import {
	disconnectGoogleCalendar,
	prepareGoogleCalendarConnection,
	retryGoogleCalendarSync,
} from "@/server/calendar/calendarConnections";
import { deleteReminder, saveReminder } from "@/server/reminders/reminders";
import { diary } from "@/web/data/diary";

const searchSchema = z.object({
	calendar: z.enum(["connected", "sync-error", "error"]).optional(),
});

export const Route = createFileRoute("/(app)/_authed/diary/reminders")({
	validateSearch: searchSchema.parse,
	loader: ({ context }) =>
		Promise.all([
			context.queryClient.ensureQueryData(diary.queries.reminders()),
			context.queryClient.ensureQueryData(diary.queries.calendarConnection()),
		]),
	component: RemindersPage,
});

const days = reminderDaySchema.options;
const reminderTypeLabels = {
	"blood-pressure": "Blood pressure check",
	medication: "Medication",
} satisfies Record<ReminderInput["type"], string>;

function RemindersPage() {
	const { data: reminders } = useSuspenseQuery(diary.queries.reminders());
	const { data: calendarConnection } = useSuspenseQuery(
		diary.queries.calendarConnection(),
	);
	const search = Route.useSearch();
	const queryClient = useQueryClient();
	const [showForm, setShowForm] = useState(false);
	const [showDisconnect, setShowDisconnect] = useState(false);
	const [deleteLocalReminders, setDeleteLocalReminders] = useState(false);
	const [type, setType] = useState<ReminderInput["type"]>("blood-pressure");
	const save = useMutation({
		mutationFn: saveReminder,
		onSuccess: async () => {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: ["reminders"] }),
				queryClient.invalidateQueries({ queryKey: ["calendar-connection"] }),
			]);
			setShowForm(false);
		},
	});
	const remove = useMutation({
		mutationFn: deleteReminder,
		onSuccess: () =>
			Promise.all([
				queryClient.invalidateQueries({ queryKey: ["reminders"] }),
				queryClient.invalidateQueries({ queryKey: ["calendar-connection"] }),
			]),
	});
	const connectCalendar = useMutation({
		mutationFn: async () => {
			const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
			await prepareGoogleCalendarConnection({ data: { timeZone } });
			const callbackURL = `${window.location.origin}/api/calendar/google/complete`;
			const result = await authClient.linkSocial({
				provider: "google",
				callbackURL,
				errorCallbackURL: `${window.location.origin}/diary/reminders?calendar=error`,
				scopes: ["https://www.googleapis.com/auth/calendar.app.created"],
			});
			if (result.error) {
				throw new Error(
					result.error.message ?? "Google Calendar could not be connected.",
				);
			}
		},
	});
	const retryCalendar = useMutation({
		mutationFn: retryGoogleCalendarSync,
		onSuccess: () =>
			Promise.all([
				queryClient.invalidateQueries({ queryKey: ["reminders"] }),
				queryClient.invalidateQueries({ queryKey: ["calendar-connection"] }),
			]),
	});
	const disconnectCalendar = useMutation({
		mutationFn: disconnectGoogleCalendar,
		onSuccess: async () => {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: ["reminders"] }),
				queryClient.invalidateQueries({ queryKey: ["calendar-connection"] }),
			]);
			setShowDisconnect(false);
			setDeleteLocalReminders(false);
		},
	});
	const openDisconnectDialog = () => {
		disconnectCalendar.reset();
		setDeleteLocalReminders(false);
		setShowDisconnect(true);
	};

	const submit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const data = new FormData(event.currentTarget);
		save.mutate({
			data: {
				type,
				time: String(data.get("time")),
				days: days.filter((day) => data.getAll("days").includes(day)),
				active: true,
			},
		});
	};

	return (
		<main className="page-shell max-w-6xl">
			<header className="flex flex-wrap items-end justify-between gap-5">
				<div>
					<p className="eyebrow">Build a routine</p>
					<h1 className="page-title mt-2">Reminders</h1>
					<p className="mt-2 text-muted-foreground">
						Plan consistent times for measurements and medication.
					</p>
				</div>
				<Button type="button" size="lg" onClick={() => setShowForm(true)}>
					<Plus className="size-4" /> New reminder
				</Button>
			</header>
			{search.calendar && (
				<div
					className={`mt-6 rounded-2xl border px-4 py-3 text-sm ${
						search.calendar === "connected"
							? "border-primary/20 bg-primary/5 text-foreground"
							: "border-destructive/20 bg-destructive/5 text-destructive"
					}`}
				>
					{search.calendar === "connected"
						? "Google Calendar is connected and your reminders are synced."
						: search.calendar === "sync-error"
							? "Google Calendar connected, but one or more reminders need another sync attempt."
							: "Google Calendar could not be connected. Please try again."}
				</div>
			)}
			<div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
				<section className="space-y-4">
					{reminders.map((reminder) => (
						<Card key={reminder.id} className="flex-row items-center gap-4 p-5">
							<div
								className={`summary-icon ${reminder.type === "medication" ? "summary-icon-mint" : "summary-icon-coral"}`}
							>
								{reminder.type === "medication" ? <Pill /> : <BellRing />}
							</div>
							<div className="min-w-0 flex-1">
								<div className="flex flex-wrap items-baseline gap-x-3">
									<p className="text-xl font-semibold tabular-nums">
										{new Intl.DateTimeFormat("en-AU", {
											hour: "numeric",
											minute: "2-digit",
										}).format(new Date(`2020-01-01T${reminder.time}`))}
									</p>
									<span className="text-sm capitalize text-muted-foreground">
										{reminder.type.replace("-", " ")}
									</span>
								</div>
								<p className="mt-1 truncate text-sm text-muted-foreground">
									{reminder.days.length === 7
										? "Every day"
										: reminder.days.join(", ")}
								</p>
								{reminder.calendarSyncStatus === "error" && (
									<p className="mt-1 text-xs text-destructive">
										{reminder.calendarSyncError ??
											"Google Calendar needs another sync attempt."}
									</p>
								)}
							</div>
							<Button
								type="button"
								onClick={() => remove.mutate({ data: { id: reminder.id } })}
								variant="ghost"
								size="icon"
								className="text-destructive"
								aria-label="Delete reminder"
							>
								<Trash2 className="size-4" />
							</Button>
						</Card>
					))}
					{reminders.length === 0 && (
						<Card className="grid min-h-72 place-items-center border-dashed text-center">
							<CardContent className="p-8">
								<div>
									<Clock3 className="mx-auto size-8 text-primary" />
									<h2 className="mt-4 text-xl font-semibold">
										No reminders yet
									</h2>
									<p className="mt-2 max-w-sm text-sm text-muted-foreground">
										Create a gentle prompt for the days and times that work for
										you.
									</p>
								</div>
							</CardContent>
						</Card>
					)}
					{remove.error && (
						<p className="text-sm text-destructive">{remove.error.message}</p>
					)}
				</section>
				<aside className="rounded-[2rem] bg-primary p-6 text-primary-foreground">
					{calendarConnection.status === "connected" ? (
						<CalendarCheck2 className="size-6" />
					) : calendarConnection.status === "error" ? (
						<CircleAlert className="size-6" />
					) : (
						<BellRing className="size-6" />
					)}
					<h2 className="mt-5 text-xl font-semibold">
						{calendarConnection.status === "connected"
							? "Google Calendar connected"
							: calendarConnection.status === "error"
								? "Calendar needs attention"
								: "Get reminders on your devices"}
					</h2>
					<p className="mt-3 text-sm leading-6 text-primary-foreground/75">
						{calendarConnection.status === "connected"
							? `${calendarConnection.syncedReminders} reminder${calendarConnection.syncedReminders === 1 ? " is" : "s are"} synced to your private BP Diary calendar.`
							: calendarConnection.status === "error"
								? (calendarConnection.lastError ??
									"Your reminders could not be synced to Google Calendar.")
								: "Connect once and BP Diary will keep recurring calendar events in sync with these settings."}
					</p>
					{calendarConnection.status === "connected" ? (
						<div className="mt-5 space-y-2">
							<Button
								type="button"
								variant="secondary"
								className="w-full"
								onClick={() => retryCalendar.mutate({ data: undefined })}
								disabled={retryCalendar.isPending}
							>
								<RefreshCw
									className={`size-4 ${retryCalendar.isPending ? "animate-spin" : ""}`}
								/>
								Sync now
							</Button>
							<Button
								type="button"
								variant="ghost"
								className="w-full text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
								onClick={openDisconnectDialog}
							>
								<CalendarX2 className="size-4" />
								Disconnect
							</Button>
						</div>
					) : calendarConnection.available ? (
						<div className="mt-5 space-y-2">
							<Button
								type="button"
								variant="secondary"
								className="w-full"
								onClick={() => connectCalendar.mutate()}
								disabled={connectCalendar.isPending}
							>
								{connectCalendar.isPending ? (
									<LoaderCircle className="size-4 animate-spin" />
								) : (
									<CalendarCheck2 className="size-4" />
								)}
								{calendarConnection.status === "error"
									? "Reconnect Google Calendar"
									: "Connect Google Calendar"}
							</Button>
							{calendarConnection.status === "error" && (
								<Button
									type="button"
									variant="ghost"
									className="w-full text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
									onClick={() => retryCalendar.mutate({ data: undefined })}
									disabled={retryCalendar.isPending}
								>
									Try sync again
								</Button>
							)}
							{calendarConnection.hasConnection && (
								<Button
									type="button"
									variant="ghost"
									className="w-full text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
									onClick={openDisconnectDialog}
								>
									<CalendarX2 className="size-4" />
									Disconnect
								</Button>
							)}
						</div>
					) : (
						<p className="mt-4 text-xs text-primary-foreground/70">
							Google sign-in credentials are not configured for this deployment.
						</p>
					)}
					{(connectCalendar.error || retryCalendar.error) && (
						<p className="mt-3 text-xs text-primary-foreground/80">
							{connectCalendar.error?.message ?? retryCalendar.error?.message}
						</p>
					)}
				</aside>
			</div>
			<Dialog open={showForm} onOpenChange={setShowForm}>
				<DialogContent className="flex h-[min(94dvh,36rem)] flex-col overflow-hidden rounded-[2rem] sm:max-w-lg sm:p-8">
					<DialogHeader>
						<p className="eyebrow">New routine</p>
						<DialogTitle>Add a reminder</DialogTitle>
						<DialogDescription>
							Choose what you want to remember and when.
						</DialogDescription>
					</DialogHeader>
					<form
						className="mt-2 flex min-h-0 flex-1 flex-col overflow-hidden"
						onSubmit={submit}
					>
						<ScrollArea className="h-full min-h-0 flex-1">
							<div className="space-y-5 py-4 pr-4 pl-1">
								<Field>
									<FieldLabel>Reminder for</FieldLabel>
									<Select
										items={reminderTypeLabels}
										value={type}
										onValueChange={(value) =>
											setType(value as ReminderInput["type"])
										}
									>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="blood-pressure">
												Blood pressure check
											</SelectItem>
											<SelectItem value="medication">Medication</SelectItem>
										</SelectContent>
									</Select>
								</Field>
								<Field>
									<FieldLabel htmlFor="reminder-time">Time</FieldLabel>
									<Input
										id="reminder-time"
										name="time"
										type="time"
										defaultValue="08:00"
										required
									/>
								</Field>
								<fieldset>
									<legend className="text-sm font-medium">Days</legend>
									<div className="mt-2 grid grid-cols-7 gap-1">
										{days.map((day) => (
											<label key={day} className="day-toggle">
												<input
													type="checkbox"
													name="days"
													value={day}
													defaultChecked
												/>
												<span>{day.slice(0, 1)}</span>
											</label>
										))}
									</div>
								</fieldset>
								<FieldError>{save.error?.message}</FieldError>
							</div>
						</ScrollArea>
						<DialogFooter className="mx-0 mb-0 shrink-0 border-0 bg-transparent p-0 pt-4">
							<Button
								type="button"
								variant="outline"
								size="lg"
								onClick={() => setShowForm(false)}
							>
								Cancel
							</Button>
							<Button type="submit" size="lg" disabled={save.isPending}>
								{save.isPending ? (
									<LoaderCircle className="size-4 animate-spin" />
								) : (
									<Plus className="size-4" />
								)}{" "}
								Add reminder
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
			<Dialog
				open={showDisconnect}
				onOpenChange={(open) => {
					if (disconnectCalendar.isPending) return;
					setShowDisconnect(open);
					if (!open) {
						setDeleteLocalReminders(false);
						disconnectCalendar.reset();
					}
				}}
			>
				<DialogContent className="rounded-[2rem] sm:max-w-lg sm:p-8">
					<DialogHeader>
						<p className="eyebrow">Google Calendar</p>
						<DialogTitle>Disconnect calendar?</DialogTitle>
						<DialogDescription>
							This deletes the private BP Diary Reminders calendar and every
							event inside it. Your Google sign-in stays connected.
						</DialogDescription>
					</DialogHeader>
					<fieldset className="mt-3 space-y-3">
						<legend className="text-sm font-medium">
							What should happen to your reminders?
						</legend>
						<label
							className={`flex cursor-pointer gap-3 rounded-2xl border p-4 transition ${
								!deleteLocalReminders
									? "border-primary bg-primary/5"
									: "border-border"
							}`}
						>
							<input
								type="radio"
								name="disconnect-reminders"
								className="mt-1 accent-primary"
								checked={!deleteLocalReminders}
								onChange={() => setDeleteLocalReminders(false)}
								disabled={disconnectCalendar.isPending}
							/>
							<span>
								<span className="block text-sm font-semibold">
									Keep my BP Diary reminders
								</span>
								<span className="mt-1 block text-sm leading-5 text-muted-foreground">
									They remain as settings and will sync again if you reconnect
									Google Calendar.
								</span>
							</span>
						</label>
						<label
							className={`flex cursor-pointer gap-3 rounded-2xl border p-4 transition ${
								deleteLocalReminders
									? "border-destructive bg-destructive/5"
									: "border-border"
							}`}
						>
							<input
								type="radio"
								name="disconnect-reminders"
								className="mt-1 accent-destructive"
								checked={deleteLocalReminders}
								onChange={() => setDeleteLocalReminders(true)}
								disabled={disconnectCalendar.isPending}
							/>
							<span>
								<span className="block text-sm font-semibold">
									Delete my BP Diary reminders
								</span>
								<span className="mt-1 block text-sm leading-5 text-muted-foreground">
									This permanently deletes every reminder saved in BP Diary.
								</span>
							</span>
						</label>
					</fieldset>
					{disconnectCalendar.error && (
						<p className="mt-3 text-sm text-destructive">
							{disconnectCalendar.error.message}
						</p>
					)}
					<DialogFooter className="mt-5">
						<Button
							type="button"
							variant="outline"
							onClick={() => {
								setShowDisconnect(false);
								setDeleteLocalReminders(false);
								disconnectCalendar.reset();
							}}
							disabled={disconnectCalendar.isPending}
						>
							Cancel
						</Button>
						<Button
							type="button"
							variant={deleteLocalReminders ? "destructive" : "default"}
							onClick={() =>
								disconnectCalendar.mutate({
									data: { deleteLocalReminders },
								})
							}
							disabled={disconnectCalendar.isPending}
						>
							{disconnectCalendar.isPending ? (
								<LoaderCircle className="size-4 animate-spin" />
							) : (
								<CalendarX2 className="size-4" />
							)}
							{deleteLocalReminders
								? "Delete calendar and reminders"
								: "Disconnect and keep reminders"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</main>
	);
}
