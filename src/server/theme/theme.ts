import { createServerFn } from "@tanstack/react-start";
import {
	getCookie,
	setCookie,
} from "@tanstack/start-server-core/request-response";
import { themeSchema } from "@/core/theme/theme";

const THEME_COOKIE = "bpdiary-theme";

export const getTheme = createServerFn({ method: "GET" }).handler(() =>
	themeSchema.catch("light").parse(getCookie(THEME_COOKIE)),
);

export const setTheme = createServerFn({ method: "POST" })
	.validator(themeSchema.parse)
	.handler(({ data }) => {
		setCookie(THEME_COOKIE, data, {
			httpOnly: true,
			maxAge: 60 * 60 * 24 * 365,
			path: "/",
			sameSite: "lax",
			secure: import.meta.env.PROD,
		});
		return data;
	});
