import NextAuth, { NextAuthConfig } from "next-auth";
import { cache } from "react";
import { baseAuthConfig } from "./baseConfig";
import { env } from "~/env";
import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { db } from "../db";
import { setting } from "../db/schema";

const { auth: uncachedAuth, handlers, signIn, signOut } = NextAuth(async (req: NextRequest | undefined) => {
    if (req?.url.startsWith(`${env.BASE_URL}/api/auth/signin`)) {
        const cookieStore = await cookies();
        cookieStore.set('tz', req?.nextUrl.searchParams.get("tz") ?? "localtime")
    }
    const authConfig = {
        ...baseAuthConfig,
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
            signIn: async ({ user, account, profile, email, credentials }) => {
                const cookieStore = await cookies();
                const tz = cookieStore.get('tz');
                const settingName = tz?.name ?? "tz";
                const settingValue = tz?.value ?? "localtime";

                if (user.id) {
                    await db.insert(setting)
                    .values({
                        userId: user.id,
                        settingName,
                        settingValue
                    }).onConflictDoUpdate({
                        target: [setting.userId, setting.settingName],
                        set: { settingValue, updatedAt: new Date() },
                    });
                }
                return true;
            }
        },
        session: { strategy: "database" },
    } satisfies NextAuthConfig;
    return authConfig
});

const auth = cache(uncachedAuth);

export { auth, handlers, signIn, signOut };
