import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("next-auth.session-token");

  if (!token && !req.nextUrl.pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}
