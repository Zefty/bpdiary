import { createServerFn } from "@tanstack/react-start";
import { serverEnv } from "@/server/lib/serverEnv";

export const getAuthProviders = createServerFn({ method: "GET" }).handler(
	() => ({
		google: Boolean(
			serverEnv.GOOGLE_CLIENT_ID && serverEnv.GOOGLE_CLIENT_SECRET,
		),
	}),
);
