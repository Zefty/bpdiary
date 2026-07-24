import {
	useMutation,
	useQueryClient,
	useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
	Check,
	Copy,
	Link2,
	LoaderCircle,
	Mail,
	Moon,
	ShieldCheck,
	Sun,
	Trash2,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/client/components/shadcn/button";
import { Card, CardContent } from "@/client/components/shadcn/card";
import { Field, FieldLabel } from "@/client/components/shadcn/field";
import { Input } from "@/client/components/shadcn/input";
import { useTheme } from "@/client/contexts/ThemeContext";
import { updateProfile } from "@/server/profile/profile";
import {
	createDiaryShare,
	revokeDiaryShare,
} from "@/server/sharing/diaryShares";
import { diary } from "@/web/data/diary";

export const Route = createFileRoute("/(app)/_authed/diary/settings")({
	loader: ({ context }) =>
		Promise.all([
			context.queryClient.ensureQueryData(diary.queries.profile()),
			context.queryClient.ensureQueryData(diary.queries.activeShare()),
		]),
	component: SettingsPage,
});

function SettingsPage() {
	const { data: profile } = useSuspenseQuery(diary.queries.profile());
	const { data: activeShare } = useSuspenseQuery(diary.queries.activeShare());
	const queryClient = useQueryClient();
	const [saved, setSaved] = useState(false);
	const [includeNotes, setIncludeNotes] = useState(false);
	const [generatedShareUrl, setGeneratedShareUrl] = useState<string | null>(
		null,
	);
	const [copied, setCopied] = useState(false);
	const { theme, setTheme } = useTheme();
	const mutation = useMutation({
		mutationFn: updateProfile,
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["profile"] });
			setSaved(true);
			setTimeout(() => setSaved(false), 2200);
		},
	});
	const createShare = useMutation({
		mutationFn: createDiaryShare,
		onSuccess: async (result) => {
			setGeneratedShareUrl(
				new URL(`/shared/${result.token}`, window.location.origin).toString(),
			);
			setCopied(false);
			await queryClient.invalidateQueries({ queryKey: ["diary-share"] });
		},
	});
	const revokeShare = useMutation({
		mutationFn: revokeDiaryShare,
		onSuccess: async () => {
			setGeneratedShareUrl(null);
			setCopied(false);
			await queryClient.invalidateQueries({ queryKey: ["diary-share"] });
		},
	});
	const copyShareLink = async () => {
		if (!generatedShareUrl) return;
		try {
			if (!navigator.clipboard) throw new Error("Clipboard API unavailable");
			await navigator.clipboard.writeText(generatedShareUrl);
		} catch {
			const input = document.createElement("textarea");
			input.value = generatedShareUrl;
			input.style.position = "fixed";
			input.style.opacity = "0";
			document.body.append(input);
			input.select();
			document.execCommand("copy");
			input.remove();
		}
		setCopied(true);
		setTimeout(() => setCopied(false), 2200);
	};
	const submit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const form = new FormData(event.currentTarget);
		mutation.mutate({
			data: {
				name: String(form.get("name")),
				dateOfBirth: String(form.get("dateOfBirth") || "") || null,
			},
		});
	};

	return (
		<main className="page-shell max-w-5xl">
			<header>
				<p className="eyebrow">Preferences</p>
				<h1 className="page-title mt-2">Settings</h1>
				<p className="mt-2 text-muted-foreground">
					Manage your profile and how your diary looks.
				</p>
			</header>
			<form className="mt-8 space-y-6" onSubmit={submit}>
				<Card>
					<CardContent className="p-6 sm:p-8">
						<div className="grid gap-8 lg:grid-cols-[15rem_minmax(0,1fr)]">
							<div>
								<h2 className="section-title">Profile</h2>
								<p className="mt-2 text-sm leading-6 text-muted-foreground">
									Used to personalise your diary. Your email is managed by your
									sign-in account.
								</p>
							</div>
							<div className="grid gap-5 sm:grid-cols-2">
								<Field>
									<FieldLabel htmlFor="profile-name">Name</FieldLabel>
									<Input
										id="profile-name"
										name="name"
										defaultValue={profile.name}
										required
										minLength={2}
									/>
								</Field>
								<Field>
									<FieldLabel htmlFor="profile-email">Email</FieldLabel>
									<Input id="profile-email" value={profile.email} disabled />
								</Field>
								<Field>
									<FieldLabel htmlFor="profile-dob">
										Date of birth <em>optional</em>
									</FieldLabel>
									<Input
										id="profile-dob"
										name="dateOfBirth"
										type="date"
										defaultValue={profile.dateOfBirth ?? ""}
									/>
								</Field>
							</div>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="p-6 sm:p-8">
						<div className="grid gap-8 lg:grid-cols-[15rem_minmax(0,1fr)]">
							<div>
								<h2 className="section-title">Share with a clinician</h2>
								<p className="mt-2 text-sm leading-6 text-muted-foreground">
									Create a temporary, read-only view of your measurements and
									trends.
								</p>
							</div>
							<div className="space-y-4">
								<div className="flex gap-3 rounded-3xl bg-secondary/60 p-5">
									<ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" />
									<div>
										<p className="text-sm font-semibold">
											Anyone with the link can view your diary
										</p>
										<p className="mt-1 text-sm leading-6 text-muted-foreground">
											The link expires after 30 days. It never allows editing,
											and you can revoke it at any time.
										</p>
									</div>
								</div>

								{activeShare && (
									<div className="rounded-2xl border border-border p-4">
										<div className="flex items-start gap-3">
											<Link2 className="mt-0.5 size-4 shrink-0 text-primary" />
											<div className="min-w-0">
												<p className="text-sm font-semibold">
													An active share link exists
												</p>
												<p className="mt-1 text-xs leading-5 text-muted-foreground">
													Expires{" "}
													{new Intl.DateTimeFormat("en-AU", {
														dateStyle: "medium",
														timeStyle: "short",
													}).format(new Date(activeShare.expiresAt))}
													. Notes are{" "}
													{activeShare.includeNotes ? "included" : "hidden"}.
												</p>
											</div>
										</div>
									</div>
								)}

								<label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-border p-4">
									<input
										type="checkbox"
										className="mt-1 size-4 accent-primary"
										checked={includeNotes}
										onChange={(event) => setIncludeNotes(event.target.checked)}
										disabled={createShare.isPending || revokeShare.isPending}
									/>
									<span>
										<span className="block text-sm font-semibold">
											Include measurement notes
										</span>
										<span className="mt-1 block text-sm leading-5 text-muted-foreground">
											Leave this off unless your clinician needs the extra
											context.
										</span>
									</span>
								</label>

								{generatedShareUrl && (
									<div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
										<p className="text-sm font-semibold">Your link is ready</p>
										<div className="mt-3 flex gap-2">
											<Input
												value={generatedShareUrl}
												readOnly
												aria-label="Diary share link"
												onFocus={(event) => event.currentTarget.select()}
											/>
											<Button
												type="button"
												variant="outline"
												onClick={copyShareLink}
											>
												{copied ? (
													<Check className="size-4" />
												) : (
													<Copy className="size-4" />
												)}
												{copied ? "Copied" : "Copy"}
											</Button>
										</div>
										<p className="mt-2 text-xs leading-5 text-muted-foreground">
											Copy it now. For security, BP Diary stores only a hash and
											cannot show this exact link again.
										</p>
									</div>
								)}

								<div className="flex flex-wrap gap-2">
									<Button
										type="button"
										size="lg"
										onClick={() =>
											createShare.mutate({ data: { includeNotes } })
										}
										disabled={createShare.isPending || revokeShare.isPending}
									>
										{createShare.isPending ? (
											<LoaderCircle className="size-4 animate-spin" />
										) : (
											<Link2 className="size-4" />
										)}
										{activeShare ? "Replace share link" : "Create share link"}
									</Button>
									{activeShare && (
										<Button
											type="button"
											size="lg"
											variant="destructive"
											onClick={() => revokeShare.mutate({ data: undefined })}
											disabled={createShare.isPending || revokeShare.isPending}
										>
											{revokeShare.isPending ? (
												<LoaderCircle className="size-4 animate-spin" />
											) : (
												<Trash2 className="size-4" />
											)}
											Revoke link
										</Button>
									)}
								</div>

								{(createShare.error || revokeShare.error) && (
									<p className="text-sm text-destructive">
										{createShare.error?.message ?? revokeShare.error?.message}
									</p>
								)}
							</div>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="p-6 sm:p-8">
						<div className="grid gap-8 lg:grid-cols-[15rem_minmax(0,1fr)]">
							<div>
								<h2 className="section-title">Appearance</h2>
								<p className="mt-2 text-sm leading-6 text-muted-foreground">
									Choose a comfortable theme for checking in at any time of day.
								</p>
							</div>
							<div className="grid gap-3 sm:grid-cols-2">
								{(["light", "dark"] as const).map((option) => (
									<Button
										type="button"
										size="lg"
										key={option}
										onClick={() => setTheme(option)}
										aria-pressed={theme === option}
										variant="outline"
										className={`theme-choice h-auto ${theme === option ? "theme-choice-selected" : ""}`}
									>
										<span className="theme-icon">
											{option === "light" ? <Sun /> : <Moon />}
										</span>
										<span className="capitalize">{option}</span>
										<Check
											className={`ml-auto size-4 text-primary transition-opacity ${theme === option ? "opacity-100" : "opacity-0"}`}
											aria-hidden="true"
										/>
									</Button>
								))}
							</div>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="p-6 sm:p-8">
						<div className="grid gap-8 lg:grid-cols-[15rem_minmax(0,1fr)]">
							<div>
								<h2 className="section-title">About & support</h2>
								<p className="mt-2 text-sm leading-6 text-muted-foreground">
									BP Diary is a personal hobby project for simple cardiovascular
									record keeping.
								</p>
							</div>
							<div className="rounded-3xl bg-secondary/60 p-5">
								<Mail className="size-5 text-primary" />
								<p className="mt-3 text-sm leading-6">
									Questions, feedback, or ideas are welcome at{" "}
									<a
										className="font-semibold text-primary hover:underline"
										href="mailto:bp.diary.hello@gmail.com"
									>
										bp.diary.hello@gmail.com
									</a>
									.
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
				<div className="flex justify-end">
					<Button
						type="submit"
						size="lg"
						className="min-w-40"
						disabled={mutation.isPending}
					>
						{mutation.isPending ? (
							<>
								<LoaderCircle className="size-4 animate-spin" /> Saving
							</>
						) : saved ? (
							<>
								<Check className="size-4" /> Saved
							</>
						) : (
							"Save settings"
						)}
					</Button>
				</div>
				{mutation.error && (
					<p className="text-right text-sm text-destructive">
						{mutation.error.message}
					</p>
				)}
			</form>
		</main>
	);
}
