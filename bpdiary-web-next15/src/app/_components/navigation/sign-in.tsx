import { auth } from "~/server/auth";
import SignInButton from "./sign-in-button";

export default async function SignIn({ children }: { children?: React.ReactNode }) {
    const session = await auth();
    return (
        !session && <SignInButton>{children}</SignInButton>
    )
}