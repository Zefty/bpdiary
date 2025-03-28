"use client";

import { LogOut } from "lucide-react";
import { Button } from "../shadcn/button";
import { signOut } from "next-auth/react";

export default function SignOut() {
  return (
    <Button
      onClick={() => signOut({ redirectTo: "/" })}
      className="rounded-full bg-primary px-10 py-3 font-semibold text-white no-underline transition hover:bg-primary/70"
    >
      <LogOut />
      <span>Sign out</span>
    </Button>
  );
}
