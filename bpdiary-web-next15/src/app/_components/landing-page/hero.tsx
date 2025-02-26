import { auth } from "~/server/auth";
import { Button } from "../shadcn/button";
import { HeroCards } from "./hero-cards";
import SignIn from "../navigation/sign-in";

export const Hero = async () => {
  const session = await auth();
  return (
    <section className="laptop:py-32 container grid place-items-center gap-10 py-35 lg:grid-cols-2">
      <div className="space-y-6 text-center lg:text-start">
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

        <div className="space-y-4 md:space-y-0 md:space-x-4">
          {!session && <SignIn />}
        </div>
      </div>

      {/* Hero cards sections */}
      <div className="z-10">
        <HeroCards />
      </div>

      {/* Shadow effect */}
      <div className="shadow"></div>
    </section>
  );
};
