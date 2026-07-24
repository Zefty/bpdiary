import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
	Activity,
	CalendarDays,
	Download,
	HeartPulse,
	LoaderCircle,
	LockKeyhole,
	TrendingUp,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Brand } from "@/client/components/Brand";
import { MeasurementChart } from "@/client/components/MeasurementChart";
import { Button } from "@/client/components/shadcn/button";
import { Card, CardContent } from "@/client/components/shadcn/card";
import { average } from "@/core/measurements/measurement";
import { getSharedDiary } from "@/server/sharing/diaryShares";
import { sharedDiaryQuery } from "@/web/data/sharedDiary";

export const Route = createFileRoute("/shared/$token")({
	loader: ({ context, params }) =>
		context.queryClient.ensureInfiniteQueryData(sharedDiaryQuery(params.token)),
	head: () => ({
		meta: [
			{ title: "Shared blood pressure diary — BP Diary" },
			{ name: "robots", content: "noindex, nofollow, noarchive" },
			{ name: "referrer", content: "no-referrer" },
			{
				name: "description",
				content:
					"A private, read-only blood pressure diary shared by its owner.",
			},
		],
	}),
	component: SharedDiaryPage,
});

function SharedDiaryPage() {
	const { token } = Route.useParams();
	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isFetchNextPageError,
	} = useSuspenseInfiniteQuery(sharedDiaryQuery(token));
	const loadMoreRef = useRef<HTMLDivElement>(null);
	const [isPreparingCsv, setIsPreparingCsv] = useState(false);
	const [csvError, setCsvError] = useState<string | null>(null);
	const firstPage = data.pages[0];
	const measurements = data.pages.flatMap((page) => page?.measurements ?? []);

	useEffect(() => {
		const loadMoreElement = loadMoreRef.current;
		if (!loadMoreElement || !hasNextPage || isFetchingNextPage) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry?.isIntersecting) void fetchNextPage();
			},
			{ rootMargin: "400px 0px" },
		);
		observer.observe(loadMoreElement);
		return () => observer.disconnect();
	}, [fetchNextPage, hasNextPage, isFetchingNextPage]);

	if (!firstPage) return <UnavailableShare />;

	const latest = measurements[0];
	const recent = measurements.slice(0, 7);
	const systolicAverage = average(recent.map((entry) => entry.systolic));
	const diastolicAverage = average(recent.map((entry) => entry.diastolic));
	const pulseAverage = average(recent.map((entry) => entry.pulse));
	const totalCount = firstPage.totalCount ?? measurements.length;
	const downloadCsv = async () => {
		setIsPreparingCsv(true);
		setCsvError(null);

		try {
			const exportMeasurements = [...measurements];
			let cursor = data.pages.at(-1)?.nextCursor ?? null;

			while (cursor) {
				const page = await getSharedDiary({ data: { token, cursor } });
				if (!page) throw new Error("This shared diary is no longer available.");

				exportMeasurements.push(...page.measurements);
				cursor = page.nextCursor;
			}

			saveMeasurementsCsv(exportMeasurements, firstPage.includeNotes);
		} catch {
			setCsvError("The CSV could not be prepared. Please try again.");
		} finally {
			setIsPreparingCsv(false);
		}
	};

	const saveMeasurementsCsv = (
		exportMeasurements: typeof measurements,
		includeNotes: boolean,
	) => {
		const headers = [
			"measured_at",
			"systolic",
			"diastolic",
			"pulse",
			...(includeNotes ? ["notes"] : []),
		];
		const rows = exportMeasurements.map((entry) => [
			new Date(entry.measuredAt).toISOString(),
			entry.systolic,
			entry.diastolic,
			entry.pulse ?? "",
			...(includeNotes ? [entry.notes ?? ""] : []),
		]);
		const csv = [headers, ...rows]
			.map((row) => row.map(toCsvCell).join(","))
			.join("\n");
		const url = URL.createObjectURL(
			new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" }),
		);
		const anchor = document.createElement("a");
		anchor.href = url;
		anchor.download = `bp-diary-shared-${new Date().toISOString().slice(0, 10)}.csv`;
		anchor.click();
		URL.revokeObjectURL(url);
	};

	return (
		<main className="min-h-dvh bg-[radial-gradient(circle_at_80%_0%,color-mix(in_oklch,var(--accent),transparent_45%),transparent_34%),var(--background)]">
			<nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
				<Link to="/" aria-label="BP Diary home">
					<Brand />
				</Link>
				<span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1.5 text-xs font-semibold text-muted-foreground shadow-sm backdrop-blur">
					<LockKeyhole className="size-3.5 text-primary" />
					Read-only diary
				</span>
			</nav>

			<div className="mx-auto max-w-6xl px-5 pb-16 pt-8 sm:px-8 sm:pt-12">
				<header className="flex flex-wrap items-end justify-between gap-5">
					<div className="max-w-3xl">
						<p className="eyebrow">Shared health record</p>
						<h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-balance sm:text-5xl">
							{firstPage.name}&apos;s blood pressure diary
						</h1>
						<p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">
							This private view was shared by the diary owner. It contains
							measurements and trends but cannot be edited.
						</p>
						<p className="mt-3 text-xs text-muted-foreground">
							Link expires{" "}
							{new Intl.DateTimeFormat("en-AU", {
								dateStyle: "long",
								timeStyle: "short",
							}).format(new Date(firstPage.expiresAt))}
						</p>
					</div>
					<Button
						type="button"
						size="lg"
						variant="outline"
						onClick={() => void downloadCsv()}
						disabled={isPreparingCsv}
					>
						{isPreparingCsv ? (
							<LoaderCircle className="size-4 animate-spin" />
						) : (
							<Download className="size-4" />
						)}
						{isPreparingCsv ? "Preparing CSV…" : "Download CSV"}
					</Button>
				</header>
				{csvError && (
					<p className="mt-3 text-right text-sm text-destructive" role="alert">
						{csvError}
					</p>
				)}

				<section
					className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
					aria-label="Measurement summary"
				>
					<SharedSummaryCard
						icon={Activity}
						label="Latest reading"
						value={latest ? `${latest.systolic}/${latest.diastolic}` : "—"}
						unit="mmHg"
						detail={
							latest
								? new Intl.DateTimeFormat("en-AU", {
										dateStyle: "medium",
										timeStyle: "short",
									}).format(new Date(latest.measuredAt))
								: "No readings shared"
						}
						tone="coral"
					/>
					<SharedSummaryCard
						icon={TrendingUp}
						label="7-reading average"
						value={
							systolicAverage !== null && diastolicAverage !== null
								? `${systolicAverage}/${diastolicAverage}`
								: "—"
						}
						unit="mmHg"
						detail={`Across ${recent.length} recent reading${recent.length === 1 ? "" : "s"}`}
						tone="blue"
					/>
					<SharedSummaryCard
						icon={HeartPulse}
						label="Average pulse"
						value={pulseAverage?.toString() ?? "—"}
						unit="bpm"
						detail="Across the 7 latest readings"
						tone="mint"
					/>
					<SharedSummaryCard
						icon={CalendarDays}
						label="Measurements"
						value={totalCount.toString()}
						unit="shared"
						detail={`${measurements.length} currently loaded`}
						tone="sand"
					/>
				</section>

				<Card className="mt-6 gap-0 rounded-[1.75rem] py-0 shadow-[0_18px_50px_-38px_rgba(30,43,55,0.45)]">
					<CardContent className="p-5 sm:p-7">
						<div className="flex flex-wrap items-start justify-between gap-4">
							<div>
								<p className="eyebrow">Trend</p>
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

				<section className="mt-6">
					<div>
						<p className="eyebrow">History</p>
						<h2 className="section-title mt-1">All measurements</h2>
					</div>
					<Card className="mt-4 gap-0 overflow-hidden py-0">
						<CardContent className="divide-y divide-border p-0">
							{measurements.map((entry) => (
								<article
									key={entry.id}
									className="grid gap-3 px-5 py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:px-6"
								>
									<div className="min-w-0">
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
										{firstPage.includeNotes && entry.notes && (
											<p className="mt-1 whitespace-pre-wrap text-sm leading-5 text-muted-foreground [overflow-wrap:anywhere]">
												{entry.notes}
											</p>
										)}
									</div>
									<div className="text-left sm:text-right">
										<p className="text-sm font-medium tabular-nums">
											{entry.pulse ? `${entry.pulse} bpm` : "Pulse —"}
										</p>
										<time className="mt-1 block text-xs text-muted-foreground">
											{new Intl.DateTimeFormat("en-AU", {
												dateStyle: "medium",
												timeStyle: "short",
											}).format(new Date(entry.measuredAt))}
										</time>
									</div>
								</article>
							))}
							{measurements.length === 0 && (
								<div className="px-6 py-12 text-center">
									<Activity className="mx-auto size-7 text-primary" />
									<p className="mt-3 font-medium">
										No measurements have been recorded
									</p>
								</div>
							)}
						</CardContent>
					</Card>
					<div ref={loadMoreRef} className="mt-4 flex justify-center">
						{hasNextPage ? (
							<Button
								type="button"
								variant="outline"
								onClick={() => void fetchNextPage()}
								disabled={isFetchingNextPage}
							>
								{isFetchingNextPage && (
									<LoaderCircle className="size-4 animate-spin" />
								)}
								{isFetchingNextPage
									? "Loading older measurements…"
									: isFetchNextPageError
										? "Try loading again"
										: "Load older measurements"}
							</Button>
						) : (
							measurements.length > 0 && (
								<p className="text-xs text-muted-foreground">
									Loaded {totalCount} measurements.
								</p>
							)
						)}
					</div>
				</section>

				<p className="mt-6 rounded-2xl bg-secondary/60 px-4 py-3 text-xs leading-5 text-muted-foreground">
					BP Diary is a personal record and does not diagnose conditions or
					replace advice from a qualified health professional.
				</p>
			</div>
		</main>
	);
}

function toCsvCell(value: string | number) {
	const text = String(value);
	const safeText = /^[=+\-@]/.test(text) ? `'${text}` : text;
	return `"${safeText.replaceAll('"', '""')}"`;
}

function SharedSummaryCard({
	icon: Icon,
	label,
	value,
	unit,
	detail,
	tone,
}: {
	icon: typeof Activity;
	label: string;
	value: string;
	unit: string;
	detail: string;
	tone: "blue" | "coral" | "mint" | "sand";
}) {
	return (
		<Card className="gap-0 rounded-[1.5rem] py-0">
			<CardContent className="p-5">
				<span className={`summary-icon summary-icon-${tone}`}>
					<Icon />
				</span>
				<p className="mt-4 text-sm text-muted-foreground">{label}</p>
				<div className="mt-1 flex items-baseline gap-2">
					<strong className="text-2xl font-semibold tracking-[-0.04em] tabular-nums">
						{value}
					</strong>
					<span className="text-xs text-muted-foreground">{unit}</span>
				</div>
				<p className="mt-2 text-xs text-muted-foreground">{detail}</p>
			</CardContent>
		</Card>
	);
}

function Legend({ color, label }: { color: string; label: string }) {
	return (
		<span className="inline-flex items-center gap-1.5">
			<i
				className="size-2 rounded-full"
				style={{ backgroundColor: color }}
				aria-hidden="true"
			/>
			{label}
		</span>
	);
}

function UnavailableShare() {
	return (
		<main className="grid min-h-dvh place-items-center bg-secondary/35 p-6 text-center">
			<Card className="w-full max-w-md shadow-xl">
				<CardContent className="p-8">
					<LockKeyhole className="mx-auto size-9 text-primary" />
					<h1 className="mt-5 text-2xl font-semibold">
						This diary link is unavailable
					</h1>
					<p className="mt-2 text-sm leading-6 text-muted-foreground">
						It may have expired, been revoked, or the address may be incomplete.
						Ask the diary owner for a new link.
					</p>
					<Link
						to="/"
						className="mt-6 inline-flex text-sm font-semibold text-primary hover:underline"
					>
						Go to BP Diary
					</Link>
				</CardContent>
			</Card>
		</main>
	);
}
