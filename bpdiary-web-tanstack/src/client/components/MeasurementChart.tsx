import {
	CartesianGrid,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import type { MeasurementRecord } from "@/server/db/schema";

export function MeasurementChart({
	measurements,
}: {
	measurements: MeasurementRecord[];
}) {
	const data = [...measurements.slice(0, 30)].reverse().map((entry) => ({
		date: new Intl.DateTimeFormat("en-AU", {
			day: "numeric",
			month: "short",
		}).format(new Date(entry.measuredAt)),
		systolic: entry.systolic,
		diastolic: entry.diastolic,
		pulse: entry.pulse,
	}));

	if (data.length < 2) {
		return (
			<div className="grid h-72 place-items-center rounded-3xl border border-dashed border-border bg-secondary/35 px-6 text-center">
				<div>
					<p className="font-medium">Your trend will appear here</p>
					<p className="mt-1 text-sm text-muted-foreground">
						Add at least two measurements to begin charting.
					</p>
				</div>
			</div>
		);
	}

	return (
		<div
			className="h-72 w-full"
			role="img"
			aria-label="Blood pressure and pulse trend chart"
		>
			<ResponsiveContainer width="100%" height="100%">
				<LineChart
					data={data}
					margin={{ top: 12, right: 12, bottom: 0, left: -18 }}
				>
					<CartesianGrid
						vertical={false}
						stroke="var(--border)"
						strokeDasharray="4 6"
					/>
					<XAxis
						dataKey="date"
						axisLine={false}
						tickLine={false}
						tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
						minTickGap={24}
					/>
					<YAxis
						axisLine={false}
						tickLine={false}
						tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
						domain={[40, "auto"]}
					/>
					<Tooltip
						contentStyle={{
							borderRadius: 16,
							borderColor: "var(--border)",
							background: "var(--card)",
							fontSize: 12,
						}}
					/>
					<Line
						type="monotone"
						dataKey="systolic"
						stroke="var(--chart-systolic)"
						strokeWidth={2.5}
						dot={false}
					/>
					<Line
						type="monotone"
						dataKey="diastolic"
						stroke="var(--chart-diastolic)"
						strokeWidth={2.5}
						dot={false}
					/>
					<Line
						type="monotone"
						dataKey="pulse"
						stroke="var(--chart-pulse)"
						strokeWidth={2.5}
						dot={false}
					/>
				</LineChart>
			</ResponsiveContainer>
		</div>
	);
}
