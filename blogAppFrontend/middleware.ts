
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 1. Get the token from cookies
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // 2. Define your protected dashboard routes
  const isDashboardRoute = pathname.startsWith('/dashboard');
  const isAuthRoute = pathname.startsWith('/auth');

  // Logic: If trying to access dashboard but NO token exists
  if (isDashboardRoute && !token) {
    return NextResponse.redirect(new URL('/auth/sign-up', request.url));
  }

  // Logic: If user is ALREADY logged in, don't let them go back to sign-up/login
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// 3. Matcher config: Only run middleware on dashboard and auth pages
export const config = {
  matcher: ['/dashboard/:path*', '/auth/:path*'],
};