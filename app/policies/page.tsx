'use client';
import React, { useState } from 'react';
import { Shield, Truck, RefreshCw, FileText, Lock } from 'lucide-react';
import { STORE_INFO } from '@/lib/data/store-info';

export default function PoliciesPage() {
  const [activeTab, setActiveTab] = useState<'shipping' | 'returns' | 'privacy' | 'terms'>('shipping');

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center space-y-3 mb-10">
          <span className="text-xs font-bold text-brand-wine uppercase tracking-widest bg-brand-wine/10 px-3.5 py-1 rounded-full inline-flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" />
            <span>Store Standards</span>
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-charcoal">
            Policies & Customer Terms
          </h1>
          <p className="text-xs sm:text-sm text-stone-600">
            Clear, transparent policies for a trusted and friendly boutique experience.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {[
            { id: 'shipping', label: 'Shipping & Delivery', icon: Truck },
            { id: 'returns', label: 'Returns & Exchange', icon: RefreshCw },
            { id: 'privacy', label: 'Privacy Policy', icon: Lock },
            { id: 'terms', label: 'Terms of Service', icon: FileText }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
                  activeTab === tab.id
                    ? 'bg-brand-wine text-white shadow-sm'
                    : 'bg-white border border-stone-200 text-stone-700 hover:border-stone-400'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Box */}
        <div className="bg-white rounded-2xl p-8 border border-stone-200/80 shadow-xs text-xs sm:text-sm text-stone-700 space-y-4 leading-relaxed">
          {activeTab === 'shipping' && (
            <div className="space-y-4">
              <h2 className="font-serif text-xl font-bold text-brand-charcoal border-b border-stone-200 pb-2">
                Pan-India Shipping Policy
              </h2>
              <p>At Amigos Fashionstop, each garment is inspected, ironed, and neatly packed at our Titwala flagship boutique before dispatch.</p>
              <h3 className="font-bold text-brand-charcoal">Dispatch & Timelines</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Orders are dispatched within 24 to 48 business hours of payment confirmation.</li>
                <li><strong>Mumbai, Thane, Kalyan, Titwala:</strong> Delivered in 1 to 2 business days.</li>
                <li><strong>Rest of Maharashtra:</strong> Delivered in 2 to 3 business days.</li>
                <li><strong>All Other Indian States:</strong> Delivered in 3 to 5 business days.</li>
              </ul>
              <h3 className="font-bold text-brand-charcoal">Shipping Charges</h3>
              <p>We provide <strong>FREE Shipping</strong> across India on all prepaid orders above ?799. For orders below ?799, a nominal standard surface shipping fee of ?60 is applied at checkout.</p>
            </div>
          )}

          {activeTab === 'returns' && (
            <div className="space-y-4">
              <h2 className="font-serif text-xl font-bold text-brand-charcoal border-b border-stone-200 pb-2">
                Return & Exchange Policy
              </h2>
              <p>We want you to look and feel radiant in every outfit from Amigos. We understand that sizing can occasionally require adjustment.</p>
              <h3 className="font-bold text-brand-charcoal">Exchange Window</h3>
              <p>If you face a size discrepancy or receive a damaged item, please notify us within <strong>48 hours</strong> of delivery by sending a message on WhatsApp to <strong>{STORE_INFO.primaryPhone}</strong> with your Order ID and photo of the garment.</p>
              <h3 className="font-bold text-brand-charcoal">Eligibility Conditions</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Garments must remain unworn, unwashed, and with original tags intact.</li>
                <li>Clearance sale items marked with special final sale pricing are eligible for size exchanges subject to catalog stock availability.</li>
              </ul>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <h2 className="font-serif text-xl font-bold text-brand-charcoal border-b border-stone-200 pb-2">
                Privacy Policy
              </h2>
              <p>Amigos Fashionstop values your privacy as we would a friend&apos;s. We do not sell or lease your personal information to third parties.</p>
              <h3 className="font-bold text-brand-charcoal">Information We Collect</h3>
              <p>We collect customer names, shipping addresses, phone numbers, and email addresses solely to process orders, communicate shipment tracking, and provide personalized WhatsApp support.</p>
              <h3 className="font-bold text-brand-charcoal">Payment Security</h3>
              <p>All online transactions are encrypted and processed through Razorpay. We do not store credit card numbers, debit card PINs, or netbanking passwords on our servers.</p>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="space-y-4">
              <h2 className="font-serif text-xl font-bold text-brand-charcoal border-b border-stone-200 pb-2">
                Terms of Service
              </h2>
              <p>By browsing, inquiring, or purchasing through Amigos Fashionstop, you agree to our standard boutique terms of service.</p>
              <h3 className="font-bold text-brand-charcoal">Product Imagery & Handcrafted Variations</h3>
              <p>Our photography represents authentic inventory photographed under clean studio and natural light. Slight variations in natural fabric weave or screen color calibration may occur.</p>
              <h3 className="font-bold text-brand-charcoal">Contact & Governing Law</h3>
              <p>Amigos Fashionstop is registered and operated in Titwala, District Thane, Maharashtra 421605. Any inquiries can be directed to amigosfashionstop@gmail.com.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
