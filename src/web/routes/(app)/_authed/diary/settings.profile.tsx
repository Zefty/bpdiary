import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/(app)/_authed/diary/settings/profile")({
	beforeLoad: () => {
		throw redirect({ to: "/diary/settings" });
	},
});
