import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/client/components/AppShell";

export const Route = createFileRoute("/(app)/_authed/diary")({
	component: AppShell,
});
