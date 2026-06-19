import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;

  console.log("🔥 MIDDLEWARE:", pathname);

  // ❌ শুধু admin protect
  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get("better-auth.session_token");

    if (!token) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};