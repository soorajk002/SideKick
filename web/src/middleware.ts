import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    // Allow the request to proceed
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname

        // Public routes that don't require authentication
        const publicRoutes = ['/', '/login', '/signup', '/forgot-password', '/terms', '/privacy']
        if (publicRoutes.includes(pathname)) {
          return true
        }

        // API routes are handled separately
        if (pathname.startsWith('/api/')) {
          return true
        }

        // All dashboard routes require authentication
        if (pathname.startsWith('/dashboard')) {
          return !!token
        }

        return true
      },
    },
    pages: {
      signIn: '/login',
    },
  }
)

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}
