import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import {
	ArrowLeft,
	CircleAlert,
	Code2,
	LoaderCircle,
	LockKeyhole,
	MessageCircle,
} from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { Brand } from "@/client/components/Brand";
import { Button } from "@/client/components/shadcn/button";
import { Card, CardContent } from "@/client/components/shadcn/card";
import {
	Field,
	FieldLabel,
	FieldSeparator,
} from "@/client/components/shadcn/field";
import { Input } from "@/client/components/shadcn/input";
import { useAuthHandlers } from "@/client/hooks/useAuthHandlers";
import { authClient } from "@/client/lib/authClient";
import { getAuthProviders } from "@/server/authProviders";

const searchSchema = z.object({ redirect: z.string().optional() });

export const Route = createFileRoute("/(app)/login")({
	validateSearch: searchSchema.parse,
	beforeLoad: ({ context, search }) => {
		if (context.session)
			throw redirect({ href: safeRedirect(search.redirect) });
	},
	loader: () => getAuthProviders(),
	component: LoginPage,
});

function safeRedirect(value?: string) {
	if (!value?.startsWith("/") || value.startsWith("//")) return "/diary";
	return value;
}

function LoginPage() {
	const { redirect: redirectValue } = Route.useSearch();
	const redirectTo = safeRedirect(redirectValue);
	const providers = Route.useLoaderData();
	const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
	const { alert, signIn, signUp, isPending } = useAuthHandlers();
	const submit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const form = new FormData(event.currentTarget);
		if (mode === "sign-in")
			await signIn(
				String(form.get("email")),
				String(form.get("password")),
				redirectTo,
			);
		else
			await signUp(
				String(form.get("name")),
				String(form.get("email")),
				String(form.get("password")),
				redirectTo,
			);
	};
	const socialSignIn = (provider: "github" | "discord") =>
		authClient.signIn.social({ provider, callbackURL: redirectTo });

	return (
		<main className="grid min-h-dvh bg-secondary/35 lg:grid-cols-2">
			<section className="flex min-h-dvh flex-col bg-card px-5 py-6 sm:px-10 lg:px-16">
				<div className="flex items-center justify-between">
					<Link to="/">
						<Brand />
					</Link>
					<Link
						to="/"
						className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
					>
						<ArrowLeft className="size-4" /> Back home
					</Link>
				</div>
				<div className="my-auto w-full max-w-md self-center py-12">
					<p className="eyebrow">
						{mode === "sign-in" ? "Welcome back" : "Create your private diary"}
					</p>
					<h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em]">
						{mode === "sign-in"
							? "Sign in to continue."
							: "Begin with one reading."}
					</h1>
					<p className="mt-3 text-sm leading-6 text-muted-foreground">
						{mode === "sign-in"
							? "Your measurements, notes, and trends are waiting."
							: "No clutter, no public profile — just a calmer way to keep track."}
					</p>
					<form className="mt-8 space-y-5" onSubmit={submit}>
						{(providers.github || providers.discord) && (
							<>
								<div className="grid gap-3 sm:grid-cols-2">
									{providers.github && (
										<Button
											type="button"
											variant="outline"
											onClick={() => socialSignIn("github")}
										>
											<Code2 className="size-4" /> GitHub
										</Button>
									)}
									{providers.discord && (
										<Button
											type="button"
											variant="outline"
											onClick={() => socialSignIn("discord")}
										>
											<MessageCircle className="size-4" /> Discord
										</Button>
									)}
								</div>
								<FieldSeparator>or use email</FieldSeparator>
							</>
						)}
						{alert && (
							<div className="flex gap-2 rounded-2xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
								<CircleAlert className="mt-0.5 size-4 shrink-0" />
								{alert.message}
							</div>
						)}
						{mode === "sign-up" && (
							<Field>
								<FieldLabel htmlFor="name">Name</FieldLabel>
								<Input
									id="name"
									name="name"
									autoComplete="name"
									minLength={2}
									required
									placeholder="Your name"
								/>
							</Field>
						)}
						<Field>
							<FieldLabel htmlFor="email">Email</FieldLabel>
							<Input
								id="email"
								name="email"
								type="email"
								autoComplete="email"
								required
								placeholder="you@example.com"
							/>
						</Field>
						<Field>
							<FieldLabel htmlFor="password">Password</FieldLabel>
							<Input
								id="password"
								name="password"
								type="password"
								autoComplete={
									mode === "sign-in" ? "current-password" : "new-password"
								}
								minLength={8}
								required
								placeholder="At least 8 characters"
							/>
						</Field>
						<Button type="submit" className="h-12 w-full" disabled={isPending}>
							{isPending && <LoaderCircle className="size-4 animate-spin" />}
							{mode === "sign-in" ? "Sign in" : "Create account"}
						</Button>
					</form>
					<p className="mt-6 text-center text-sm text-muted-foreground">
						{mode === "sign-in"
							? "New to BP Diary?"
							: "Already have an account?"}{" "}
						<Button
							type="button"
							variant="link"
							className="h-auto p-0 font-semibold"
							onClick={() =>
								setMode(mode === "sign-in" ? "sign-up" : "sign-in")
							}
						>
							{mode === "sign-in" ? "Create an account" : "Sign in"}
						</Button>
					</p>
					<p className="mt-8 flex items-center justify-center gap-2 text-xs text-muted-foreground">
						<LockKeyhole className="size-3.5" /> Secure account-based access
					</p>
				</div>
			</section>
			<section className="relative hidden overflow-hidden lg:grid lg:place-items-center">
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,var(--accent),transparent_35%),radial-gradient(circle_at_75%_75%,color-mix(in_oklch,var(--primary),transparent_78%),transparent_38%)]" />
				<div className="relative max-w-lg px-12">
					<blockquote className="text-4xl font-semibold leading-tight tracking-[-0.05em] text-balance">
						“A health record should reduce uncertainty, not add to it.”
					</blockquote>
					<div className="mt-10 grid grid-cols-3 gap-3">
						<Stat value="10 sec" label="to log" />
						<Stat value="1 place" label="for trends" />
						<Stat value="Private" label="by account" />
					</div>
				</div>
			</section>
		</main>
	);
}

function Stat({ value, label }: { value: string; label: string }) {
	return (
		<Card className="bg-card/65 backdrop-blur">
			<CardContent className="p-4">
				<p className="text-xl font-semibold">{value}</p>
				<p className="mt-1 text-xs text-muted-foreground">{label}</p>
			</CardContent>
		</Card>
	);
}
