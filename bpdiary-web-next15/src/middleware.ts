import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { env } from "./env";

const protectedRoutes = ["/diary"];
const publicRoutes = ["/login", "/signup", "/"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const baseUrl = env.BASE_URL;

  const isProtectedRoute = protectedRoutes.some((route) =>
    path.startsWith(route),
  );
  const isPublicRoute = publicRoutes.includes(path);

  const cookieStore = await cookies();
  const csfrToken = cookieStore.get("authjs.csfr-token")?.value;
  const sessionToken = cookieStore.get("authjs.session-token")?.value;

  const url = encodeURI(`${baseUrl}/api/trpc/session.validate`);
  const res = await fetch(url, {
    headers: new Headers({
      cookie: `authjs.csfr-token=${csfrToken}; authjs.session-token=${sessionToken}`,
    }),
    body: null,
    method: "GET",
  });

  let validSession = false;
  if (res.ok) {
    validSession = (await res.json()).result.data.json;
  }

  if (isProtectedRoute && !validSession) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  if (
    isPublicRoute &&
    validSession &&
    !req.nextUrl.pathname.startsWith("/diary")
  ) {
    return NextResponse.redirect(new URL("/diary", req.nextUrl));
  }

  if (validSession && req.nextUrl.pathname === "/diary/settings") {
    const lastVisitedSetting = cookieStore.get(
      "bpdiary.settings-last-visited",
    )?.value;
    if (lastVisitedSetting) {
      return NextResponse.redirect(
        new URL(`/diary/settings/${lastVisitedSetting}`, req.nextUrl),
      );
    }

    return NextResponse.redirect(
      new URL(`/diary/settings/profile`, req.nextUrl),
    );
  }

  if (validSession && req.nextUrl.pathname.startsWith("/diary/settings")) {
    const lastVisitedSetting = req.nextUrl.pathname.replace(
      "/diary/settings/",
      "",
    );
    cookieStore.set("bpdiary.settings-last-visited", lastVisitedSetting);
  }

  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
