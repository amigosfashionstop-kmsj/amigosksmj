import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { createAdminSession } from '@/lib/admin-auth';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    const expectedUsername = process.env.ADMIN_USERNAME || 'Amigos';
    const expectedHash = process.env.ADMIN_PASSWORD_HASH || '$2b$10$1ZVnOXLGhiEvhC5BFW6Gv.w/8j9SElOdaoriWOR/Rf9uYoe21Cyta';

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
