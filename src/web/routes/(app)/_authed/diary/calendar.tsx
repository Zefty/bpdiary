import {
	useMutation,
	useQueryClient,
	useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
	ChevronLeft,
	ChevronRight,
	Download,
	Pencil,
	Plus,
	Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { MeasurementDialog } from "@/client/components/MeasurementDialog";
import { Button } from "@/client/components/shadcn/button";
import { Card, CardContent } from "@/client/components/shadcn/card";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/client/components/shadcn/tooltip";
import type { MeasurementRecord } from "@/server/db/schema";
import { deleteMeasurement } from "@/server/measurements/measurements";
import { diary } from "@/web/data/diary";

export const Route = createFileRoute("/(app)/_authed/diary/calendar")({
	loader: ({ context }) =>
		context.queryClient.ensureQueryData(diary.queries.measurements()),
	component: HistoryPage,
});

function HistoryPage() {
	const { data: measurements } = useSuspenseQuery(diary.queries.measurements());
	const queryClient = useQueryClient();
	const [month, setMonth] = useState(
		() => new Date(new Date().getFullYear(), new Date().getMonth(), 1),
	);
	const [selectedDay, setSelectedDay] = useState<number | null>(null);
	const [editing, setEditing] = useState<MeasurementRecord | null>(null);
	const [dialogOpen, setDialogOpen] = useState(false);
	const remove = useMutation({
		mutationFn: deleteMeasurement,
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: ["measurements"] }),
	});
	const monthEntries = useMemo(
		() =>
			measurements.filter((entry) => {
				const date = new Date(entry.measuredAt);
				return (
					date.getFullYear() === month.getFullYear() &&
					date.getMonth() === month.getMonth()
				);
			}),
		[measurements, month],
	);
	const shownEntries = selectedDay
		? monthEntries.filter(
				(entry) => new Date(entry.measuredAt).getDate() === selectedDay,
			)
		: monthEntries;
	const daysInMonth = new Date(
		month.getFullYear(),
		month.getMonth() + 1,
		0,
	).getDate();
	const leadingDays = month.getDay();
	const measuredDays = new Set(
		monthEntries.map((entry) => new Date(entry.measuredAt).getDate()),
	);

	const exportCsv = () => {
		const rows = [
			["measured_at", "systolic", "diastolic", "pulse", "notes"],
			...measurements.map((entry) => [
				new Date(entry.measuredAt).toISOString(),
				entry.systolic,
				entry.diastolic,
				entry.pulse ?? "",
				`"${(entry.notes ?? "").replaceAll('"', '""')}"`,
			]),
		];
		const url = URL.createObjectURL(
			new Blob([rows.map((row) => row.join(",")).join("\n")], {
				type: "text/csv",
			}),
		);
		const anchor = document.createElement("a");
		anchor.href = url;
		anchor.download = `bp-diary-${new Date().toISOString().slice(0, 10)}.csv`;
		anchor.click();
		URL.revokeObjectURL(url);
	};

	return (
		<main className="page-shell">
			<header className="flex flex-wrap items-end justify-between gap-5">
				<div>
					<p className="eyebrow">Your history</p>
					<h1 className="page-title mt-2">Measurement diary</h1>
					<p className="mt-2 text-muted-foreground">
						Review, edit, and export your personal record.
					</p>
				</div>
				<div className="flex gap-3">
					<Button type="button" size="lg" onClick={exportCsv} variant="outline">
						<Download className="size-4" /> Export CSV
					</Button>
					<Button
						type="button"
						size="lg"
						onClick={() => {
							setEditing(null);
							setDialogOpen(true);
						}}
					>
						<Plus className="size-4" /> Add reading
					</Button>
				</div>
			</header>
			<div className="mt-8 grid gap-6 xl:grid-cols-2">
				<Card>
					<CardContent className="p-5 sm:p-7">
						<div className="flex items-center justify-between">
							<Button
								type="button"
								variant="ghost"
								size="icon"
								onClick={() => {
									setMonth(
										new Date(month.getFullYear(), month.getMonth() - 1, 1),
									);
									setSelectedDay(null);
								}}
								aria-label="Previous month"
							>
								<ChevronLeft />
							</Button>
							<h2 className="section-title">
								{new Intl.DateTimeFormat("en-AU", {
									month: "long",
									year: "numeric",
								}).format(month)}
							</h2>
							<Button
								type="button"
								variant="ghost"
								size="icon"
								onClick={() => {
									setMonth(
										new Date(month.getFullYear(), month.getMonth() + 1, 1),
									);
									setSelectedDay(null);
								}}
								aria-label="Next month"
							>
								<ChevronRight />
							</Button>
						</div>
						<div className="mt-6 grid grid-cols-7 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
							{["sun", "mon", "tue", "wed", "thu", "fri", "sat"].map((day) => (
								<span key={day}>{day.slice(0, 1)}</span>
							))}
						</div>
						<div className="mt-2 grid grid-cols-7 gap-1">
							{[
								"blank-a",
								"blank-b",
								"blank-c",
								"blank-d",
								"blank-e",
								"blank-f",
							]
								.slice(0, leadingDays)
								.map((key) => (
									<span key={key} />
								))}
							{Array.from({ length: daysInMonth }, (_, index) => index + 1).map(
								(day) => (
									<button
										type="button"
										key={day}
										onClick={() =>
											setSelectedDay(selectedDay === day ? null : day)
										}
										className={`calendar-day ${selectedDay === day ? "calendar-day-selected" : ""}`}
									>
										<span>{day}</span>
										{measuredDays.has(day) && <i />}
									</button>
								),
							)}
						</div>
						<p className="mt-5 text-center text-xs text-muted-foreground">
							{monthEntries.length}{" "}
							{monthEntries.length === 1 ? "measurement" : "measurements"} this
							month
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="p-5 sm:p-7">
						<div className="flex items-center justify-between">
							<div>
								<p className="eyebrow">
									{selectedDay ? "Selected day" : "This month"}
								</p>
								<h2 className="section-title mt-1">
									{selectedDay
										? `${selectedDay} ${new Intl.DateTimeFormat("en-AU", { month: "long" }).format(month)}`
										: "All readings"}
								</h2>
							</div>
							{selectedDay && (
								<Button
									type="button"
									variant="link"
									size="lg"
									className="px-0"
									onClick={() => setSelectedDay(null)}
								>
									Clear filter
								</Button>
							)}
						</div>
						<div className="mt-5 space-y-3">
							{shownEntries.map((entry) => (
								<Card key={entry.id} className="history-card">
									<div className="min-w-0 w-full">
										<time className="block pr-20 text-xs font-medium text-muted-foreground">
											{new Intl.DateTimeFormat("en-AU", {
												weekday: "short",
												day: "numeric",
												month: "short",
												hour: "numeric",
												minute: "2-digit",
											}).format(new Date(entry.measuredAt))}
										</time>
										<p className="mt-2 text-xl font-semibold tabular-nums">
											{entry.systolic}
											<span className="text-muted-foreground">
												{" "}
												/ {entry.diastolic}
											</span>{" "}
											<small className="text-xs font-normal text-muted-foreground">
												mmHg
											</small>
										</p>
										<p className="mt-1 text-sm text-muted-foreground">
											Pulse{" "}
											{entry.pulse ? `${entry.pulse} bpm` : "not recorded"}
										</p>
										{entry.notes && (
											<Tooltip>
												<TooltipTrigger
													render={
														<button
															type="button"
															className="mt-1 block w-full truncate rounded-sm text-left text-sm text-muted-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
														/>
													}
												>
													{entry.notes}
												</TooltipTrigger>
												<TooltipContent className="w-80 max-w-[calc(100vw-2rem)] whitespace-pre-wrap [overflow-wrap:anywhere]">
													{entry.notes}
												</TooltipContent>
											</Tooltip>
										)}
									</div>
									<div className="absolute top-3 right-3 flex gap-1 sm:top-4 sm:right-4">
										<Button
											type="button"
											variant="ghost"
											size="icon"
											aria-label="Edit measurement"
											onClick={() => {
												setEditing(entry);
												setDialogOpen(true);
											}}
										>
											<Pencil className="size-4" />
										</Button>
										<Button
											type="button"
											variant="ghost"
											size="icon"
											className="text-destructive"
											aria-label="Delete measurement"
											onClick={() =>
												window.confirm("Delete this measurement?") &&
												remove.mutate({ data: { id: entry.id } })
											}
										>
											<Trash2 className="size-4" />
										</Button>
									</div>
								</Card>
							))}
							{shownEntries.length === 0 && (
								<div className="rounded-3xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
									No measurements for this period.
								</div>
							)}
						</div>
					</CardContent>
				</Card>
			</div>
			<MeasurementDialog
				open={dialogOpen}
				onClose={() => setDialogOpen(false)}
				measurement={editing}
			/>
		</main>
	);
}
