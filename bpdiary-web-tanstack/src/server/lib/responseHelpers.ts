import { json } from "@tanstack/react-start";

export const UNAUTHORIZED_RESPONSE = () =>
	json(
		{ message: "Unauthorized" },
		{
			status: 401,
			statusText: "Unauthorized",
		},
	);

export const BAD_REQUEST_RESPONSE = (message?: string) =>
	json(
		{ message: message ?? "Bad Request" },
		{
			status: 400,
			statusText: "Bad Request",
		},
	);

export const INTERNAL_SERVER_ERROR_RESPONSE = (message?: string) =>
	json(
		{ message: message ?? "Internal Server Error" },
		{
			status: 500,
			statusText: "Internal Server Error",
		},
	);
