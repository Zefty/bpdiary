import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server'

// 1. Specify protected and public routes
const protectedRoutes = ['/diary']
const publicRoutes = ['/login', '/signup', '/']
 
export default async function middleware(req: NextRequest) {
  // 2. Check if the current route is protected or public
  const path = req.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.includes(path)
  const isPublicRoute = publicRoutes.includes(path)
 
  // 3. Decrypt the session from the cookie
  const cookie = await (await cookies()).get("authjs.session-token")
  const headers = new Headers({
    "authjs.session-token": cookie?.value ?? ""
  });
  const validSession = await (await fetch(`http://localhost:3000/api/session`, { headers })).json();
 
  // 4. Redirect to /login if the user is not authenticated
  if (isProtectedRoute && !validSession) {
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }
 
  // 5. Redirect to /dashboard if the user is authenticated
  if (
    isPublicRoute &&
    validSession &&
    !req.nextUrl.pathname.startsWith('/diary')
  ) {
    return NextResponse.redirect(new URL('/diary', req.nextUrl));
  }
 
  return NextResponse.next();
}
 
// Routes Middleware should not run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}