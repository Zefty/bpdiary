import { cookies, headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server'

// 1. Specify protected and public routes
const protectedRoutes = ['/diary']
const publicRoutes = ['/login', '/signup', '/']
 
export default async function middleware(req: NextRequest) {
  // 2. Check if the current route is protected or public
  const path = req.nextUrl.pathname
  const baseUrl = req.url.replace(path, "")
  const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route));
  const isPublicRoute = publicRoutes.includes(path)
  const cookie = await cookies();
  const csfrToken = await cookie.get("authjs.csfr-token")?.value;
  const sessionToken = await cookie.get("authjs.session-token")?.value;

  const url = encodeURI(`${baseUrl}/api/trpc/session.validate?batch=1&input={"0":{"json":{"sessionToken":"${await cookie.get("authjs.session-token")?.value}"}}}`);
  const res = await fetch(url, {
    headers: new Headers({
      "cookie": `authjs.csfr-token=${csfrToken}; authjs.session-token=${sessionToken}`
    }),
    "body": null,
    "method": "GET"
  });
  const validSession = (await res.json())[0].result.data.json
 
  // 4. Redirect to /login if the user is not authenticated
  if (isProtectedRoute && !validSession) {
    return NextResponse.redirect(new URL('/', req.nextUrl))
  }
 
  // 5. Redirect to /dashboard if the user is authenticated
  if (
    isPublicRoute &&
    validSession &&
    !req.nextUrl.pathname.startsWith('/diary')
  ) {
    // return NextResponse.redirect(new URL('/diary', req.nextUrl));
    return NextResponse.next();
  }
 
  return NextResponse.next();
}
 
// Routes Middleware should not run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}