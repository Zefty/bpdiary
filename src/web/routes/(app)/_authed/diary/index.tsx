import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
	Activity,
	CalendarDays,
	HeartPulse,
	Plus,
	TrendingDown,
	TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { MeasurementChart } from "@/client/components/MeasurementChart";
import { MeasurementDialog } from "@/client/components/MeasurementDialog";
import { Button } from "@/client/components/shadcn/button";
import { Card, CardContent } from "@/client/components/shadcn/card";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/client/components/shadcn/tooltip";
import { average, measurementTrend } from "@/core/measurements/measurement";
import type { MeasurementRecord } from "@/server/db/schema";
import { diary } from "@/web/data/diary";

export const Route = createFileRoute("/(app)/_authed/diary/")({
	loader: ({ context }) =>
		context.queryClient.ensureQueryData(diary.queries.measurements()),
	component: DashboardPage,
});

function formatReading(entry?: MeasurementRecord) {
	return entry ? `${entry.systolic}/${entry.diastolic}` : "—";
}

function DashboardPage() {
	const { data: measurements } = useSuspenseQuery(diary.queries.measurements());
	const routeContext = Route.useRouteContext();
	const [dialogOpen, setDialogOpen] = useState(false);
	const [editing, setEditing] = useState<MeasurementRecord | null>(null);
	const latest = measurements[0];
	const recent = measurements.slice(0, 7);
	const previous = measurements.slice(7, 14);
	const systolicAverage = average(recent.map((entry) => entry.systolic));
	const diastolicAverage = average(recent.map((entry) => entry.diastolic));
	const pulseAverage = average(recent.map((entry) => entry.pulse));
	const systolicTrend = measurementTrend(
		systolicAverage,
		average(previous.map((entry) => entry.systolic)),
	);
	const name = routeContext.user?.name?.split(" ")[0] || "there";
	const greeting =
		new Date().getHours() < 12
			? "Good morning"
			: new Date().getHours() < 18
				? "Good afternoon"
				: "Good evening";

	const openNew = () => {
		setEditing(null);
		setDialogOpen(true);
	};

	return (
		<main className="page-shell">
			<header className="flex flex-wrap items-end justify-between gap-5">
				<div>
					<p className="eyebrow">Today&apos;s overview</p>
					<h1 className="page-title mt-2">
						{greeting}, {name}.
					</h1>
					<p className="mt-2 text-muted-foreground">
						A calm view of your recent readings and routines.
					</p>
				</div>
				<Button
					type="button"
					onClick={openNew}
					size="lg"
					className="h-11 rounded-2xl px-5"
				>
					<Plus className="size-4" /> Log measurement
				</Button>
			</header>

			<section
				className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
				aria-label="Measurement summary"
			>
				<SummaryCard
					icon={Activity}
					label="Latest reading"
					value={formatReading(latest)}
					unit="mmHg"
					detail={
						latest
							? new Intl.DateTimeFormat("en-AU", {
									weekday: "short",
									hour: "numeric",
									minute: "2-digit",
								}).format(new Date(latest.measuredAt))
							: "No readings yet"
					}
					tone="coral"
				/>
				<SummaryCard
					icon={TrendingUp}
					label="7-reading average"
					value={
						systolicAverage && diastolicAverage
							? `${systolicAverage}/${diastolicAverage}`
							: "—"
					}
					unit="mmHg"
					detail={
						systolicTrend === null
							? "Add more data for a comparison"
							: `${Math.abs(systolicTrend)} systolic points ${systolicTrend <= 0 ? "lower" : "higher"}`
					}
					tone="blue"
					trend={systolicTrend}
				/>
				<SummaryCard
					icon={HeartPulse}
					label="Average pulse"
					value={pulseAverage?.toString() ?? "—"}
					unit="bpm"
					detail="Across your 7 latest readings"
					tone="mint"
				/>
				<SummaryCard
					icon={CalendarDays}
					label="Measurements"
					value={measurements.length.toString()}
					unit="total"
					detail={`${measurements.filter((entry) => new Date(entry.measuredAt).getMonth() === new Date().getMonth()).length} recorded this month`}
					tone="sand"
				/>
			</section>

			<div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(20rem,0.75fr)]">
				<Card className="gap-0 rounded-[1.75rem] py-0 shadow-[0_18px_50px_-38px_rgba(30,43,55,0.45)]">
					<CardContent className="p-5 sm:p-7">
						<div className="flex flex-wrap items-start justify-between gap-4">
							<div>
								<p className="eyebrow">Your trend</p>
								<h2 className="section-title mt-1">Blood pressure over time</h2>
							</div>
							<div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
								<Legend color="var(--chart-systolic)" label="Systolic" />
								<Legend color="var(--chart-diastolic)" label="Diastolic" />
								<Legend color="var(--chart-pulse)" label="Pulse" />
							</div>
						</div>
						<div className="mt-5">
							<MeasurementChart measurements={measurements} />
						</div>
					</CardContent>
				</Card>

				<Card className="min-h-[26rem] gap-0 rounded-[1.75rem] py-0 shadow-[0_18px_50px_-38px_rgba(30,43,55,0.45)]">
					<CardContent className="flex h-full flex-1 flex-col p-5 sm:p-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="eyebrow">Recent</p>
								<h2 className="section-title mt-1">Measurements</h2>
							</div>
							<Link
								to="/diary/calendar"
								className="text-sm font-semibold text-primary hover:underline"
							>
								View all
							</Link>
						</div>
						<div className="mt-5 space-y-3">
							{measurements.slice(0, 5).map((entry) => (
								<button
									key={entry.id}
									type="button"
									onClick={() => {
										setEditing(entry);
										setDialogOpen(true);
									}}
									className="measurement-row w-full text-left"
								>
									<div className="min-w-0 flex-1">
										<p className="font-semibold tabular-nums">
											{entry.systolic}
											<span className="text-muted-foreground">
												{" "}
												/ {entry.diastolic}
											</span>{" "}
											<small className="font-normal text-muted-foreground">
												mmHg
											</small>
										</p>
										{entry.notes ? (
											<Tooltip>
												<TooltipTrigger
													render={
														<span className="mt-1 block w-full truncate text-xs text-muted-foreground" />
													}
												>
													{entry.notes}
												</TooltipTrigger>
												<TooltipContent className="w-80 max-w-[calc(100vw-2rem)] whitespace-pre-wrap [overflow-wrap:anywhere]">
													{entry.notes}
												</TooltipContent>
											</Tooltip>
										) : (
											<p className="mt-1 text-xs text-muted-foreground">
												No notes
											</p>
										)}
									</div>
									<div className="shrink-0 text-right">
										<p className="text-sm font-medium tabular-nums">
											{entry.pulse ? `${entry.pulse} bpm` : "—"}
										</p>
										<time className="mt-1 block text-xs text-muted-foreground">
											{new Intl.DateTimeFormat("en-AU", {
												day: "numeric",
												month: "short",
												hour: "numeric",
												minute: "2-digit",
											}).format(new Date(entry.measuredAt))}
										</time>
									</div>
								</button>
							))}
							{measurements.length === 0 && (
								<EmptyMeasurements onAdd={openNew} />
							)}
						</div>
					</CardContent>
				</Card>
			</div>

			<p className="mt-6 rounded-2xl bg-secondary/60 px-4 py-3 text-xs leading-5 text-muted-foreground">
				BP Diary helps you keep a personal record. It does not diagnose
				conditions or replace advice from a qualified health professional.
			</p>
			<MeasurementDialog
				open={dialogOpen}
				onClose={() => setDialogOpen(false)}
				measurement={editing}
			/>
		</main>
	);
}

function SummaryCard({
	icon: Icon,
	label,
	value,
	unit,
	detail,
	tone,
	trend,
}: {
	icon: typeof Activity;
	label: string;
	value: string;
	unit: string;
	detail: string;
	tone: string;
	trend?: number | null;
}) {
	return (
		<Card className="gap-0 rounded-[1.75rem] py-0 shadow-[0_18px_50px_-38px_rgba(30,43,55,0.45)]">
			<CardContent className="p-5">
				<div className={`summary-icon summary-icon-${tone}`}>
					<Icon className="size-5" />
				</div>
				<p className="mt-5 text-sm font-medium text-muted-foreground">
					{label}
				</p>
				<div className="mt-1 flex items-baseline gap-2">
					<strong className="text-3xl tracking-[-0.04em] tabular-nums">
						{value}
					</strong>
					<span className="text-sm text-muted-foreground">{unit}</span>
				</div>
				<p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
					{trend !== undefined &&
						trend !== null &&
						(trend <= 0 ? (
							<TrendingDown className="size-3.5 text-emerald-600" />
						) : (
							<TrendingUp className="size-3.5 text-amber-600" />
						))}
					{detail}
				</p>
			</CardContent>
		</Card>
	);
}

function Legend({ color, label }: { color: string; label: string }) {
	return (
		<span className="inline-flex items-center gap-1.5">
			<i className="size-2 rounded-full" style={{ background: color }} />
			{label}
		</span>
	);
}

function EmptyMeasurements({ onAdd }: { onAdd: () => void }) {
	return (
		<div className="rounded-3xl border border-dashed border-border p-6 text-center">
			<Activity className="mx-auto size-6 text-primary" />
			<p className="mt-3 font-medium">Start your diary</p>
			<p className="mt-1 text-sm text-muted-foreground">
				Your first reading only takes a moment.
			</p>
			<Button
				type="button"
				variant="outline"
				className="mt-4 rounded-2xl"
				onClick={onAdd}
			>
				Add a reading
			</Button>
		</div>
	);
}
