import { createMiddleware } from "@tanstack/react-start";
import { UNAUTHORIZED_RESPONSE } from "@/server/lib/responseHelpers";
import { auth } from "../auth";

export const authMiddleware = createMiddleware().server(
	async ({ next, request }) => {
		const authSession = await auth.api.getSession({
			headers: request.headers,
		});

		if (!authSession) {
			throw UNAUTHORIZED_RESPONSE();
		}

		if (authSession.session.expiresAt < new Date()) {
			throw UNAUTHORIZED_RESPONSE();
		}

		return await next({
			context: {
				session: authSession.session,
				user: authSession.user,
				requestHeaders: request.headers,
			},
		});
	},
);
