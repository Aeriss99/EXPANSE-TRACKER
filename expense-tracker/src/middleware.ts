import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Rute yang memerlukan authentication
    const protectedRoutes = ['/dashboard', '/expenses', '/profile'];
    const { pathname } = req.nextUrl;

    // Jika user mengakses protected route tanpa session
    if (protectedRoutes.some(route => pathname.startsWith(route))) {
      return NextResponse.next();
    }

    // Redirect user yang sudah login dari halaman auth
    if (pathname.startsWith('/auth') && req.nextauth.token) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        
        // Allow access to auth routes
        if (pathname.startsWith('/auth')) {
          return true;
        }

        // Protect dashboard and expenses routes
        if (pathname.startsWith('/dashboard') || pathname.startsWith('/expenses')) {
          return !!token;
        }

        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match semua request paths kecuali yang dimulai dengan:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
