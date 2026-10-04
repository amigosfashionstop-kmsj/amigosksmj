import { NextResponse } from 'next/server';
import { createRazorpayOrder, verifyRazorpaySignature } from '@/lib/services/razorpay';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, customer, items, paymentMethod } = body;

    if (!amount || !customer || !items) {
      return NextResponse.json({ error: 'Missing required order details' }, { status: 400 });
    }

    const orderNumber = 'AFS-' + Math.floor(100000 + Math.random() * 900000);
    const rzpOrder = await createRazorpayOrder({
      amount: amount,
      receipt: orderNumber,
      notes: {
        customerName: customer.name,
        phone: customer.phone,
        city: customer.city
      }
    });

    return NextResponse.json({
      success: true,
      orderNumber,
      razorpayOrder: rzpOrder
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Checkout failed' }, { status: 500 });
  }
}
