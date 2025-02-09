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

  const cookie = await cookies();
  const csfrToken = await cookie.get("authjs.csfr-token")?.value;
  const sessionToken = await cookie.get("authjs.session-token")?.value;

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

  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
