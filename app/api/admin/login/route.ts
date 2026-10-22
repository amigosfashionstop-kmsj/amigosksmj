import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { createAdminSession } from '@/lib/admin-auth';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    if (typeof username !== 'string' || typeof password !== 'string' || !username || !password) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const expectedUsername = process.env.ADMIN_ID || process.env.ADMIN_USERNAME;
    const expectedHash = process.env.ADMIN_PASSWORD_HASH;
    if (!expectedUsername || !expectedHash) return NextResponse.json({ error: 'Admin login is not configured' }, { status: 503 });

    if (username === expectedUsername) {
      const isMatch = await bcrypt.compare(password, expectedHash);
      if (isMatch) {
        await createAdminSession();
        return NextResponse.json({ success: true });
      }
    }

    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
