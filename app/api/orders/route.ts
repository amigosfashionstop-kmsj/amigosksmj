import { NextRequest, NextResponse } from 'next/server';
import { getAdminSupabase } from '@/lib/supabase';
import { requireAdminAPI } from '@/lib/admin-auth';
import { createOrderTrackingToken } from '@/lib/order-tracking';

export const dynamic = 'force-dynamic';

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
    const body = await request.json();
    if (!body || typeof body !== 'object' || Array.isArray(body)) return NextResponse.json({ error: 'Invalid order details' }, { status: 400 });
    const { order, items } = body;
    if (!order || !Array.isArray(items) || items.length < 1 || items.length > 30) {
      return NextResponse.json({ error: 'Invalid order details' }, { status: 400 });
    }
    const phone = typeof order.phone === 'string' ? order.phone : order.mobile;
    const required = ['name', 'address', 'city', 'state', 'pincode', 'paymentScreenshot'];
    if (required.some(key => typeof order[key] !== 'string' || !order[key].trim())) {
      return NextResponse.json({ error: 'Please complete all required checkout details' }, { status: 400 });
    }
    if (typeof phone !== 'string' || !phone.trim() || !/^https:\/\//i.test(order.paymentScreenshot) || order.name.length > 120 || phone.length > 32 || order.address.length > 500 || order.city.length > 120 || order.state.length > 120 || order.pincode.length > 20) {
      return NextResponse.json({ error: 'Invalid checkout details' }, { status: 400 });
    }
    if (order.email !== undefined && order.email !== null && (typeof order.email !== 'string' || order.email.length > 254)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }
    try {
      const screenshot = new URL(order.paymentScreenshot);
      const supabaseOrigin = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL || '').origin;
      if (screenshot.origin !== supabaseOrigin || !screenshot.pathname.includes('/storage/v1/object/public/payment-screenshots/')) {
        return NextResponse.json({ error: 'Invalid payment screenshot' }, { status: 400 });
      }
    } catch {
      return NextResponse.json({ error: 'Invalid payment screenshot' }, { status: 400 });
    }

    const quantities = new Map<string, number>();
    for (const item of items) {
      if (typeof item?.productId !== 'string' || typeof item?.size !== 'string' || !Number.isInteger(item?.quantity) || item.quantity < 1 || item.quantity > 10) {
        return NextResponse.json({ error: 'Invalid product selection' }, { status: 400 });
      }
      const key = `${item.productId}:${item.size}`;
      quantities.set(key, (quantities.get(key) || 0) + item.quantity);
      if (quantities.get(key)! > 10) return NextResponse.json({ error: 'Maximum quantity per size is 10' }, { status: 400 });
    }

    const productIds = [...new Set(items.map((item: any) => item.productId))];
    const supabase = getAdminSupabase();
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, sku, code, name, price, sale_price, is_clearance, product_variants(size, stock)')
      .in('id', productIds);
    if (productsError) throw productsError;
    if (!products || products.length !== productIds.length) return NextResponse.json({ error: 'A selected product is no longer available' }, { status: 409 });

    const productById = new Map(products.map((product: any) => [product.id, product]));
    let subtotal = 0;
    const dbItems = items.map((item: any) => {
      const product: any = productById.get(item.productId);
      const variant = product?.product_variants?.find((entry: any) => entry.size === item.size);
      if (!variant || variant.stock < item.quantity) throw new OrderRequestError(`${product?.name || 'Product'} in size ${item.size} has insufficient stock`);
      const unitPrice = Number(product.is_clearance && product.sale_price ? product.sale_price : product.price);
      if (!Number.isFinite(unitPrice) || unitPrice <= 0) throw new OrderRequestError('Invalid product price');
      subtotal += unitPrice * item.quantity;
      return {
        product_id: product.id,
        sku: product.sku || product.code,
        product_name: product.name,
        size: item.size,
        quantity: item.quantity,
        unit_price: unitPrice,
        total_price: unitPrice * item.quantity,
      };
    });
    const shippingAmount = subtotal > 2000 ? 0 : 99;
    const totalAmount = subtotal + shippingAmount;

    // Generate order number (e.g. AFS-1001)
    const orderNumber = `AFS-${crypto.randomUUID().replace(/-/g, '').slice(0, 16).toUpperCase()}`;

    // 1. Insert order
    const { data: insertedOrder, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        customer_name: order.name,
        phone: phone.trim(),
        email: order.email || null,
        address: order.address,
        city: order.city,
        state: order.state,
        pincode: order.pincode,
        subtotal,
        shipping_amount: shippingAmount,
        total_amount: totalAmount,
        payment_method: 'UPI',
        payment_status: 'Pending Verification',
        payment_screenshot_url: order.paymentScreenshot || null,
        order_status: 'New'
      })
      .select('id, order_number')
      .single();

    if (orderError) throw orderError;

    // 2. Insert items
    const orderedItems = dbItems.map((item: any) => ({ ...item, order_id: insertedOrder.id }));

    const { error: itemsError } = await supabase.from('order_items').insert(orderedItems);
    if (itemsError) throw itemsError;

    return NextResponse.json({ success: true, orderId: insertedOrder.order_number, trackingToken: await createOrderTrackingToken(insertedOrder.order_number) });
  } catch (error: any) {
    console.error('Create order error:', error);
    if (error instanceof OrderRequestError) return NextResponse.json({ error: error.message }, { status: 409 });
    return NextResponse.json({ error: error.message || 'Failed to place order' }, { status: 500 });
  }
}

class OrderRequestError extends Error {}
