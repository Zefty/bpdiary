import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { getBaseUrl } from "@/core/lib/getBaseUrl";
import { serverEnv } from "@/server/lib/serverEnv";
import { db } from "./db";
import * as schema from "./db/schema/index";

export const auth = betterAuth({
	baseURL: {
		allowedHosts: [getBaseUrl(), "172.16.11.219:3000", "*.vercel.app"],
		protocol: "auto",
	},
	plugins: [tanstackStartCookies()],
	database: drizzleAdapter(db, {
		provider: "pg",
		schema,
	}),
	emailAndPassword: {
		enabled: true,
	},
	socialProviders: {
		...(serverEnv.GOOGLE_CLIENT_ID && serverEnv.GOOGLE_CLIENT_SECRET
			? {
					google: {
						clientId: serverEnv.GOOGLE_CLIENT_ID,
						clientSecret: serverEnv.GOOGLE_CLIENT_SECRET,
					},
				}
			: {}),
	},
	session: {
		cookieCache: {
			enabled: true,
			maxAge: 7 * 24 * 60 * 60, // 7 days cache duration
			strategy: "jwe", // can be "jwt" or "compact"
		},
	},
	account: {
		storeStateStrategy: "cookie",
		storeAccountCookie: true, // Store account data after OAuth flow in a cookie (useful for database-less flows)
		accountLinking: {
			enabled: true,
			requireLocalEmailVerified: false,
		},
	},
});

export type BetterAuthSession = typeof auth.$Infer.Session;
export type SignInEmailResponse = Awaited<
	ReturnType<typeof auth.api.signInEmail>
>;
export type SignUpEmailResponse = Awaited<
	ReturnType<typeof auth.api.signUpEmail>
>;
