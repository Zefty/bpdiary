import type { AnyRoute } from "@tanstack/react-router";
import {
	json,
	type OptionalFetcher,
	type RouteMethodHandler,
} from "@tanstack/react-start";
import z from "zod";
import { tryCatch } from "@/core/lib/utils";
import { postRequestValidationMiddleware } from "../middlewares/api";

/**
 * Creates a typesafe POST route handler from a server function.
 * Helps reuse server logic while preserving the response type.
 */
export function createPostRequestHandlerFromServerFn<
	TMiddlewares,
	TInputValidator,
	TResponse,
	TRegister,
	TParentRoute extends AnyRoute,
	TFullPath extends string,
	TParams,
	TServerMiddlewares,
	TServerContext,
>(
	serverFn: OptionalFetcher<TMiddlewares, TInputValidator, TResponse>,
	middleware = [postRequestValidationMiddleware],
): RouteMethodHandler<
	TRegister,
	TParentRoute,
	TFullPath,
	TParams,
	TServerMiddlewares,
	(typeof middleware)[number],
	TServerContext
> {
	return {
		middleware,
		handler: async ({ context }) => {
			const res = await tryCatch(
				serverFn({
					data: context.body,
				}),
			);

			return json({
				data: res.data,
				error:
					res.error instanceof z.ZodError
						? z.treeifyError(res.error)
						: res.error,
			});
		},
	};
}
