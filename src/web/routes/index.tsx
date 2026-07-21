import { createFileRoute, Link } from "@tanstack/react-router";
import {
	Activity,
	ArrowRight,
	CalendarDays,
	Check,
	type HeartPulse,
	LockKeyhole,
	NotebookPen,
} from "lucide-react";
import { Brand } from "@/client/components/Brand";
import { Badge } from "@/client/components/shadcn/badge";
import { Button } from "@/client/components/shadcn/button";
import { Card, CardContent } from "@/client/components/shadcn/card";

export const Route = createFileRoute("/")({ component: LandingPage });

function LandingPage() {
	const { session } = Route.useRouteContext();
	return (
		<main className="min-h-dvh overflow-hidden bg-[radial-gradient(circle_at_80%_0%,color-mix(in_oklch,var(--accent),transparent_35%),transparent_35%),var(--background)]">
			<nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
				<Brand />
				<div className="flex items-center gap-3">
					<a
						href="#features"
						className="hidden text-sm font-medium text-muted-foreground hover:text-foreground sm:block"
					>
						Features
					</a>
					<Button
						nativeButton={false}
						render={<Link to={session ? "/diary" : "/login"} />}
						variant="outline"
						size="lg"
					>
						{session ? "Open diary" : "Sign in"}
					</Button>
				</div>
			</nav>
			<section className="mx-auto grid max-w-7xl items-center gap-14 px-5 pb-20 pt-14 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:pb-28 lg:pt-24">
				<div className="relative z-10">
					<p className="eyebrow">Better awareness, one reading at a time</p>
					<h1 className="mt-5 max-w-2xl text-5xl font-semibold leading-[0.98] tracking-[-0.06em] text-balance sm:text-7xl">
						Blood pressure tracking that feels{" "}
						<span className="text-primary">human.</span>
					</h1>
					<p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
						A private, thoughtfully designed diary for your readings, notes,
						routines, and long-term trends.
					</p>
					<div className="mt-8 flex flex-wrap gap-3">
						<Button
							nativeButton={false}
							render={<Link to={session ? "/diary" : "/login"} />}
							size="lg"
							className="h-12 px-6"
						>
							{session ? "Go to your diary" : "Start your diary"}
							<ArrowRight className="size-4" />
						</Button>
						<Button
							nativeButton={false}
							render={<a href="#features" />}
							variant="outline"
							size="lg"
							className="h-12 px-6"
						>
							See how it works
						</Button>
					</div>
					<p className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
						<LockKeyhole className="size-3.5" /> Your records belong to your
						account.
					</p>
				</div>
				<DashboardPreview />
			</section>
			<section id="features" className="border-t border-border/60 bg-card/50">
				<div className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
					<div className="max-w-xl">
						<p className="eyebrow">Everything in one calm place</p>
						<h2 className="mt-3 text-4xl font-semibold tracking-[-0.05em]">
							Made for the moments between appointments.
						</h2>
					</div>
					<div className="mt-10 grid gap-4 md:grid-cols-3">
						<Feature icon={NotebookPen} title="Frictionless logging">
							Capture systolic, diastolic, pulse, time, and context in seconds.
						</Feature>
						<Feature icon={Activity} title="Trends you can read">
							See recent movement without turning your health diary into a
							spreadsheet.
						</Feature>
						<Feature icon={CalendarDays} title="A complete history">
							Review days and months, edit mistakes, and export a portable CSV
							record.
						</Feature>
					</div>
				</div>
			</section>
			<footer className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-8 text-sm text-muted-foreground sm:px-8">
				<Brand compact />
				<p>Personal tracking only — not a medical diagnosis.</p>
			</footer>
		</main>
	);
}

function DashboardPreview() {
	return (
		<div className="relative mx-auto w-full max-w-3xl lg:translate-x-8">
			<div className="absolute -inset-10 -z-10 rounded-full bg-primary/10 blur-3xl" />
			<div className="rotate-[1.2deg] rounded-[2rem] border border-white/80 bg-card/90 p-3 shadow-[0_40px_100px_-45px_rgba(35,52,64,0.55)] backdrop-blur sm:p-5">
				<div className="rounded-[1.5rem] bg-secondary/55 p-4 sm:p-6">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">
								Today
							</p>
							<h2 className="mt-1 text-xl font-semibold">
								Good morning, Alex.
							</h2>
						</div>
						<span className="grid size-10 place-items-center rounded-2xl bg-primary text-primary-foreground">
							<Activity className="size-5" />
						</span>
					</div>
					<div className="mt-6 grid grid-cols-3 gap-2 sm:gap-3">
						<PreviewMetric
							label="Latest"
							value="124/78"
							unit="mmHg"
							tone="coral"
						/>
						<PreviewMetric label="Pulse" value="68" unit="bpm" tone="mint" />
						<PreviewMetric
							label="This month"
							value="18"
							unit="checks"
							tone="blue"
						/>
					</div>
					<div className="mt-3 rounded-3xl bg-card p-4 shadow-sm sm:p-5">
						<div className="flex items-center justify-between">
							<p className="font-semibold">Your recent trend</p>
							<Badge
								variant="secondary"
								className="bg-emerald-500/10 text-emerald-700"
							>
								Steady routine
							</Badge>
						</div>
						<div className="mt-5 flex h-28 items-end gap-2" aria-hidden="true">
							{[
								["a", 52],
								["b", 58],
								["c", 48],
								["d", 65],
								["e", 61],
								["f", 70],
								["g", 67],
								["h", 76],
								["i", 72],
								["j", 81],
								["k", 74],
								["l", 86],
							].map(([key, height]) => (
								<div
									key={key}
									className="flex flex-1 flex-col justify-end gap-1"
								>
									<i
										className="w-full rounded-full bg-primary/80"
										style={{ height: `${height}%` }}
									/>
									<i className="h-2 w-full rounded-full bg-accent" />
								</div>
							))}
						</div>
						<div className="mt-4 flex gap-4 text-[0.65rem] text-muted-foreground">
							<span className="flex items-center gap-1">
								<i className="size-2 rounded-full bg-primary" /> Systolic
							</span>
							<span className="flex items-center gap-1">
								<i className="size-2 rounded-full bg-accent" /> Diastolic
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

function PreviewMetric({
	label,
	value,
	unit,
	tone,
}: {
	label: string;
	value: string;
	unit: string;
	tone: string;
}) {
	return (
		<div className="rounded-2xl bg-card p-3 shadow-sm sm:p-4">
			<span className={`block h-1.5 w-8 rounded-full preview-${tone}`} />
			<p className="mt-3 text-[0.65rem] font-medium text-muted-foreground sm:text-xs">
				{label}
			</p>
			<p className="mt-1 text-lg font-semibold tracking-tight sm:text-2xl">
				{value}
			</p>
			<p className="text-[0.6rem] text-muted-foreground sm:text-[0.7rem]">
				{unit}
			</p>
		</div>
	);
}

function Feature({
	icon: Icon,
	title,
	children,
}: {
	icon: typeof HeartPulse;
	title: string;
	children: React.ReactNode;
}) {
	return (
		<Card>
			<CardContent className="p-6">
				<span className="summary-icon summary-icon-coral">
					<Icon />
				</span>
				<h3 className="mt-5 text-lg font-semibold">{title}</h3>
				<p className="mt-2 text-sm leading-6 text-muted-foreground">
					{children}
				</p>
				<p className="mt-4 flex items-center gap-2 text-xs font-semibold text-primary">
					<Check className="size-3.5" /> Included from day one
				</p>
			</CardContent>
		</Card>
	);
}
