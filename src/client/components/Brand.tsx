import { Activity } from "lucide-react";

export function Brand({ compact = false }: { compact?: boolean }) {
	return (
		<span className="inline-flex items-center gap-3 font-semibold text-foreground">
			<span className="grid size-10 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-[0_10px_24px_-12px_var(--primary)]">
				<Activity className="size-5" strokeWidth={2.4} />
			</span>
			{!compact && <span className="text-lg tracking-[-0.03em]">BP Diary</span>}
		</span>
	);
}
