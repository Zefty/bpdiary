import { useRouter } from "@tanstack/react-router";
import { createContext, type PropsWithChildren, use } from "react";
import type { Theme } from "@/core/theme/theme";
import { setTheme as setThemeCookie } from "@/server/theme/theme";

type ThemeContextValue = {
	theme: Theme;
	setTheme: (theme: Theme) => Promise<void>;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({
	children,
	theme,
}: PropsWithChildren<{ theme: Theme }>) {
	const router = useRouter();
	const setTheme = async (nextTheme: Theme) => {
		await setThemeCookie({ data: nextTheme });
		await router.invalidate();
	};

	return <ThemeContext value={{ theme, setTheme }}>{children}</ThemeContext>;
}

export function useTheme() {
	const context = use(ThemeContext);
	if (!context) throw new Error("useTheme must be used within ThemeProvider");
	return context;
}
