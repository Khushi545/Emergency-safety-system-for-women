import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const session = request.cookies.get("session")?.value;

  // Paths that are accessible without authentication
  const publicPaths = ["/login", "/register", "/api/auth"];
  const isPublicPath = publicPaths.some((path) => request.nextUrl.pathname.startsWith(path));

  if (!session && !isPublicPath && request.nextUrl.pathname !== "/") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (session && isPublicPath) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
