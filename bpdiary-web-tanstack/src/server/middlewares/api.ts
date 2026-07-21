import { createMiddleware } from "@tanstack/react-start";
import { tryCatch } from "@/core/lib/utils";
import { BAD_REQUEST_RESPONSE } from "@/server/lib/responseHelpers";

export const postRequestValidationMiddleware = createMiddleware().server(
	async ({ next, request }) => {
		const checkRequestBody = await tryCatch<unknown>(request.json());

		if (checkRequestBody.error) {
			throw BAD_REQUEST_RESPONSE(checkRequestBody.error.toString());
		}

		return await next({
			context: {
				body: checkRequestBody.data,
			},
		});
	},
);
