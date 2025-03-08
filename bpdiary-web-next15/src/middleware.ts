import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { env } from "./env";
import { type RouterOutputs } from "./trpc/react";

type ValidateSession = {
  result: {
    data: {
      json: RouterOutputs["session"]["validate"];
    };
  };
};

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
  const sessionToken = cookieStore.get("__Secure-authjs.session-token")?.value;
  let headers = new Headers({
    cookie: `__Secure-authjs.session-token=${sessionToken}`,
  });

  if (process.env.NODE_ENV !== "production") {
    const sessionToken = cookieStore.get("authjs.session-token")?.value;
    headers = new Headers({
      cookie: `authjs.session-token=${sessionToken}`,
    });
  }

  const url = encodeURI(`${baseUrl}/api/trpc/session.validate`);
  const res = await fetch(url, {
    headers: headers,
    body: null,
    method: "GET",
  });

  let validSession = false;
  if (res.ok) {
    const ret = (await res.json()) as ValidateSession;
    validSession = ret.result.data.json;
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
