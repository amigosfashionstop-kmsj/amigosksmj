import { NextRequest, NextResponse } from 'next/server';
import { getAdminSupabase } from '@/lib/supabase';
import { requireAdminAPI } from '@/lib/admin-auth';

export async function GET(request: NextRequest) {
  // Try admin check
  const isAdmin = await requireAdminAPI(request);
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = getAdminSupabase();
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ orders: data });
}

export async function POST(request: NextRequest) {
  // Anyone can create an order (customer checkout)
  try {
    const { order, items } = await request.json();
    
    // Generate order number (e.g. AFS-1001)
    const orderNumber = `AFS-${Math.floor(100000 + Math.random() * 900000)}`;

    const supabase = getAdminSupabase(); // Admin client to insert

    // 1. Insert order
    const { data: insertedOrder, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        customer_name: order.name,
        phone: order.mobile,
        email: order.email || null,
        address: order.address,
        city: order.city,
        state: order.state,
        pincode: order.pincode,
        subtotal: order.subtotal,
        total_amount: order.total,
        payment_method: 'UPI',
        payment_status: 'Pending Verification',
        payment_screenshot_url: order.paymentScreenshot || null,
        order_status: 'New'
      })
      .select('id, order_number')
      .single();

    if (orderError) throw orderError;

    // 2. Insert items
    const dbItems = items.map((item: any) => ({
      order_id: insertedOrder.id,
      product_id: item.productId,
      sku: item.sku,
      product_name: item.name,
      size: item.size,
      quantity: item.quantity,
      unit_price: item.price,
      total_price: item.price * item.quantity
    }));

    const { error: itemsError } = await supabase.from('order_items').insert(dbItems);
    if (itemsError) throw itemsError;

    return NextResponse.json({ success: true, orderId: insertedOrder.order_number });
  } catch (error: any) {
    console.error('Create order error:', error);
    return NextResponse.json({ error: error.message || 'Failed to place order' }, { status: 500 });
  }
}
