import { NextRequest, NextResponse } from 'next/server';
import { getAdminSupabase } from '@/lib/supabase';
import { requireAdminAPI } from '@/lib/admin-auth';
import { verifyOrderTrackingToken } from '@/lib/order-tracking';

export async function GET(request: NextRequest, { params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;
  const isAdmin = await requireAdminAPI(request);
  if (!isAdmin && !(await verifyOrderTrackingToken(request.nextUrl.searchParams.get('token') || '', orderId))) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404, headers: { 'Cache-Control': 'no-store' } });
  }
  const supabase = getAdminSupabase();
  const { data, error } = await supabase
    .from('orders')
    .select(isAdmin ? '*, order_items(*)' : 'id, order_number, total_amount, payment_method, payment_status, order_status, tracking_number, created_at, order_items(id, sku, product_name, size, quantity, unit_price, total_price)')
    .eq('order_number', orderId)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }

  if (isAdmin) return NextResponse.json({ order: data }, { headers: { 'Cache-Control': 'no-store' } });

  return NextResponse.json({
    order: {
      order_number: data.order_number,
      total_amount: data.total_amount,
      payment_method: data.payment_method,
      payment_status: data.payment_status,
      order_status: data.order_status,
      tracking_number: data.tracking_number,
      created_at: data.created_at,
      order_items: data.order_items,
    },
  }, { headers: { 'Cache-Control': 'no-store' } });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ orderId: string }> }) {
  const isAdmin = await requireAdminAPI(request);
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { orderId } = await params;
  try {
    const body = await request.json();
    const supabase = getAdminSupabase();
    
    // Check if we are verifying payment
    if (body.payment_status === 'Paid' && body.order_status === 'Confirmed') {
      // Need to deduct stock!
      const { data: orderData } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('order_number', orderId)
        .single();
        
      if (orderData && orderData.payment_status !== 'Paid') {
        for (const item of orderData.order_items) {
          if (item.product_id) {
            // Deduct stock via raw RPC or manual update
            const { data: variantData } = await supabase
              .from('product_variants')
              .select('stock')
              .eq('product_id', item.product_id)
              .eq('size', item.size)
              .single();
              
            if (variantData) {
              await supabase
                .from('product_variants')
                .update({ stock: Math.max(0, variantData.stock - item.quantity) })
                .eq('product_id', item.product_id)
                .eq('size', item.size);
            }
          }
        }
      }
    }

    const { error } = await supabase
      .from('orders')
      .update({
        ...body,
        updated_at: new Date().toISOString()
      })
      .eq('order_number', orderId);

    if (error) throw error;
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
