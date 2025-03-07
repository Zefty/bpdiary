import NextAuth, {
  AdapterUser,
  DefaultSession,
  NextAuthConfig,
} from "next-auth";
import { AdapterUser as NextAuthAdapterUser } from "next-auth/adapters";
import GitHubProvider from "next-auth/providers/github";
import { cache } from "react";
import { env } from "~/env";
import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { db } from "../db";
import {
  accounts,
  sessions,
  setting,
  users,
  verificationTokens,
} from "../db/schema";
import { DrizzleAdapter } from "@auth/drizzle-adapter";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
      dob?: Date;
      timezone?: string;
    } & DefaultSession["user"];
  }

  interface AdapterUser extends NextAuthAdapterUser {
    // ...other properties
    // role: UserRole;
    createdAt: Date;
    updatedAt: Date;
    dob?: Date;
    timezone?: string;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
const DbAdapter = DrizzleAdapter(db, {
  usersTable: users,
  accountsTable: accounts,
  sessionsTable: sessions,
  verificationTokensTable: verificationTokens,
});

const {
  auth: uncachedAuth,
  handlers,
  signIn,
  signOut,
} = NextAuth(async (req: NextRequest | undefined) => {
  if (req?.url.startsWith(`${env.BASE_URL}/api/auth/signin`)) {
    const cookieStore = await cookies();
    cookieStore.set(
      "timezone",
      req?.nextUrl.searchParams.get("timezone") ?? "localtime",
    );
  }
  const authConfig = {
    providers: [
      GitHubProvider({
        clientId: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        profile(profile) {
          const now = new Date();
          return {
            id: profile.id.toString(),
            name: profile.name,
            email: profile.email,
            image: profile.avatar_url,
            createdAt: now,
            updatedAt: now,
          };
        },
      }),
      /**
       * ...add more providers here.
       *
       * Most other providers require a bit more work than the Discord provider. For example, the
       * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
       * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
       *
       * @see https://next-auth.js.org/providers/github
       */
    ],
    adapter: {
      ...DbAdapter,
      createUser: async (profile: AdapterUser) => {
        const cookieStore = await cookies();
        const tz = cookieStore.get("timezone");
        profile.timezone = tz?.value ?? "localtime";
        const createdUser = await DbAdapter.createUser!(profile);

        if (createdUser) {
          await db
            .insert(setting)
            .values({
              userId: createdUser.id,
              settingName: "theme",
              settingValue: "light", // sets default theme
            })
            .onConflictDoUpdate({
              target: [setting.userId, setting.settingName],
              set: { settingValue: "light", updatedAt: new Date() },
            });
        }

        return createdUser;
      },
    },
    session: { strategy: "database" },
    callbacks: {
      session: async ({ session, user }) => {
        return {
          ...session,
          user: {
            ...session.user,
            id: user.id,
          },
        };
      },
    },
  } satisfies NextAuthConfig;
  return authConfig;
});

const auth = cache(uncachedAuth);

export { auth, handlers, signIn, signOut };
