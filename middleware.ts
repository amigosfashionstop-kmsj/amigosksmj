import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  if (path.startsWith('/admin') && !path.startsWith('/admin/login') && !path.startsWith('/api/')) {
    const token = request.cookies.get('adminAuth')?.value;
    if (token !== 'true') {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  if (path === '/admin/login') {
    const token = request.cookies.get('adminAuth')?.value;
    if (token === 'true') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
