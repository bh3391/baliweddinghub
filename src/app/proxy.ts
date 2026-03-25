import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Session } from "@/lib/auth-client"; // Import helper session dari auth

export async function middleware(request: NextRequest) {
  // Implementasi sederhana:
  // 1. Ambil session dari cookie
  // 2. Jika path startsWith /dashboard/vendor dan role != vendor -> Redirect ke login
  // 3. Jika path startsWith /dashboard/user dan role != user -> Redirect ke login

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
