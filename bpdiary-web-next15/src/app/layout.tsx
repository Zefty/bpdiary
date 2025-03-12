import "~/styles/globals.css";

import { Poppins } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { type RouterOutputs, TRPCReactProvider } from "~/trpc/react";
import { ThemeProvider } from "./_contexts/themeProvider";

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "BpDiary",
  description: "Keep tabs on your blood pressure without hassle!",
  icons: [{ rel: "icon", url: "/icon.svg" }],
};

type Theme = RouterOutputs["setting"]["retrieveSetting"][0];

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const theme = { settingValue: "light" } as Theme;
  // try {
  //   const ret = (
  //     await api.setting.retrieveSetting({ settingName: "theme" })
  //   )[0];
  //   if (ret !== undefined) theme = ret;
  // } catch (e) {
  //   console.log(e);
  // }
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${poppins.variable} ${theme.settingValue}`}
      style={{ colorScheme: theme.settingValue }}
      suppressHydrationWarning
    >
      <body>
        <TRPCReactProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
          </ThemeProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
