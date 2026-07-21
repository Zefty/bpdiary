import { createEnv } from "@t3-oss/env-core";
import { createServerOnlyFn } from "@tanstack/react-start";
import { z } from "zod";
import { DEPLOYMENT_ENV } from "@/core/lib/env";

export const serverEnv = createEnv({
	server: {
		SERVER_URL: z.url().optional(),
		BETTER_AUTH_SECRET: z.string(),
		DATABASE_URL_RUNTIME: z.url(),
		DATABASE_URL_BUILDTIME: z.url(),
		GITHUB_CLIENT_ID: z.string().min(1).optional(),
		GITHUB_CLIENT_SECRET: z.string().min(1).optional(),
		DISCORD_CLIENT_ID: z.string().min(1).optional(),
		DISCORD_CLIENT_SECRET: z.string().min(1).optional(),
		DEPLOYMENT_ENV: DEPLOYMENT_ENV,
		VERCEL: z.string().optional(),
		VERCEL_PROJECT_PRODUCTION_URL: z.string().min(1).optional(),
		PORT: z.coerce.number().int().positive().optional(),
	},
	/**
	 * What object holds the environment variables at runtime. This is usually
	 * `process.env` or `import.meta.env`.
	 */
	runtimeEnv: createServerOnlyFn(() => process.env)(),
	/**
	 * By default, this library will feed the environment variables directly to
	 * the Zod validator.
	 *
	 * This means that if you have an empty string for a value that is supposed
	 * to be a number (e.g. `PORT=` in a ".env" file), Zod will incorrectly flag
	 * it as a type mismatch violation. Additionally, if you have an empty string
	 * for a value that is supposed to be a string with a default value (e.g.
	 * `DOMAIN=` in an ".env" file), the default value will never be applied.
	 *
	 * In order to solve these issues, we recommend that all new projects
	 * explicitly specify this option as true.
	 */
	emptyStringAsUndefined: true,
});
