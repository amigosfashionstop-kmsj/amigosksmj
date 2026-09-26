'use client';
import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle, Truck, Package, MessageCircle, ArrowRight, Printer, Share2 } from 'lucide-react';
import { STORE_INFO } from '@/lib/data/store-info';
import { formatPrice } from '@/lib/utils';

interface OrderSuccessProps {
  params: Promise<{
    orderId: string;
  }>;
}

export default function OrderSuccessPage({ params }: OrderSuccessProps) {
  const { orderId } = use(params);
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('amigos_latest_order');
      if (stored) {
        setOrder(JSON.parse(stored));
      } else {
        const historyStr = localStorage.getItem('amigos_order_history_v1');
        if (historyStr) {
          const list = JSON.parse(historyStr);
          const found = list.find((o: any) => o.orderId === orderId);
          if (found) setOrder(found);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, [orderId]);

  const whatsappMessage = `Hi Amigos Fashionstop! ??
I just placed an order on your website:
?? *Order ID*: ${orderId}
?? *Amount*: ?${order?.totals?.grandTotal || 'Confirmed'}
?? *Customer*: ${order?.customer?.name || 'Amigos Shopper'}

Please confirm dispatch updates. Thank you!`;

  const whatsappShareUrl = `https://wa.me/${STORE_INFO.primaryWhatsApp}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Celebration Card */}
        <div className="bg-white rounded-2xl p-8 border border-stone-200/80 shadow-md text-center space-y-4 mb-8">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle className="w-10 h-10" />
          </div>

          <span className="text-xs font-bold text-brand-wine tracking-widest uppercase bg-brand-wine/10 px-3 py-1 rounded-full">
            Order Confirmed & Paid
          </span>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-charcoal">
            Thank you, {order?.customer?.name || 'Friend'}!
          </h1>

          <p className="text-stone-600 text-sm max-w-md mx-auto">
            Your ethnic wear order <strong className="text-brand-charcoal">#{orderId}</strong> has been received by our Titwala boutique team. We are preparing your parcel with love and boutique care.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <a
              href={whatsappShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-md text-xs font-semibold flex items-center gap-2 shadow-xs transition-all"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Share Order with Amigos WhatsApp</span>
            </a>

            <button
              onClick={() => window.print()}
              className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-md text-xs font-semibold flex items-center gap-2 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Receipt</span>
            </button>
          </div>
        </div>

        {/* Order Details & Summary Card */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-200 gap-2">
            <div>
              <p className="text-xs text-stone-400">Order Reference</p>
              <p className="font-serif text-lg font-bold text-brand-charcoal">{orderId}</p>
            </div>
            <div>
              <p className="text-xs text-stone-400">Estimated Delivery</p>
              <p className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5 mt-0.5">
                <Truck className="w-4 h-4" />
                <span>{order?.delivery?.estimatedTimeline || '2 � 3 Business Days'}</span>
              </p>
            </div>
          </div>

          {/* Shipping Address & Contact Summary */}
          {order?.customer && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-stone-50 p-4 rounded-xl">
              <div>
                <strong className="block text-stone-700 mb-1">Delivering To:</strong>
                <p className="text-stone-600 leading-relaxed">
                  {order.customer.name}<br />
                  {order.customer.address1}, {order.customer.address2}<br />
                  {order.customer.city}, {order.customer.state} - {order.customer.pincode}
                </p>
              </div>
              <div>
                <strong className="block text-stone-700 mb-1">Contact:</strong>
                <p className="text-stone-600">
                  Phone: {order.customer.phone}<br />
                  {order.customer.email && <>Email: {order.customer.email}<br /></>}
                  Payment Mode: {order?.payment?.method || 'Prepaid Razorpay'}
                </p>
              </div>
            </div>
          )}

          {/* Purchased Items Table */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-3">
              Items in this Shipment
            </h3>
            <div className="divide-y divide-stone-100">
              {order?.items?.map((item: any) => (
                <div key={item.id} className="py-3 flex items-center gap-4">
                  <div className="relative w-14 h-16 rounded overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                    <Image
                      src={item.product?.images?.[0] || '/images/brand/logo.png'}
                      alt={item.product?.name || 'Product'}
                      fill
                      className="object-cover object-top"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-brand-charcoal">{item.product?.name}</p>
                    <p className="text-[11px] text-stone-500">
                      Code: {item.product?.code} � Size: <strong>{item.size}</strong> � Quantity: {item.quantity}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-brand-wine">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Total Row */}
          {order?.totals && (
            <div className="pt-4 border-t border-stone-200 space-y-1.5 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(order.totals.subtotal)}</span>
              </div>
              {order.totals.discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Discount Applied ({order.totals.couponCode})</span>
                  <span>-{formatPrice(order.totals.discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{order.totals.shippingFee === 0 ? 'FREE' : formatPrice(order.totals.shippingFee)}</span>
              </div>
              <div className="pt-2 border-t border-stone-200 flex justify-between text-base font-bold text-brand-charcoal">
                <span>Total Paid</span>
                <span className="text-brand-wine text-lg">{formatPrice(order.totals.grandTotal)}</span>
              </div>
            </div>
          )}

          {/* Next Steps Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row gap-3">
            <Link
              href="/shop"
              className="flex-1 py-3 bg-brand-wine hover:bg-brand-wine-dark text-white rounded-md text-xs font-semibold text-center transition-colors flex items-center justify-center gap-2"
            >
              <span>Continue Shopping</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/account"
              className="flex-1 py-3 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-md text-xs font-semibold text-center transition-colors"
            >
              View in My Orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
