import { jwtVerify, SignJWT } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const JWT_SECRET = new TextEncoder().encode(
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'default-secret-key-change-in-production'
);

export async function createAdminSession() {
  const token = await new SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('12h')
    .sign(JWT_SECRET);

  cookies().set('admin_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 12 // 12 hours
  });
}

export async function verifyAdminSession(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload.role === 'admin';
  } catch (err) {
    return false;
  }
}

export async function getAdminSession() {
  const token = cookies().get('admin_session')?.value;
  if (!token) return false;
  return await verifyAdminSession(token);
}

export async function requireAdminAPI(request: NextRequest) {
  const token = request.cookies.get('admin_session')?.value;
  if (!token) return false;
  return await verifyAdminSession(token);
}

export function destroyAdminSession() {
  cookies().delete('admin_session');
}
