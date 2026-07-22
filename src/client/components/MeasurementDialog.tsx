import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Camera, Keyboard, LoaderCircle, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { MeasurementPhotoCapture } from "@/client/components/MeasurementPhotoCapture";
import { Button } from "@/client/components/shadcn/button";
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
import { Textarea } from "@/client/components/shadcn/textarea";
import type { ExtractedReading } from "@/core/measurements/extractedReading";
import type { MeasurementRecord } from "@/server/db/schema";
import { saveMeasurement } from "@/server/measurements/measurements";

interface MeasurementDialogProps {
	open: boolean;
	onClose: () => void;
	measurement?: MeasurementRecord | null;
}

type EntryMethod = "choose" | "photo" | "manual";

interface EntryMethodChoiceProps {
	onPhoto: () => void;
	onManual: () => void;
}

function EntryMethodChoice({ onPhoto, onManual }: EntryMethodChoiceProps) {
	return (
		<div className="flex h-full min-h-0 flex-col py-4">
			<Button
				type="button"
				variant="ghost"
				onClick={onPhoto}
				className="h-auto w-full flex-1 flex-col justify-center gap-3 rounded-2xl px-6 py-6 text-center whitespace-normal hover:bg-primary/5"
			>
				<span className="flex size-12 shrink-0 items-center justify-center text-primary">
					<Camera className="size-7" />
				</span>
				<span className="max-w-sm">
					<span className="block text-base font-semibold">Use a photo</span>
					<span className="mt-1 block text-sm leading-relaxed font-normal text-muted-foreground">
						Take or choose a clear photo of the monitor screen and we'll fill in
						the reading.
					</span>
				</span>
			</Button>

			<div className="flex items-center gap-3 py-6" aria-hidden="true">
				<div className="h-px flex-1 bg-border" />
				<span className="text-xs font-semibold tracking-[0.18em] text-muted-foreground">
					OR
				</span>
				<div className="h-px flex-1 bg-border" />
			</div>

			<Button
				type="button"
				variant="ghost"
				onClick={onManual}
				className="h-auto w-full flex-1 flex-col justify-center gap-3 rounded-2xl px-6 py-6 text-center whitespace-normal hover:bg-primary/5"
			>
				<span className="flex size-12 shrink-0 items-center justify-center text-primary">
					<Keyboard className="size-7" />
				</span>
				<span className="max-w-sm">
					<span className="block text-base font-semibold">Enter manually</span>
					<span className="mt-1 block text-sm leading-relaxed font-normal text-muted-foreground">
						Type the numbers shown on your blood pressure monitor.
					</span>
				</span>
			</Button>
		</div>
	);
}

function toLocalInputValue(date: Date) {
	const offset = date.getTimezoneOffset() * 60_000;
	return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

export function MeasurementDialog({
	open,
	onClose,
	measurement,
}: MeasurementDialogProps) {
	const queryClient = useQueryClient();
	const [reading, setReading] = useState({
		systolic: "120",
		diastolic: "80",
		pulse: "",
	});
	const [scanWarnings, setScanWarnings] = useState<string[]>([]);
	const [entryMethod, setEntryMethod] = useState<EntryMethod>(
		measurement ? "manual" : "choose",
	);
	const dirtyFields = useRef(new Set<keyof typeof reading>());

	useEffect(() => {
		if (!open) return;
		setReading({
			systolic: String(measurement?.systolic ?? 120),
			diastolic: String(measurement?.diastolic ?? 80),
			pulse: measurement?.pulse ? String(measurement.pulse) : "",
		});
		setScanWarnings([]);
		setEntryMethod(measurement ? "manual" : "choose");
		dirtyFields.current.clear();
	}, [open, measurement]);

	const updateReading = (field: keyof typeof reading, value: string) => {
		dirtyFields.current.add(field);
		setReading((current) => ({ ...current, [field]: value }));
	};

	const applyExtractedReading = (extracted: ExtractedReading) => {
		setReading((current) => ({
			systolic: !dirtyFields.current.has("systolic")
				? extracted.systolic === null
					? ""
					: String(extracted.systolic)
				: current.systolic,
			diastolic: !dirtyFields.current.has("diastolic")
				? extracted.diastolic === null
					? ""
					: String(extracted.diastolic)
				: current.diastolic,
			pulse: !dirtyFields.current.has("pulse")
				? extracted.pulse === null
					? ""
					: String(extracted.pulse)
				: current.pulse,
		}));
		setScanWarnings(extracted.warnings);
	};

	const selectEntryMethod = (method: Exclude<EntryMethod, "choose">) => {
		setEntryMethod(method);
		setScanWarnings([]);
	};

	const mutation = useMutation({
		mutationFn: saveMeasurement,
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["measurements"] });
			onClose();
		},
	});

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const form = new FormData(event.currentTarget);
		mutation.mutate({
			data: {
				id: measurement?.id,
				measuredAt: new Date(String(form.get("measuredAt"))).toISOString(),
				systolic: Number(form.get("systolic")),
				diastolic: Number(form.get("diastolic")),
				pulse: form.get("pulse") ? Number(form.get("pulse")) : null,
				notes: String(form.get("notes") || ""),
			},
		});
	};

	return (
		<Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
			<DialogContent
				className="flex h-[min(94dvh,42rem)] flex-col overflow-hidden p-6 sm:max-w-xl sm:p-8"
				showCloseButton={false}
			>
				<DialogHeader className="relative pr-12 text-left">
					<p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
						Daily check-in
					</p>
					<DialogTitle className="mt-1 text-2xl font-semibold tracking-tight">
						{measurement ? "Edit measurement" : "Log a measurement"}
					</DialogTitle>
					<DialogDescription className="mt-2">
						{!measurement && entryMethod === "choose"
							? "How would you like to add this reading?"
							: "Record the reading exactly as it appears on your monitor."}
					</DialogDescription>
					<Button
						type="button"
						onClick={onClose}
						variant="secondary"
						size="icon-lg"
						className="absolute top-0 right-0 rounded-2xl"
						aria-label="Close dialog"
					>
						<X className="size-4" />
					</Button>
				</DialogHeader>
				<form
					key={measurement?.id ?? "new"}
					className="flex min-h-0 flex-1 flex-col overflow-hidden"
					onSubmit={handleSubmit}
				>
					<ScrollArea className="h-full min-h-0 flex-1">
						<div
							className={
								!measurement && entryMethod === "choose"
									? "h-full pr-4"
									: "space-y-5 pr-4"
							}
						>
							{!measurement && entryMethod === "choose" ? (
								<EntryMethodChoice
									onPhoto={() => selectEntryMethod("photo")}
									onManual={() => selectEntryMethod("manual")}
								/>
							) : (
								<>
									{!measurement && (
										<div className="space-y-3 pt-4">
											<Button
												type="button"
												variant="ghost"
												size="sm"
												className="ml-auto rounded-xl"
												onClick={() =>
													selectEntryMethod(
														entryMethod === "photo" ? "manual" : "photo",
													)
												}
											>
												{entryMethod === "photo" ? (
													<Keyboard className="size-4" />
												) : (
													<Camera className="size-4" />
												)}
												{entryMethod === "photo"
													? "Enter manually instead"
													: "Use a photo instead"}
											</Button>
											{entryMethod === "photo" && (
												<MeasurementPhotoCapture
													onExtracted={applyExtractedReading}
												/>
											)}
										</div>
									)}
									<Field>
										<FieldLabel htmlFor="measuredAt">Measured at</FieldLabel>
										<div className="min-w-0 max-w-full overflow-hidden rounded-2xl">
											<Input
												id="measuredAt"
												name="measuredAt"
												type="datetime-local"
												className="h-11 max-w-full rounded-2xl focus-visible:ring-inset"
												required
												defaultValue={toLocalInputValue(
													measurement?.measuredAt ?? new Date(),
												)}
											/>
										</div>
									</Field>
									<div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
										<Field>
											<FieldLabel htmlFor="systolic">Systolic</FieldLabel>
											<div className="input-with-unit">
												<Input
													id="systolic"
													name="systolic"
													type="number"
													min="50"
													max="300"
													required
													className="h-11 rounded-2xl pr-14 focus-visible:ring-inset"
													value={reading.systolic}
													onChange={(event) =>
														updateReading("systolic", event.target.value)
													}
												/>
												<small>mmHg</small>
											</div>
										</Field>
										<Field>
											<FieldLabel htmlFor="diastolic">Diastolic</FieldLabel>
											<div className="input-with-unit">
												<Input
													id="diastolic"
													name="diastolic"
													type="number"
													min="30"
													max="200"
													required
													className="h-11 rounded-2xl pr-14 focus-visible:ring-inset"
													value={reading.diastolic}
													onChange={(event) =>
														updateReading("diastolic", event.target.value)
													}
												/>
												<small>mmHg</small>
											</div>
										</Field>
										<Field className="col-span-2 sm:col-span-1">
											<FieldLabel htmlFor="pulse">
												Pulse <em>optional</em>
											</FieldLabel>
											<div className="input-with-unit">
												<Input
													id="pulse"
													name="pulse"
													type="number"
													min="20"
													max="250"
													className="h-11 rounded-2xl pr-14 focus-visible:ring-inset"
													value={reading.pulse}
													onChange={(event) =>
														updateReading("pulse", event.target.value)
													}
												/>
												<small>bpm</small>
											</div>
										</Field>
									</div>
									<Field>
										<FieldLabel htmlFor="notes">
											Notes <em>optional</em>
										</FieldLabel>
										<Textarea
											id="notes"
											name="notes"
											rows={3}
											maxLength={500}
											className="rounded-2xl focus-visible:ring-inset"
											placeholder="After waking, before medication…"
											defaultValue={measurement?.notes ?? ""}
										/>
									</Field>
									{scanWarnings.length > 0 && (
										<div
											role="status"
											className="rounded-2xl bg-amber-500/10 px-4 py-3 text-sm text-amber-900 dark:text-amber-200"
										>
											<p className="font-medium">Check the scanned reading</p>
											<ul className="mt-1 list-disc pl-5">
												{scanWarnings.map((warning) => (
													<li key={warning}>{warning}</li>
												))}
											</ul>
										</div>
									)}
									<FieldError className="rounded-2xl bg-destructive/10 px-4 py-3">
										{mutation.error?.message}
									</FieldError>
								</>
							)}
						</div>
					</ScrollArea>
					{(measurement || entryMethod !== "choose") && (
						<DialogFooter className="mx-0 mb-0 shrink-0 border-0 bg-transparent p-0 pt-4 sm:justify-end">
							<Button
								type="button"
								variant="outline"
								size="lg"
								className="h-10 rounded-2xl px-4"
								onClick={onClose}
							>
								Cancel
							</Button>
							<Button
								type="submit"
								size="lg"
								className="h-10 min-w-36 rounded-2xl px-4"
								disabled={mutation.isPending}
							>
								{mutation.isPending ? (
									<>
										<LoaderCircle className="size-4 animate-spin" /> Saving
									</>
								) : measurement ? (
									"Save changes"
								) : (
									"Add measurement"
								)}
							</Button>
						</DialogFooter>
					)}
				</form>
			</DialogContent>
		</Dialog>
	);
}
