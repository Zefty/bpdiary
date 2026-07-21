import { useRouteContext, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { authClient } from "../lib/authClient";

export function useAuthHandlers() {
	const router = useRouter();
	const routerContext = useRouteContext({
		from: "__root__",
	});
	const [alert, setAlert] = useState<{ type: string; message: string }>();

	const [isPending, setIsPending] = useState(false);

	const signIn = async (
		email: string,
		password: string,
		redirectTo = "/diary",
	) => {
		setIsPending(true);
		const { error } = await authClient.signIn.email({
			email,
			password,
			rememberMe: true,
		});

		if (error) {
			setIsPending(false);
			setAlert({
				type: "error",
				message: error.message ?? error.statusText,
			});
			return false;
		}

		routerContext.queryClient.clear();
		await router.invalidate();
		await router.navigate({ href: redirectTo });
		setIsPending(false);
		return true;
	};

	const signUp = async (
		name: string,
		email: string,
		password: string,
		redirectTo = "/diary",
	) => {
		setIsPending(true);
		const { error } = await authClient.signUp.email({
			email,
			password,
			name,
		});

		if (error) {
			setIsPending(false);
			setAlert({
				type: "error",
				message: error.message ?? error.statusText,
			});
			return false;
		}

		routerContext.queryClient.clear();
		await router.invalidate();
		await router.navigate({ href: redirectTo });
		setIsPending(false);
		return true;
	};

	return {
		alert,
		signIn,
		signUp,
		isPending,
	};
}
