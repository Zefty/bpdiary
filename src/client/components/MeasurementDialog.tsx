import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LoaderCircle, X } from "lucide-react";
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
import type { MeasurementRecord } from "@/server/db/schema";
import { saveMeasurement } from "@/server/measurements/measurements";

interface MeasurementDialogProps {
	open: boolean;
	onClose: () => void;
	measurement?: MeasurementRecord | null;
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
				className="flex h-[min(94dvh,42rem)] flex-col overflow-hidden rounded-[2rem] p-6 sm:max-w-xl sm:p-8"
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
						Record the reading exactly as it appears on your monitor.
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
					className="mt-3 flex min-h-0 flex-1 flex-col overflow-hidden"
					onSubmit={handleSubmit}
				>
					<ScrollArea className="h-full min-h-0 flex-1">
						<div className="space-y-5 py-4 pr-4 pl-1">
							<Field>
								<FieldLabel htmlFor="measuredAt">Measured at</FieldLabel>
								<Input
									id="measuredAt"
									name="measuredAt"
									type="datetime-local"
									className="h-11 rounded-2xl"
									required
									defaultValue={toLocalInputValue(
										measurement?.measuredAt ?? new Date(),
									)}
								/>
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
											className="h-11 rounded-2xl pr-14"
											defaultValue={measurement?.systolic ?? 120}
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
											className="h-11 rounded-2xl pr-14"
											defaultValue={measurement?.diastolic ?? 80}
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
											className="h-11 rounded-2xl pr-14"
											defaultValue={measurement?.pulse ?? ""}
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
									className="rounded-2xl"
									placeholder="After waking, before medication…"
									defaultValue={measurement?.notes ?? ""}
								/>
							</Field>
							<FieldError className="rounded-2xl bg-destructive/10 px-4 py-3">
								{mutation.error?.message}
							</FieldError>
						</div>
					</ScrollArea>
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
				</form>
			</DialogContent>
		</Dialog>
	);
}
