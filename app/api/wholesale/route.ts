import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, businessName, phone, email, city, quantity, message } = body;

    if (!name || !businessName || !phone) {
      return NextResponse.json({ error: 'Name, business name, and phone are required' }, { status: 400 });
    }

    const lead = {
      id: 'lead_' + Date.now(),
      date: new Date().toISOString(),
      name,
      businessName,
      phone,
      email,
      city,
      quantity,
      message,
      status: 'New'
    };

    return NextResponse.json({ success: true, lead });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
