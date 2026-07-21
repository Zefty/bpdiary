import {
	useMutation,
	useQueryClient,
	useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Check, LoaderCircle, Mail, Moon, Sun } from "lucide-react";
import { useState } from "react";
import { Button } from "@/client/components/shadcn/button";
import { Card, CardContent } from "@/client/components/shadcn/card";
import { Field, FieldLabel } from "@/client/components/shadcn/field";
import { Input } from "@/client/components/shadcn/input";
import { useTheme } from "@/client/contexts/ThemeContext";
import { updateProfile } from "@/server/profile/profile";
import { diary } from "@/web/data/diary";

export const Route = createFileRoute("/(app)/_authed/diary/settings")({
	loader: ({ context }) =>
		context.queryClient.ensureQueryData(diary.queries.profile()),
	component: SettingsPage,
});

function SettingsPage() {
	const { data: profile } = useSuspenseQuery(diary.queries.profile());
	const queryClient = useQueryClient();
	const [saved, setSaved] = useState(false);
	const { theme, setTheme } = useTheme();
	const mutation = useMutation({
		mutationFn: updateProfile,
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["profile"] });
			setSaved(true);
			setTimeout(() => setSaved(false), 2200);
		},
	});
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
