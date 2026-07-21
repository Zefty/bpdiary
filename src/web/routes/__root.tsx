import { TanStackDevtools } from "@tanstack/react-devtools";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";
import {
	createRootRouteWithContext,
	HeadContent,
	Outlet,
	Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TooltipProvider } from "@/client/components/shadcn/tooltip";
import { ThemeProvider } from "@/client/contexts/ThemeContext";
import { getAuthSession } from "@/core/lib/getAuthSession";
import { getTheme } from "@/server/theme/theme";
import type { RouterContext } from "../router";
import appCss from "./styles.css?url";

export const Route = createRootRouteWithContext<RouterContext>()({
	beforeLoad: async ({ context }) => {
		const [authSession, theme] = await Promise.all([
			getAuthSession(context.queryClient),
			getTheme(),
		]);
		return { ...authSession, theme };
	},
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "BP Diary — Calm, clear blood pressure tracking",
			},
			{
				name: "description",
				content:
					"A private, simple diary for blood pressure readings, trends, reminders, and notes.",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
			{
				rel: "icon",
				href: "/icon.svg",
				type: "image/svg+xml",
			},
			{
				rel: "manifest",
				href: "/manifest.json",
			},
		],
	}),
	component: RootDocument,
});

function RootDocument() {
	const { theme } = Route.useRouteContext();
	return (
		<html lang="en" className={theme}>
			<head>
				<HeadContent />
			</head>
			<body>
				<ThemeProvider theme={theme}>
					<TooltipProvider delay={300}>
						<Outlet />
					</TooltipProvider>
				</ThemeProvider>
				{import.meta.env.DEV && (
					<TanStackDevtools
						config={{
							position: "bottom-right",
						}}
						plugins={[
							{
								name: "Tanstack Router",
								render: <TanStackRouterDevtoolsPanel />,
							},
							{
								name: "Tanstack Query",
								render: <ReactQueryDevtoolsPanel />,
							},
						]}
					/>
				)}
				<Scripts />
			</body>
		</html>
	);
}
