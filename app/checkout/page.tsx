'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/lib/store/cart-store';
import { formatPrice } from '@/lib/utils';
import { checkPincode, PincodeCheckResult } from '@/lib/services/shipping';
import { STORE_INFO } from '@/lib/data/store-info';
import { ShieldCheck, Lock, CheckCircle2, ArrowRight, MessageCircle, AlertCircle, Sparkles } from 'lucide-react';

const INDIAN_STATES = [
  'Maharashtra',
  'Gujarat',
  'Karnataka',
  'Goa',
  'Madhya Pradesh',
  'Delhi',
  'Rajasthan',
  'Punjab',
  'Haryana',
  'Uttar Pradesh',
  'West Bengal',
  'Tamil Nadu',
  'Telangana',
  'Andhra Pradesh',
  'Kerala',
  'Other State / UT'
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, discount, shippingFee, grandTotal, coupon, clearCart } = useCart();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address1: '',
    address2: '',
    city: 'Titwala',
    state: 'Maharashtra',
    pincode: '421605',
    notes: ''
  });

  const [paymentMode, setPaymentMode] = useState<'razorpay' | 'whatsapp'>('razorpay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState<PincodeCheckResult | null>(checkPincode('421605'));

  useEffect(() => {
    try {
      const saved = localStorage.getItem('amigos_customer_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        setFormData(parsed);
        if (parsed.pincode?.length === 6) {
          setPincodeStatus(checkPincode(parsed.pincode));
        }
      }
    } catch (e) {}
  }, []);

  const handlePincodeChange = (pincode: string) => {
    setFormData(prev => ({ ...prev, pincode }));
    if (pincode.length === 6) {
      const result = checkPincode(pincode);
      setPincodeStatus(result);
      if (result.state) {
        setFormData(prev => ({ ...prev, state: result.state }));
      }
      if (result.city && result.city !== 'All India Serviceable') {
        setFormData(prev => ({ ...prev, city: result.city }));
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'pincode') {
      handlePincodeChange(value);
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (items.length === 0) {
      setErrorMsg('Your bag is empty. Please add items before checking out.');
      return;
    }

    if (!formData.name || !formData.phone || !formData.address1 || !formData.pincode) {
      setErrorMsg('Please complete all required address and contact details.');
      return;
    }

    setIsProcessing(true);

    try {
      const orderNumber = 'AFS-' + Math.floor(100000 + Math.random() * 900000);
      const fullOrder = {
        orderId: orderNumber,
        date: new Date().toISOString(),
        customer: formData,
        items: items,
        totals: {
          subtotal,
          discount,
          shippingFee,
          grandTotal,
          couponCode: coupon?.code || null
        },
        payment: {
          method: 'QR Code (WhatsApp Verified)',
          orderId: orderNumber,
          paymentId: 'MANUAL',
          status: 'PENDING VERIFICATION'
        },
        delivery: {
          status: 'New',
          carrier: 'Amigos Express Surface',
          trackingNumber: 'TRK' + Math.floor(1000000 + Math.random() * 9000000),
          estimatedTimeline: pincodeStatus?.estimatedDays || '2-4 Days'
        }
      };

      // 1. Save to JSON Backend via API Route
      try {
        await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(fullOrder)
        });
      } catch (err) {
        console.error('Failed to sync to backend', err);
      }

      // 2. Save order to localStorage history
      try {
        const historyStr = localStorage.getItem('amigos_order_history_v1') || '[]';
        const history = JSON.parse(historyStr);
        history.unshift(fullOrder);
        localStorage.setItem('amigos_order_history_v1', JSON.stringify(history));
        sessionStorage.setItem('amigos_latest_order', JSON.stringify(fullOrder));
        localStorage.setItem('amigos_customer_v1', JSON.stringify(formData));
      } catch (err) {
        console.error('Failed to save order to localStorage', err);
      }

      // 3. Clear cart
      clearCart();

      // 4. Open WhatsApp
      const waMessage = `Hi Amigos Fashionstop! 👋\n\nI have placed order *${orderNumber}* and paid *Rs ${grandTotal}* via QR code.\n\n*Customer Details:*\nName: ${formData.name}\nPhone: ${formData.phone}\nCity: ${formData.city}, ${formData.state} - ${formData.pincode}\n\nPlease confirm my order processing.`;
      const waUrl = `https://wa.me/${STORE_INFO.primaryWhatsApp}?text=${encodeURIComponent(waMessage)}`;
      window.open(waUrl, '_blank');

      // 5. Redirect to order confirmation
      router.push(`/order-success/${orderNumber}`);
    } catch (err: any) {
      setErrorMsg('Checkout failed: ' + (err.message || 'Please retry'));
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center">
        <h2 className="font-serif text-2xl font-bold text-brand-charcoal mb-2">Your Bag is Empty</h2>
        <p className="text-xs text-stone-500 mb-6">You need to add products to your cart before proceeding to checkout.</p>
        <Link href="/shop" className="px-6 py-3 bg-brand-wine text-white text-xs font-semibold rounded-md shadow">
          Explore Amigos Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <span className="text-[11px] font-bold text-brand-wine uppercase tracking-widest">
            Secure Indian Checkout
          </span>
          <h1 className="font-serif text-3xl font-bold text-brand-charcoal mt-1">
            Shipping & Payment
          </h1>
        </div>

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left: Customer Address & Details */}
          <div className="lg:col-span-7 space-y-6">
            {/* Contact Details */}
            <div className="bg-white p-6 rounded-xl border border-stone-200/80 shadow-xs space-y-4">
              <h2 className="font-serif text-lg font-bold text-brand-charcoal border-b border-stone-200 pb-2">
                1. Contact Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-medium text-stone-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="e.g. Pooja Sharma"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-stone-300 rounded focus:border-brand-wine focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-medium text-stone-700 mb-1">
                    WhatsApp / Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="10-digit number (e.g. 9820140138)"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-stone-300 rounded focus:border-brand-wine focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-medium text-stone-700 mb-1">
                    Email Address (for order receipt & tracking)
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="e.g. pooja@gmail.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-stone-300 rounded focus:border-brand-wine focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white p-6 rounded-xl border border-stone-200/80 shadow-xs space-y-4">
              <h2 className="font-serif text-lg font-bold text-brand-charcoal border-b border-stone-200 pb-2">
                2. Shipping Address in India
              </h2>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-medium text-stone-700 mb-1">
                    Flat / House No. / Building Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="address1"
                    required
                    placeholder="e.g. Flat 402, Mayuresh Heights"
                    value={formData.address1}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-stone-300 rounded focus:border-brand-wine focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-medium text-stone-700 mb-1">
                    Street / Area / Landmark
                  </label>
                  <input
                    type="text"
                    name="address2"
                    placeholder="e.g. Near Ganesh Mandir Road"
                    value={formData.address2}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-stone-300 rounded focus:border-brand-wine focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-medium text-stone-700 mb-1">
                      Pincode <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      required
                      maxLength={6}
                      placeholder="421605"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-stone-300 rounded focus:border-brand-wine focus:outline-none font-semibold text-brand-charcoal"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-stone-700 mb-1">
                      City / Town <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-stone-300 rounded focus:border-brand-wine focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-stone-700 mb-1">
                      State <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-stone-300 rounded focus:border-brand-wine focus:outline-none bg-white"
                    >
                      {INDIAN_STATES.map(st => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {pincodeStatus && pincodeStatus.serviceable && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>
                      Pincode <strong>{formData.pincode}</strong> is serviceable! Expected delivery in <strong>{pincodeStatus.estimatedDays}</strong>.
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* QR Code Payment Section */}
            <div className="bg-white p-6 rounded-xl border border-stone-200/80 shadow-xs space-y-4">
              <h2 className="font-serif text-lg font-bold text-brand-charcoal border-b border-stone-200 pb-2">
                3. Scan QR Code & Pay
              </h2>
              
              <div className="flex flex-col items-center space-y-4 pt-2">
                <div className="w-48 h-48 relative border-4 border-stone-100 rounded-xl overflow-hidden shadow-sm">
                  {/* The User must replace this placeholder with their actual QR code */}
                  <Image 
                    src="/images/brand/logo.png" 
                    alt="Payment QR Code" 
                    fill 
                    className="object-contain p-4 bg-stone-50"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-white font-bold text-center text-xs p-2">
                    REPLACE WITH YOUR QR CODE IN public/images/brand
                  </div>
                </div>
                
                <div className="text-center">
                  <p className="text-xs text-stone-600 font-medium">Scan to pay <span className="font-bold text-brand-wine text-base">{formatPrice(grandTotal)}</span></p>
                  <p className="text-[11px] text-stone-500 mt-1 max-w-xs mx-auto">
                    After completing the payment, click the confirm button below. It will open WhatsApp with your order details for our team to process immediately.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-xl border border-stone-200/80 shadow-xs space-y-4 sticky top-28">
              <h2 className="font-serif text-lg font-bold text-brand-charcoal border-b border-stone-200 pb-2">
                Order Summary ({items.length} styles)
              </h2>

              {/* Items Preview */}
              <div className="divide-y divide-stone-100 max-h-60 overflow-y-auto pr-1 space-y-2">
                {items.map(item => (
                  <div key={item.id} className="pt-2 first:pt-0 flex items-center gap-3">
                    <div className="relative w-12 h-16 rounded overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        className="object-cover object-top"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-brand-charcoal truncate">{item.product.name}</p>
                      <p className="text-[11px] text-stone-500">
                        {item.product.code} � Size: <strong>{item.size}</strong> � Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-brand-wine shrink-0">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="pt-3 border-t border-stone-200 space-y-2 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-stone-800">{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Coupon Discount ({coupon?.code})</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Pan-India Delivery</span>
                  <span>
                    {shippingFee === 0 ? (
                      <span className="text-emerald-700 font-semibold">FREE</span>
                    ) : (
                      formatPrice(shippingFee)
                    )}
                  </span>
                </div>
                <div className="pt-2 border-t border-stone-200 flex justify-between text-base font-bold text-brand-charcoal">
                  <span>Total Payable</span>
                  <span className="text-brand-wine text-lg">{formatPrice(grandTotal)}</span>
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-4 bg-brand-wine hover:bg-brand-wine-dark text-white rounded-md font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-98"
              >
                <Lock className="w-4 h-4 text-brand-gold" />
                <span>
                  {isProcessing
                    ? 'Processing...'
                    : `I Have Paid ${formatPrice(grandTotal)} - Confirm Order`}
                </span>
              </button>

              <div className="pt-2 text-center text-[11px] text-stone-400 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>256-Bit Encrypted Indian Payment Processing</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
