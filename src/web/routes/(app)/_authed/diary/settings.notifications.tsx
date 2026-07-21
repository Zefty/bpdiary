import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute(
	"/(app)/_authed/diary/settings/notifications",
)({
	beforeLoad: () => {
		throw redirect({ to: "/diary/settings" });
	},
});
