import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin routes (except login API and login page)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const token = request.cookies.get('admin_session')?.value;

    if (!token) {
      const redirectResponse = NextResponse.redirect(new URL('/admin/login', request.url));
      redirectResponse.headers.set('X-Robots-Tag', 'noindex, nofollow');
      return redirectResponse;
    }

    try {
      const secret = new TextEncoder().encode(
        process.env.SUPABASE_SERVICE_ROLE_KEY || 'default-secret-key-change-in-production'
      );
      await jwtVerify(token, secret);
      const response = NextResponse.next();
      response.headers.set('X-Robots-Tag', 'noindex, nofollow');
      return response;
    } catch (error) {
      const redirectResponse = NextResponse.redirect(new URL('/admin/login', request.url));
      redirectResponse.headers.set('X-Robots-Tag', 'noindex, nofollow');
      return redirectResponse;
    }
  }

  // Add noindex for /account
  if (pathname.startsWith('/account')) {
    const response = NextResponse.next();
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/account/:path*'],
};
