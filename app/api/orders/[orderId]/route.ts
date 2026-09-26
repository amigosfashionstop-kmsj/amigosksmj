import { NextResponse } from 'next/server';
import { updateOrderStatus } from '@/lib/db';

export async function PATCH(request: Request, { params }: { params: Promise<{ orderId: string }> }) {
  try {
    const { orderId } = await params;
    const body = await request.json();
    
    if (body.status) {
      const updated = updateOrderStatus(orderId, body.status);
      return NextResponse.json({ success: true, order: updated });
    }
    return NextResponse.json({ success: false }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
