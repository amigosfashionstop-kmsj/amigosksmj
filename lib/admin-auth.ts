import { jwtVerify, SignJWT } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

function getJwtSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!secret || secret.length < 32) throw new Error('Admin session secret must contain at least 32 characters.');
  return new TextEncoder().encode(secret);
}

export async function createAdminSession() {
  const token = await new SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('12h')
    .sign(getJwtSecret());

  const cookieStore = await cookies();
  cookieStore.set('admin_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 12 // 12 hours
  });
}

export async function verifyAdminSession(token: string) {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    return payload.role === 'admin';
  } catch {
    return false;
  }
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_session')?.value;
  if (!token) return false;
  return await verifyAdminSession(token);
}

export async function requireAdminAPI(request: NextRequest) {
  const token = request.cookies.get('admin_session')?.value;
  if (!token) return false;
  return await verifyAdminSession(token);
}

export async function destroyAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_session');
}
