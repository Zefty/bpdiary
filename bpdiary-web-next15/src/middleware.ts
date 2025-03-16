import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { env } from "./env";
import { api } from "./trpc/server";

const protectedRoutes = ["/diary"];
const publicRoutes = ["/login", "/signup", "/", "/favicon.ico"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const baseUrl = env.BASE_URL;

  const isProtectedRoute = protectedRoutes.some((route) =>
    path.startsWith(route),
  );
  const isPublicRoute = publicRoutes.includes(path);

  const cookieStore = await cookies();
  console.log(cookieStore);
  let sessionToken = cookieStore.get("__Secure-authjs.session-token")?.value;
  if (process.env.NODE_ENV !== "production" || baseUrl.includes("localhost")) {
    sessionToken = cookieStore.get("authjs.session-token")?.value;
  }

  if (isProtectedRoute && !sessionToken) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  let validSession = false;
  if (sessionToken) {
    validSession = await api.session.validateSessionToken({ sessionToken });
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
    return NextResponse.redirect(
      new URL(`/diary/settings/profile`, req.nextUrl),
    );
  }

  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
  runtime: "nodejs",
};
