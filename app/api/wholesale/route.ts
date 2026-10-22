import { NextRequest, NextResponse } from 'next/server';
import { getAdminSupabase } from '@/lib/supabase';
import { requireAdminAPI } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  if (!(await requireAdminAPI(request))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data, error } = await getAdminSupabase()
    .from('wholesale_leads')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: 'Unable to load wholesale enquiries' }, { status: 500 });
  return NextResponse.json({ leads: data });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body || typeof body !== 'object' || Array.isArray(body)) return NextResponse.json({ error: 'Invalid enquiry' }, { status: 400 });
    const { name, businessName, phone, email, city, quantity, message } = body;

    if (typeof name !== 'string' || typeof businessName !== 'string' || typeof phone !== 'string' || !name.trim() || !businessName.trim() || !phone.trim()) {
      return NextResponse.json({ error: 'Name, business name, and phone are required' }, { status: 400 });
    }

    if (name.length > 120 || businessName.length > 160 || phone.length > 32 || (email && (typeof email !== 'string' || email.length > 254)) || (city && (typeof city !== 'string' || city.length > 160)) || (message && (typeof message !== 'string' || message.length > 2000))) {
      return NextResponse.json({ error: 'Please check the enquiry details and try again' }, { status: 400 });
    }

    const quantityText = typeof quantity === 'string' ? quantity : '';
    const quantityValue = Number(quantityText.match(/\d+/)?.[0]);
    const { data: lead, error } = await getAdminSupabase()
      .from('wholesale_leads')
      .insert({
        name: name.trim(),
        business_name: businessName.trim(),
        mobile: phone.trim(),
        email: typeof email === 'string' && email.trim() ? email.trim() : null,
        location: typeof city === 'string' && city.trim() ? city.trim() : null,
        products_interested: null,
        quantity: Number.isFinite(quantityValue) ? quantityValue : null,
        message: typeof message === 'string' && message.trim() ? `${quantityText ? `Estimated order: ${quantityText}. ` : ''}${message.trim()}` : quantityText ? `Estimated order: ${quantityText}` : null,
      })
      .select('id, name, business_name, mobile, email, location, quantity, message, status, created_at')
      .single();

    if (error) {
      console.error('Save wholesale enquiry error:', error);
      return NextResponse.json({ error: 'We could not save your enquiry. Please try again.' }, { status: 503 });
    }

    return NextResponse.json({ success: true, lead });
  } catch {
    return NextResponse.json({ error: 'Unable to process enquiry' }, { status: 400 });
  }
}
