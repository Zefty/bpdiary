import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/(app)/_authed")({
	beforeLoad: async ({ context, location }) => {
		const authSession = context.session;

		if (!authSession || authSession.expiresAt < new Date()) {
			throw redirect({
				to: "/login",
				search: { redirect: location.href },
			});
		}
	},
});
