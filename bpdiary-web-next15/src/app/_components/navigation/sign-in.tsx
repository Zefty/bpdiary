"use client";

import { useState } from "react";
import { Button } from "../shadcn/button";
import { signIn } from "next-auth/react";
import HeartLoader from "./heart-loader";

export default function SignIn({ children }: { children?: React.ReactNode }) {
  const [loading, setLoading] = useState(false);
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return (
    <div className="flex-col">
      {!loading && (
        <Button
          onClick={() => {
            signIn("github", undefined, { timezone: tz });
            setLoading(true);
          }}
          className="bg-primary hover:bg-primary/70 w-[15rem] rounded-lg px-10 py-3 font-semibold text-white no-underline transition"
          disabled={loading}
        >
          {children ? children : "Sign in"}
        </Button>
      )}
      {loading && (
        <HeartLoader variant="pulse" className="flex w-24 justify-center" />
      )}
    </div>
  );
}
