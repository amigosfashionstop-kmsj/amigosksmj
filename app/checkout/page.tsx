'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCart } from '@/lib/store/cart-store';
import { formatPrice } from '@/lib/utils';
import { ShieldCheck, Lock, ArrowRight, MessageCircle, AlertCircle, Upload, X } from 'lucide-react';

const INDIAN_STATES = [
  'Maharashtra', 'Gujarat', 'Karnataka', 'Goa', 'Madhya Pradesh', 
  'Delhi', 'Rajasthan', 'Punjab', 'Haryana', 'Uttar Pradesh', 
  'West Bengal', 'Tamil Nadu', 'Telangana', 'Andhra Pradesh', 'Kerala', 'Other State / UT'
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart } = useCart();
  const [isMounted, setIsMounted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: 'Maharashtra',
    pincode: ''
  });

  const [paymentScreenshot, setPaymentScreenshot] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = subtotal > 2000 ? 0 : 99;
  const grandTotal = subtotal + shippingFee;

  // We read the UPI ID from env or fallback to user provided one
  const upiId = process.env.NEXT_PUBLIC_UPI_ID || '9820140138@okbizaxis';

  useEffect(() => {
    setIsMounted(true);
    if (items.length === 0) {
      router.push('/cart');
    }
  }, [items.length, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match('image.*')) {
      setErrorMsg('Please upload a valid image file (JPG, PNG).');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('File size must be under 5MB.');
      return;
    }

    setPaymentScreenshot(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setErrorMsg('');
  };

  const removeScreenshot = () => {
    setPaymentScreenshot(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
  };

  const copyUpiId = async () => {
    try {
      await navigator.clipboard.writeText(upiId);
      alert('UPI ID copied to clipboard!');
    } catch (err) {
      // ignore
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (items.length === 0) {
      setErrorMsg('Your bag is empty.');
      return;
    }

    if (!formData.name || !formData.phone || !formData.address || !formData.pincode) {
      setErrorMsg('Please complete all required address details.');
      return;
    }

    if (!paymentScreenshot) {
      setErrorMsg('Please upload your payment screenshot before placing the order.');
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Upload screenshot
      setIsUploading(true);
      const fileData = new FormData();
      fileData.append('file', paymentScreenshot);
      fileData.append('bucket', 'payment-screenshots');

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: fileData
      });

      if (!uploadRes.ok) {
        throw new Error('Screenshot upload failed. Please try again.');
      }
      
      const { url: screenshotUrl } = await uploadRes.json();
      setIsUploading(false);

      // 2. Submit order
      const orderPayload = {
        order: {
          ...formData,
          subtotal,
          shippingFee,
          total: grandTotal,
          paymentScreenshot: screenshotUrl
        },
        items: items.map(i => ({
          productId: i.product.id,
          sku: i.product.sku || i.product.code,
          name: i.product.name,
          size: i.size,
          quantity: i.quantity,
          price: i.price
        }))
      };

      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      if (!orderRes.ok) {
        throw new Error('Failed to create order. Please contact support.');
      }

      const { orderId } = await orderRes.json();

      // Clear cart & redirect
      clearCart();
      router.push(`/order-success/${orderId}`);

    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong.');
      setIsProcessing(false);
      setIsUploading(false);
    }
  };

  if (!isMounted || items.length === 0) return null;

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold text-brand-charcoal mt-1">
            Secure Checkout
          </h1>
        </div>

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 1. Address Details */}
            <div className="bg-white p-6 rounded-xl border border-stone-200/80 shadow-xs space-y-4">
              <h2 className="font-serif text-lg font-bold text-brand-charcoal border-b border-stone-200 pb-2">
                1. Delivery Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="sm:col-span-2">
                  <label className="block font-medium text-stone-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-stone-300 rounded focus:border-brand-wine focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-medium text-stone-700 mb-1">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-stone-300 rounded focus:border-brand-wine focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-medium text-stone-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-stone-300 rounded focus:border-brand-wine focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-medium text-stone-700 mb-1">
                    Full Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-stone-300 rounded focus:border-brand-wine focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-medium text-stone-700 mb-1">
                    City <span className="text-red-500">*</span>
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
                    PIN Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    required
                    value={formData.pincode}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-stone-300 rounded focus:border-brand-wine focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
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
            </div>

            {/* 2. Payment Section */}
            <div className="bg-white p-6 rounded-xl border border-stone-200/80 shadow-xs space-y-4">
              <h2 className="font-serif text-lg font-bold text-brand-charcoal border-b border-stone-200 pb-2 flex items-center justify-between">
                <span>2. Pay Using UPI</span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] uppercase font-bold px-2 py-0.5 rounded">0% Processing Fee</span>
              </h2>
              
              <div className="flex flex-col md:flex-row gap-6 items-center pt-2">
                <div className="w-48 h-48 relative border-2 border-brand-wine/20 rounded-xl overflow-hidden shadow-sm shrink-0">
                  <Image 
                    src="/images/brand/upi-qr.jpg" 
                    alt="UPI QR Code" 
                    fill 
                    className="object-cover"
                  />
                </div>
                
                <div className="flex-1 space-y-3 text-center md:text-left">
                  <p className="text-sm text-stone-600">
                    Scan the QR code using Google Pay, PhonePe, Paytm, or any UPI app to pay 
                    <strong className="text-brand-wine text-lg block mt-1">{formatPrice(grandTotal)}</strong>
                  </p>
                  
                  <div className="bg-stone-50 border border-stone-200 rounded p-3 text-center">
                    <p className="text-xs text-stone-500 mb-1">Or use UPI ID</p>
                    <div className="flex items-center justify-center gap-2">
                      <span className="font-mono text-sm font-bold text-stone-800">{upiId}</span>
                      <button 
                        type="button" 
                        onClick={copyUpiId}
                        className="text-xs text-brand-wine hover:underline font-semibold"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Screenshot Upload */}
              <div className="pt-4 mt-4 border-t border-stone-100">
                <label className="block font-bold text-brand-charcoal text-sm mb-2">
                  Upload Payment Screenshot <span className="text-red-500">*</span>
                </label>
                
                {!previewUrl ? (
                  <div className="border-2 border-dashed border-stone-300 rounded-lg p-6 flex flex-col items-center justify-center hover:bg-stone-50 transition-colors cursor-pointer relative">
                    <Upload className="w-8 h-8 text-stone-400 mb-2" />
                    <p className="text-xs text-stone-600 font-medium">Click to select screenshot</p>
                    <p className="text-[10px] text-stone-400 mt-1">JPG or PNG (max 5MB)</p>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileSelect}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                ) : (
                  <div className="relative inline-block border border-stone-200 rounded-lg p-2 bg-stone-50">
                    <div className="relative h-32 w-24 rounded overflow-hidden">
                      <Image src={previewUrl} alt="Screenshot" fill className="object-cover" />
                    </div>
                    <button
                      type="button"
                      onClick={removeScreenshot}
                      className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow hover:bg-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    <p className="text-[10px] text-emerald-600 font-semibold text-center mt-2">Attached!</p>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-xl border border-stone-200/80 shadow-xs space-y-4 sticky top-28">
              <h2 className="font-serif text-lg font-bold text-brand-charcoal border-b border-stone-200 pb-2">
                Order Summary ({items.length} items)
              </h2>

              <div className="divide-y divide-stone-100 max-h-60 overflow-y-auto pr-1 space-y-2">
                {items.map(item => (
                  <div key={`${item.id}-${item.size}`} className="pt-2 first:pt-0 flex items-center gap-3">
                    <div className="relative w-12 h-16 rounded overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                      <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover object-top" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-brand-charcoal truncate">{item.product.name}</p>
                      <p className="text-[11px] text-stone-500">
                        Size: <strong>{item.size}</strong> × {item.quantity}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-brand-wine shrink-0">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-stone-200 space-y-2 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-stone-800">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shippingFee === 0 ? <span className="text-emerald-700 font-semibold">FREE</span> : formatPrice(shippingFee)}</span>
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

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-4 bg-brand-wine hover:bg-brand-wine-dark text-white rounded-md font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <Lock className="w-4 h-4 text-brand-gold" />
                <span>
                  {isUploading ? 'Uploading Screenshot...' : isProcessing ? 'Placing Order...' : 'Place Order'}
                </span>
              </button>

              <div className="pt-2 text-center text-[10px] text-stone-400 flex flex-col items-center justify-center">
                <span>By placing this order, you agree to our Terms & Conditions.</span>
                <span>Your order will be confirmed once payment is verified.</span>
              </div>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
