import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const sessionResponse = await fetch(
    `${request.nextUrl.origin}/api/auth/get-session`,
    {
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    }
  );

  const session = await sessionResponse.json();

  // 1. Proteksi AREA ADMIN GLOBAL (/admin atau /dashboard/admin)
  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/dashboard/admin")
  ) {
    if (!session || !session.user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Hanya Superadmin & Admin yang boleh masuk
    if (session.user.role !== "admin" && session.user.role !== "superadmin") {
      return NextResponse.redirect(new URL("/dashboard/user", request.url));
    }
  }

  // 2. Proteksi AREA USER (/dashboard/user)
  if (pathname.startsWith("/dashboard/user")) {
    if (!session || !session.user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Jika Admin nyasar ke sini, arahkan ke dashboard mereka sendiri
    if (session.user.role === "admin" || session.user.role === "superadmin") {
      return NextResponse.redirect(new URL("/dashboard/admin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/admin/:path*",
    "/dashboard/user/:path*",
  ],
};
