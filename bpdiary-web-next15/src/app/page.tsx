import Link from "next/link";
import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import SignIn from "./_components/navigation/sign-in";

export default async function HomePage() {
  const session = await auth();
  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            BP Diary
          </h1>
          <div className="flex flex-col items-center gap-2">
            <div className="flex flex-col items-center justify-center gap-4">
              <p className="text-center text-2xl">
                {session && <span>Logged in as {session.user?.name}</span>}
              </p>
              {!session && (
                // <Link
                //   href="/api/auth/signin?tz=apple"
                //   className="rounded-full bg-primary px-10 py-3 font-semibold no-underline transition hover:bg-primary/70 text-white"
                // >
                //   Sign in
                // </Link>
                <SignIn/>
              )}
            </div>
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}
