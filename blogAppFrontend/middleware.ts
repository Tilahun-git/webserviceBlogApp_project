import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Read cookies (middleware can ONLY read cookies)
  const token = req.cookies.get("authToken")?.value;
  const role = req.cookies.get("userRole")?.value;

  const isAdmin = role === "ADMIN" || role === "admin";

  // Allow access to sign-in page always
  if (pathname.startsWith("/auth/sign-in")) {
    return NextResponse.next();
  }

  // Protect admin routes
  if (pathname.startsWith("/admin")) {
    if (!token || !isAdmin) {
      const loginUrl = new URL("/auth/sign-in", req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
