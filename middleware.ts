import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /, /dashboard, /login)
  const path = request.nextUrl.pathname;

  // Get the token from the request headers or cookies
  const token = request.cookies.get('token')?.value || 
                request.headers.get('authorization')?.replace('Bearer ', '');

  // Define public paths that don't require authentication
  const publicPaths = ['/', '/about', '/api/auth/login', '/api/auth/register'];
  const isPublicPath = publicPaths.some(publicPath => 
    path === publicPath || path.startsWith('/api/auth/')
  );

  // If the path is public, allow access
  if (isPublicPath) {
    return NextResponse.next();
  }

  // If there's no token and the path requires authentication, redirect to login
  if (!token && !isPublicPath) {
    const loginUrl = new URL('/', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // If there's a token and user is trying to access login page, redirect to dashboard
  if (token && path === '/') {
    const dashboardUrl = new URL('/dashboard', request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  // Allow the request to continue
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - manifest.json (PWA manifest)
     * - sw.js (service worker)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|manifest.json|sw.js).*)',
  ],
}; 