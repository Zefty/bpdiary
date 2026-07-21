import { QueryClient } from "@tanstack/react-query";
import { createRouter, Link } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import { TriangleAlert } from "lucide-react";
import { Button } from "@/client/components/shadcn/button";
import { Card, CardContent } from "@/client/components/shadcn/card";
import type { BetterAuthSession } from "@/server/auth";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

export interface RouterContext {
	queryClient: QueryClient;
	session?: BetterAuthSession["session"];
	user?: BetterAuthSession["user"];
}

// Create a new router instance
export const getRouter = async () => {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				// With SSR, we usually want to set some default staleTime
				// above 0 to avoid refetching immediately on the client
				staleTime: 60 * 1000,
			},
		},
	});

	const router = createRouter({
		routeTree,
		context: { queryClient },
		defaultPreload: "intent",
		scrollRestoration: true,
		defaultErrorComponent: (props) => {
			return (
				<main className="grid min-h-dvh place-items-center bg-background p-6 text-center">
					<Card className="max-w-md shadow-xl">
						<CardContent className="p-8">
							<span className="mx-auto grid size-12 place-items-center rounded-2xl bg-destructive/10 text-destructive">
								<TriangleAlert />
							</span>
							<h1 className="mt-5 text-2xl font-semibold">
								Something went wrong
							</h1>
							<p className="mt-2 text-sm text-muted-foreground">
								We could not load this part of your diary. Your saved records
								have not been changed.
							</p>
							<div className="mt-6 flex justify-center gap-3">
								<Button
									type="button"
									onClick={() => props.reset()}
									variant="outline"
								>
									Try again
								</Button>
								<Button nativeButton={false} render={<Link to="/" />}>
									Go Home
								</Button>
							</div>
						</CardContent>
					</Card>
				</main>
			);
		},
		defaultNotFoundComponent: () => (
			<main className="grid min-h-dvh place-items-center p-6 text-center">
				<div>
					<p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
						404
					</p>
					<h1 className="mt-2 text-4xl font-semibold">
						That page is not in your diary
					</h1>
					<Button
						nativeButton={false}
						render={<Link to="/" />}
						className="mt-6"
					>
						Return home
					</Button>
				</div>
			</main>
		),
	});

	setupRouterSsrQueryIntegration({
		router,
		queryClient,
	});

	return router;
};
