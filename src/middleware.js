import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // only protect admin route
  if (pathname.startsWith("/admin")) {
    const token = request.cookies.getAll().find(c => 
      c.name.includes("session")
    );


    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};