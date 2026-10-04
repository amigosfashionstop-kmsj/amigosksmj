import { NextResponse } from 'next/server';
import { getOrders, saveOrder } from '@/lib/db';

export async function GET() {
  const orders = getOrders();
  return NextResponse.json(orders);
}

export async function POST(request: Request) {
  try {
    const order = await request.json();
    saveOrder(order);
    return NextResponse.json({ success: true, orderId: order.orderId });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}
