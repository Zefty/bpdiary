"use client";

import { useState } from "react";
import { Button } from "../shadcn/button";
import { signIn } from "next-auth/react";
import HeartLoader from "./heart-loader";

export default function SignInButton({ children }: { children?: React.ReactNode }) {
  const [loading, setLoading] = useState(false);
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return (
    <div className="flex-col">
      {!loading && (
        <Button
          onClick={() => {
            void signIn("github", undefined, { timezone: tz });
            setLoading(true);
          }}
          className="bg-primary hover:bg-primary/70 h-12 w-[15rem] rounded-full px-10 py-3 font-semibold text-white no-underline transition"
          disabled={loading}
        >
          {children ?? "Sign In"}
        </Button>
      )}
      {loading && (
        <HeartLoader variant="pulse" className="flex w-24 justify-center" />
      )}
    </div>
  );
}
