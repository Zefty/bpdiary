import { createServerFn } from "@tanstack/react-start";
import { serverEnv } from "@/server/lib/serverEnv";

export const getAuthProviders = createServerFn({ method: "GET" }).handler(
	() => ({
		github: Boolean(
			serverEnv.GITHUB_CLIENT_ID && serverEnv.GITHUB_CLIENT_SECRET,
		),
		discord: Boolean(
			serverEnv.DISCORD_CLIENT_ID && serverEnv.DISCORD_CLIENT_SECRET,
		),
	}),
);
