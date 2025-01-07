"use client";

import { Button } from "../shadcn/button";
import { signIn } from "next-auth/react"

export default function SignIn() {
    const tz = new Date().getTimezoneOffset();
    return (
        <Button
            onClick={() => signIn("github", { redirectTo: `/?tz=${tz}` })}
            className="rounded-full bg-primary px-10 py-3 font-semibold no-underline transition hover:bg-primary/70 text-white"
        >
            Sign in
        </Button>
    )
}