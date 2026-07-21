import { createIsomorphicFn } from "@tanstack/react-start";
import { serverEnv } from "@/server/lib/serverEnv";

const toHttpsUrl = (host: string) => `https://${host}`;

/**
 * Returns the current browser origin or the deployed application's public URL.
 */
export const getBaseUrl = createIsomorphicFn()
	.client(() => window.location.origin)
	.server(() => {
		if (serverEnv.SERVER_URL) return serverEnv.SERVER_URL;

		if (serverEnv.VERCEL && serverEnv.VERCEL_PROJECT_PRODUCTION_URL) {
			return toHttpsUrl(serverEnv.VERCEL_PROJECT_PRODUCTION_URL);
		}

		return `http://localhost:${serverEnv.PORT ?? 3000}`;
	});
