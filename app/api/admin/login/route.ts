import { NextResponse } from 'next/server';
import { createAdminToken, ADMIN_COOKIE_NAME } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body || {};

    const expectedUsername = process.env.ADMIN_ID || 'Admin';
    const expectedPassword = process.env.ADMIN_PASSWORD || 'Amigos@Admin2026!';

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Login ID and password are required.' },
        { status: 400 }
      );
    }

    if (username.trim() !== expectedUsername || password !== expectedPassword) {
      return NextResponse.json(
        { error: 'Invalid Login ID or password.' },
        { status: 401 }
      );
    }

    const token = await createAdminToken(expectedUsername);

    const response = NextResponse.json({
      success: true,
      message: 'Authentication successful.'
    });

    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    // Clear legacy unencrypted cookie if present
    response.cookies.set({
      name: 'adminAuth',
      value: '',
      path: '/',
      maxAge: 0
    });

    return response;
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { error: 'Internal server error during authentication.' },
      { status: 500 }
    );
  }
}
