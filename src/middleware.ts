import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    const userRole = token?.user?.rol_id;

    // 🔒 Protección por rol
    if (path.startsWith("/admin") && userRole !== 1) {
      return NextResponse.redirect(
        new URL("/login?error=unauthorized", req.url)
      );
    }

    if (path.startsWith("/patient") && userRole !== 2) {
      return NextResponse.redirect(
        new URL("/login?error=unauthorized", req.url)
      );
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // ✅ Solo permite pasar si hay sesión
        return !!token;
      },
    },
  }
);

// ✅ SOLO rutas privadas
export const config = {
  matcher: [
    "/admin/:path*",
    "/patient/:path*",
  ],
};