import NextAuth, {
  type AdapterUser,
  type DefaultSession,
  type NextAuthConfig,
} from "next-auth";
import { type AdapterUser as NextAuthAdapterUser } from "next-auth/adapters";
import GitHubProvider from "next-auth/providers/github";
import DiscordProvider, {
  type DiscordProfile,
} from "next-auth/providers/discord";
import { cache } from "react";
import { env } from "~/env";
import { type NextRequest } from "next/server";
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
    const tz = cookieStore.get("timezone");
    if (!tz) {
      cookieStore.set(
        "timezone",
        req?.nextUrl.searchParams.get("timezone") ?? "UTC",
        {
          httpOnly: true,
          sameSite: "lax",
          path: "/",
          secure: env.NODE_ENV === "production",
        },
      );
    }
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
      DiscordProvider({
        clientId: process.env.DISCORD_CLIENT_ID,
        clientSecret: process.env.DISCORD_CLIENT_SECRET,
        profile(profile: DiscordProfile) {
          const now = new Date();
          if (profile.avatar === null) {
            const defaultAvatarNumber =
              profile.discriminator === "0"
                ? Number(BigInt(profile.id) >> BigInt(22)) % 6
                : parseInt(profile.discriminator) % 5;
            profile.image_url = `https://cdn.discordapp.com/embed/avatars/${defaultAvatarNumber}.png`;
          } else {
            const format = profile.avatar.startsWith("a_") ? "gif" : "png";
            profile.image_url = `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.${format}`;
          }
          return {
            id: profile.id.toString(),
            name: profile.global_name ?? profile.username,
            email: profile.email,
            image: profile.image_url,
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
        profile.timezone = tz?.value;
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
