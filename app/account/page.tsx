'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useWishlist } from '@/lib/store/wishlist-store';
import { useCart } from '@/lib/store/cart-store';
import { formatPrice } from '@/lib/utils';
import { ProductCard } from '@/components/ui/ProductCard';
import { User, Package, Heart, MapPin, ShoppingBag, ExternalLink, Trash2 } from 'lucide-react';
import { STORE_INFO } from '@/lib/data/store-info';

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'profile'>('orders');
  const [orders, setOrders] = useState<any[]>([]);
  const { wishlist } = useWishlist();
  const { addItem } = useCart();

  useEffect(() => {
    try {
      const historyStr = localStorage.getItem('amigos_order_history_v1');
      if (historyStr) setOrders(JSON.parse(historyStr));
    } catch (e) {
      console.error(e);
    }
  }, []);

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Profile Badge */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200/80 shadow-xs mb-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-16 h-16 rounded-full bg-brand-wine/10 text-brand-wine flex items-center justify-center font-serif text-2xl font-bold">
              <User className="w-8 h-8" />
            </div>
            <div>
              <h1 className="font-serif text-2xl font-bold text-brand-charcoal">
                My Amigos Account
              </h1>
              <p className="text-xs text-stone-500 mt-0.5">
                Manage your orders, saved ethnic styles, and delivery addresses.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/shop"
              className="px-4 py-2 bg-brand-wine text-white text-xs font-semibold rounded-md shadow-xs"
            >
              Shop New In
            </Link>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-stone-200 mb-6 gap-6 text-sm">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 font-semibold flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'orders'
                ? 'border-brand-wine text-brand-wine'
                : 'border-transparent text-stone-600 hover:text-brand-charcoal'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('wishlist')}
            className={`pb-3 font-semibold flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'wishlist'
                ? 'border-brand-wine text-brand-wine'
                : 'border-transparent text-stone-600 hover:text-brand-charcoal'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Wishlist ({wishlist.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-3 font-semibold flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'profile'
                ? 'border-brand-wine text-brand-wine'
                : 'border-transparent text-stone-600 hover:text-brand-charcoal'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile & Addresses</span>
          </button>
        </div>

        {/* Tab 1: Orders */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="bg-white rounded-xl border border-stone-200 p-12 text-center">
                <Package className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                <h3 className="font-serif text-lg font-bold text-brand-charcoal">No past orders yet</h3>
                <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto mb-4">
                  Browse our handcrafted kurti collection and place your first order with free delivery above ?799.
                </p>
                <Link
                  href="/shop"
                  className="px-5 py-2.5 bg-brand-wine text-white text-xs font-semibold rounded-md shadow-xs inline-block"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              orders.map(order => (
                <div key={order.orderId} className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-stone-100 gap-2">
                    <div>
                      <span className="text-xs text-stone-400">Order Reference</span>
                      <p className="font-serif text-base font-bold text-brand-charcoal">{order.orderId}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                        {order.delivery?.status || 'Processing'}
                      </span>
                      <p className="text-xs text-stone-400 mt-1">
                        Placed on {new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>

                  {/* Items in order */}
                  <div className="divide-y divide-stone-100">
                    {order.items?.map((item: any) => (
                      <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-12 rounded overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                            <Image
                              src={item.product?.images?.[0] || '/images/brand/logo.png'}
                              alt="Product"
                              fill
                              className="object-cover object-top"
                            />
                          </div>
                          <div>
                            <p className="font-semibold text-brand-charcoal">{item.product?.name}</p>
                            <p className="text-stone-500 text-[11px]">Size: {item.size} � Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <span className="font-bold text-brand-wine">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                    <span className="text-stone-600">
                      Shipped to: <strong>{order.customer?.city || 'Titwala'}</strong> ({order.customer?.pincode})
                    </span>
                    <span className="font-bold text-sm text-brand-wine">
                      Total: {formatPrice(order.totals?.grandTotal || 0)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: Wishlist */}
        {activeTab === 'wishlist' && (
          <div>
            {wishlist.length === 0 ? (
              <div className="bg-white rounded-xl border border-stone-200 p-12 text-center">
                <Heart className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                <h3 className="font-serif text-lg font-bold text-brand-charcoal">Your wishlist is empty</h3>
                <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto mb-4">
                  Tap the heart icon on any kurti or set to save pieces you love for later.
                </p>
                <Link
                  href="/shop"
                  className="px-5 py-2.5 bg-brand-wine text-white text-xs font-semibold rounded-md shadow-xs inline-block"
                >
                  Explore Collection
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {wishlist.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Profile */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-xs space-y-4 text-xs">
              <h3 className="font-serif text-base font-bold text-brand-charcoal border-b pb-2">
                Personal Information
              </h3>
              <div>
                <strong className="block text-stone-700">Customer Support Desk:</strong>
                <p className="text-stone-500 mt-0.5">Reach out to Samruddhi or Juily for sizing changes or order tracking.</p>
                <a href={`tel:${STORE_INFO.primaryPhone}`} className="text-brand-wine font-semibold mt-1 inline-block">
                  {STORE_INFO.primaryPhone}
                </a>
              </div>
              <div>
                <strong className="block text-stone-700">Email Address:</strong>
                <p className="text-stone-500">{STORE_INFO.email}</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-xs space-y-4 text-xs">
              <h3 className="font-serif text-base font-bold text-brand-charcoal border-b pb-2">
                Titwala Boutique Pickup
              </h3>
              <p className="text-stone-600 leading-relaxed">
                You can choose in-store pickup anytime during operating hours:
              </p>
              <p className="text-stone-700 font-medium">
                {STORE_INFO.address.line1}<br />
                {STORE_INFO.address.area}, {STORE_INFO.address.city}, Maharashtra {STORE_INFO.address.pincode}
              </p>
              <p className="text-[11px] text-brand-wine font-semibold">
                Hours: Mon�Sat: 9AM�9PM � Sun: 9AM�5PM
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
