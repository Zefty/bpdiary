import {
	useMutation,
	useQueryClient,
	useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
	BellRing,
	Clock3,
	LoaderCircle,
	Pill,
	Plus,
	Trash2,
} from "lucide-react";
import { useState } from "react";
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
import {
	type ReminderInput,
	reminderDaySchema,
} from "@/core/reminders/reminder";
import { deleteReminder, saveReminder } from "@/server/reminders/reminders";
import { diary } from "@/web/data/diary";

export const Route = createFileRoute("/(app)/_authed/diary/reminders")({
	loader: ({ context }) =>
		context.queryClient.ensureQueryData(diary.queries.reminders()),
	component: RemindersPage,
});

const days = reminderDaySchema.options;

function RemindersPage() {
	const { data: reminders } = useSuspenseQuery(diary.queries.reminders());
	const queryClient = useQueryClient();
	const [showForm, setShowForm] = useState(false);
	const [type, setType] = useState<ReminderInput["type"]>("blood-pressure");
	const save = useMutation({
		mutationFn: saveReminder,
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["reminders"] });
			setShowForm(false);
		},
	});
	const remove = useMutation({
		mutationFn: deleteReminder,
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ["reminders"] }),
	});

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
				<Button type="button" onClick={() => setShowForm(true)}>
					<Plus className="size-4" /> New reminder
				</Button>
			</header>
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
				</section>
				<aside className="rounded-[2rem] bg-primary p-6 text-primary-foreground">
					<BellRing className="size-6" />
					<h2 className="mt-5 text-xl font-semibold">
						Small routines, clearer records.
					</h2>
					<p className="mt-3 text-sm leading-6 text-primary-foreground/75">
						Aim to measure under similar conditions each time. Reminders are
						stored here; notification delivery can be connected in a later
						production phase.
					</p>
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
								onClick={() => setShowForm(false)}
							>
								Cancel
							</Button>
							<Button type="submit" disabled={save.isPending}>
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
		</main>
	);
}
