import { HydrateClient } from "~/trpc/server";
import { Hero } from "./_components/landing-page/hero";
import { Features } from "./_components/landing-page/features";
import { Footer } from "./_components/landing-page/footer";

export default async function HomePage() {
  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 pb-16 pt-8">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            BP Diary
          </h1>
          <Hero />
          <Features />
          <Footer />
        </div>
      </main>
    </HydrateClient>
  );
}
