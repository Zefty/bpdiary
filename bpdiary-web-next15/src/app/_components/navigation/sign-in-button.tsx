"use client";

import { useState } from "react";
import { Button } from "../shadcn/button";
import { __NEXTAUTH, signIn } from "next-auth/react";
import LoadingPage from "../loading-states/loading-page";
import { useRouter } from "next/navigation";

export default function SignInButton({
  children,
}: {
  children?: React.ReactNode;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return loading ? (
    <LoadingPage />
  ) : (
    <Button
      onClick={() => {
        // void signIn(undefined, undefined, { timezone: tz });
        const callbackUrl = `${window.location.href}?${new URLSearchParams({
          timezone: tz,
        })}`;
        const signInUrl = `${__NEXTAUTH.basePath}/signin?${new URLSearchParams({
          callbackUrl: callbackUrl,
          timezone: tz,
        })}`;
        router.push(signInUrl);
        setLoading(true);
      }}
      className="bg-primary hover:bg-primary/70 h-12 w-[15rem] rounded-full px-10 py-3 font-semibold text-white no-underline transition"
      disabled={loading}
    >
      {children ?? "Sign In"}
    </Button>
  );
}
