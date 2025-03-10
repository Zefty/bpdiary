import { auth } from "~/server/auth";
import { HeroCards } from "./hero-cards";
import { Suspense } from "react";
import SignIn from "../navigation/sign-in";
import LoadingButton from "../loading-states/loading-button";

export const Hero = async () => {
  const session = await auth();
  return (
    <section className="tablet:py-16 container grid place-items-center gap-10 tablet:grid-cols-2">
      <div className="space-y-6 text-center tablet:text-start col-span-1">
        <main className="text-5xl font-bold md:text-6xl">
          <h1 className="inline">
            <span className="inline bg-gradient-to-r from-[#F596D3] to-[#D247BF] bg-clip-text text-transparent">
              Track
            </span>{" "}
            and manage
          </h1>{" "}
          your{" "}
          <h2 className="inline">
            <span className="inline bg-gradient-to-r from-[#61DAFB] via-[#1fc0f1] to-[#03a3d7] bg-clip-text text-transparent">
              blood
            </span>{" "}
            pressure
          </h2>
        </main>

        <p className="text-muted-foreground mx-auto text-xl md:w-10/12 lg:mx-0">
          This is a simple and user-friendly hobby project designed to help you
          keep tabs on your blood pressure without hassle.
        </p>

        <div className="mb-10 md:space-x-4">
          <Suspense fallback={<LoadingButton />}>
            <SignIn />
          </Suspense>
        </div>
      </div>

      <div className="col-span-1">
        {/* Hero cards sections */}
        <div>
          <HeroCards />
        </div>

        {/* Shadow effect */}
        <div className="shadow"></div>
      </div>
    </section>
  );
};
