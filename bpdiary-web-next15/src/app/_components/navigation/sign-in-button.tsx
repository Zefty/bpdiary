"use client";

import { useState } from "react";
import { Button } from "../shadcn/button";
import { signIn } from "next-auth/react";
import HeartLoader from "./heart-loader";

export default function SignInButton({ children }: { children?: React.ReactNode }) {
  const [loading, setLoading] = useState(false);
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return (
    loading ?
      (
      <div className="fixed w-dvw h-dvh top-0 left-0 bg-muted z-[998]">
        <HeartLoader variant="pulse" className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 z-[999]" />
      </div>
      )
      :
      (
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
      )
  );
}
