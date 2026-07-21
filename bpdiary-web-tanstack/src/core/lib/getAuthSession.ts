import type { QueryClient } from "@tanstack/react-query";
import { createIsomorphicFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { authClient } from "@/client/lib/authClient";
import { auth } from "@/server/auth";

export const getAuthSession = createIsomorphicFn()
	.client(async (queryClient: QueryClient) => {
		const { data: session } = await queryClient.ensureQueryData({
			queryFn: async () => authClient.getSession(),
			queryKey: ["getAuthSession"],
			gcTime: Infinity,
			revalidateIfStale: true,
		});

		return {
			session: session?.session,
			user: session?.user,
		};
	})
	.server(async () => {
		const headers = getRequestHeaders();
		const session = await auth.api.getSession({
			headers,
		});
		return {
			session: session?.session,
			user: session?.user,
		};
	});
