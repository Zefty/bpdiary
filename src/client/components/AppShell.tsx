import {
	Link,
	Outlet,
	useRouteContext,
	useRouter,
} from "@tanstack/react-router";
import {
	BellRing,
	CalendarDays,
	ChevronRight,
	LayoutDashboard,
	LogOut,
	Settings,
} from "lucide-react";
import { authClient } from "@/client/lib/authClient";
import { Brand } from "./Brand";
import { Button } from "./shadcn/button";

const navigation = [
	{ label: "Overview", to: "/diary", icon: LayoutDashboard },
	{ label: "History", to: "/diary/calendar", icon: CalendarDays },
	{ label: "Reminders", to: "/diary/reminders", icon: BellRing },
	{ label: "Settings", to: "/diary/settings", icon: Settings },
] as const;

export function AppShell() {
	const { user, queryClient } = useRouteContext({ from: "__root__" });
	const router = useRouter();
	const initial = user?.name?.trim().charAt(0).toUpperCase() || "B";

	const signOut = async () => {
		await authClient.signOut();
		queryClient.clear();
		await router.invalidate();
		await router.navigate({ to: "/" });
	};

	return (
		<div className="min-h-dvh bg-background lg:grid lg:grid-cols-[17.5rem_minmax(0,1fr)]">
			<aside className="fixed inset-y-0 left-0 z-30 hidden w-[17.5rem] flex-col border-r border-border/70 bg-sidebar/95 px-5 py-6 backdrop-blur lg:flex">
				<div className="px-2">
					<Link to="/diary" aria-label="BP Diary overview">
						<Brand />
					</Link>
				</div>
				<nav className="mt-12 space-y-1.5" aria-label="Diary navigation">
					{navigation.map(({ label, to, icon: Icon }) => (
						<Link
							key={to}
							to={to}
							activeOptions={{ exact: to === "/diary" }}
							className="group flex items-center gap-3 rounded-2xl px-3.5 py-3 text-sm font-medium text-muted-foreground transition hover:bg-secondary hover:text-foreground"
							activeProps={{ className: "bg-primary/10 text-primary" }}
						>
							<Icon className="size-[1.15rem]" />
							<span>{label}</span>
							<ChevronRight className="ml-auto size-4 opacity-0 transition group-hover:opacity-50" />
						</Link>
					))}
				</nav>
				<div className="mt-auto rounded-3xl border border-border/70 bg-card p-3 shadow-sm">
					<div className="flex items-center gap-3">
						<div className="grid size-10 shrink-0 place-items-center rounded-2xl bg-accent font-semibold text-accent-foreground">
							{initial}
						</div>
						<div className="min-w-0 flex-1">
							<p className="truncate text-sm font-semibold">{user?.name}</p>
							<p className="truncate text-xs text-muted-foreground">
								{user?.email}
							</p>
						</div>
						<Button
							type="button"
							onClick={signOut}
							variant="ghost"
							size="icon-lg"
							className="rounded-xl text-muted-foreground"
							aria-label="Sign out"
						>
							<LogOut className="size-4" />
						</Button>
					</div>
				</div>
			</aside>

			<header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border/70 bg-background/90 px-4 backdrop-blur lg:hidden">
				<Link to="/diary" aria-label="BP Diary overview">
					<Brand />
				</Link>
				<div className="grid size-9 place-items-center rounded-xl bg-accent text-sm font-semibold">
					{initial}
				</div>
			</header>

			<div className="min-w-0 pb-24 lg:col-start-2 lg:pb-0">
				<Outlet />
			</div>

			<nav
				className="fixed inset-x-3 bottom-3 z-30 grid grid-cols-4 rounded-3xl border border-border/70 bg-card/95 p-2 shadow-[0_18px_55px_-20px_rgba(31,42,55,0.45)] backdrop-blur lg:hidden"
				aria-label="Diary navigation"
			>
				{navigation.map(({ label, to, icon: Icon }) => (
					<Link
						key={to}
						to={to}
						activeOptions={{ exact: to === "/diary" }}
						className="flex flex-col items-center gap-1 rounded-2xl px-1 py-2 text-[0.65rem] font-medium text-muted-foreground"
						activeProps={{ className: "bg-primary/10 text-primary" }}
					>
						<Icon className="size-[1.15rem]" />
						{label}
					</Link>
				))}
			</nav>
		</div>
	);
}
