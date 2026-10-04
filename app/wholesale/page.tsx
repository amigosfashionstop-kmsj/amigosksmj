'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { STORE_INFO } from '@/lib/data/store-info';
import { generateWholesaleWhatsAppUrl } from '@/lib/services/whatsapp';
import { Building2, PackageCheck, Truck, MessageCircle, CheckCircle2, ShieldCheck, Sparkles, Send } from 'lucide-react';

export default function WholesalePage() {
  const [formData, setFormData] = useState({
    name: '',
    businessName: '',
    phone: '',
    email: '',
    city: '',
    quantity: '25-50 pcs',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const leadsStr = localStorage.getItem('amigos_wholesale_leads_v1') || '[]';
      const leads = JSON.parse(leadsStr);
      leads.unshift({
        id: 'lead_' + Date.now(),
        date: new Date().toISOString(),
        ...formData,
        status: 'New'
      });
      localStorage.setItem('amigos_wholesale_leads_v1', JSON.stringify(leads));
    } catch (err) {
      console.error(err);
    }
    setSubmitted(true);
  };

  const whatsappDirectUrl = generateWholesaleWhatsAppUrl(
    formData.businessName || 'My Boutique',
    formData.city || 'Maharashtra',
    formData.quantity
  );

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Wholesale Hero */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold text-brand-wine uppercase tracking-widest bg-brand-wine/10 px-3.5 py-1 rounded-full inline-flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5" />
            <span>Design � Wholesale � Retail</span>
          </span>

          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-brand-charcoal">
            Wholesale Fashion, Made Easy.
          </h1>

          <p className="text-stone-600 text-base sm:text-lg leading-relaxed font-normal">
            Looking to source women�s ethnic wear for your boutique, retail store, or online business? Explore Amigos Fashionstop collections and connect with us directly for wholesale enquiries, availability, and tiered catalog pricing.
          </p>

          <div className="pt-2">
            <a
              href={whatsappDirectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-md text-xs font-bold shadow-md transition-all"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Instant B2B Chat with Vaidehi (+91 9324767743)</span>
            </a>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-xl border border-stone-200/80 shadow-xs text-center space-y-3">
            <div className="w-12 h-12 bg-brand-wine/10 text-brand-wine rounded-full flex items-center justify-center mx-auto">
              <PackageCheck className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-brand-charcoal">Low MOQ Friendly</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Start with trial batches of 20�25 pieces across mixed sizes and prints to test high-demand silhouettes in your local market.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl border border-stone-200/80 shadow-xs text-center space-y-3">
            <div className="w-12 h-12 bg-brand-wine/10 text-brand-wine rounded-full flex items-center justify-center mx-auto">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-brand-charcoal">Authentic Fabrics</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              100% pure cotton, fluid rayon, poly silk, and chanderi fabrics with consistent dye quality and reinforced stitching.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl border border-stone-200/80 shadow-xs text-center space-y-3">
            <div className="w-12 h-12 bg-brand-wine/10 text-brand-wine rounded-full flex items-center justify-center mx-auto">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-brand-charcoal">Reliable Logistics</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Fast surface and air dispatch directly from our Titwala hub across Maharashtra, Gujarat, Karnataka, and pan-India.
            </p>
          </div>
        </div>

        {/* Inquiry Form & Side Info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 bg-white rounded-2xl border border-stone-200/80 shadow-md p-8 lg:p-12">
          {/* Left: Contact Info */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs font-bold text-brand-wine uppercase tracking-widest">
              Direct Boutique Contact
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brand-charcoal">
              Partner with Amigos
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Whether you run an established boutique in Mumbai, a retail shop in Pune, or an independent Instagram fashion page, we treat wholesale partners with the same warmth: as friends.
            </p>

            <div className="space-y-4 pt-4 border-t border-stone-200 text-xs">
              <div className="p-3 bg-stone-50 rounded-lg">
                <strong className="block text-brand-charcoal">Vaidehi Dharse</strong>
                <span className="text-stone-500">Wholesale & Inquiries Lead</span>
                <p className="font-semibold text-brand-wine mt-1">+91 9324767743</p>
              </div>

              <div className="p-3 bg-stone-50 rounded-lg">
                <strong className="block text-brand-charcoal">Samruddhi Shedage</strong>
                <span className="text-stone-500">Design & Catalog Coordination</span>
                <p className="font-semibold text-brand-wine mt-1">+91 9820140138</p>
              </div>

              <div className="p-3 bg-stone-50 rounded-lg">
                <strong className="block text-brand-charcoal">Juily Joshi</strong>
                <span className="text-stone-500">Logistics & Order Fulfilment</span>
                <p className="font-semibold text-brand-wine mt-1">+91 9892880586</p>
              </div>
            </div>
          </div>

          {/* Right: Submission Form */}
          <div className="lg:col-span-7">
            {submitted ? (
              <div className="p-8 text-center bg-emerald-50 border border-emerald-200 rounded-xl space-y-4">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h3 className="font-serif text-xl font-bold text-brand-charcoal">
                  Wholesale Enquiry Received!
                </h3>
                <p className="text-xs text-stone-600 max-w-sm mx-auto">
                  Thank you for your interest. Our wholesale manager Vaidehi will review your requirements and reach out via WhatsApp/phone within 4 business hours with our catalog PDF and tiered pricing.
                </p>
                <div className="pt-3">
                  <a
                    href={whatsappDirectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#25D366] text-white text-xs font-bold rounded-md"
                  >
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>Ping on WhatsApp Directly</span>
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <h3 className="font-serif text-lg font-bold text-brand-charcoal mb-3">
                  Submit Wholesale Enquiry
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium text-stone-700 mb-1">
                      Your Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Anjali Gupta"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-stone-300 rounded focus:border-brand-wine focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-stone-700 mb-1">
                      Business / Boutique Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Saffron Ethnic Boutique"
                      value={formData.businessName}
                      onChange={e => setFormData({ ...formData, businessName: e.target.value })}
                      className="w-full px-3 py-2 border border-stone-300 rounded focus:border-brand-wine focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium text-stone-700 mb-1">
                      WhatsApp / Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="10-digit number"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-stone-300 rounded focus:border-brand-wine focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-stone-700 mb-1">
                      City & State <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Pune, Maharashtra"
                      value={formData.city}
                      onChange={e => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-3 py-2 border border-stone-300 rounded focus:border-brand-wine focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium text-stone-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      placeholder="business@example.com"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-stone-300 rounded focus:border-brand-wine focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-stone-700 mb-1">Estimated Initial Order Units</label>
                    <select
                      value={formData.quantity}
                      onChange={e => setFormData({ ...formData, quantity: e.target.value })}
                      className="w-full px-3 py-2 border border-stone-300 rounded focus:border-brand-wine focus:outline-none bg-white"
                    >
                      <option value="20-50 pcs">20 � 50 Pieces (Starter Pack)</option>
                      <option value="50-100 pcs">50 � 100 Pieces (Retail Batch)</option>
                      <option value="100-250 pcs">100 � 250 Pieces (Distributor Batch)</option>
                      <option value="250+ pcs">250+ Pieces (Volume Order)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-stone-700 mb-1">
                    Specific Requirements or Preferred Categories
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Tell us about the styles you are looking for (e.g. Cotton Kurti sets under ?800, Rayon daily wear)..."
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded focus:border-brand-wine focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-brand-wine hover:bg-brand-wine-dark text-white font-bold text-xs uppercase tracking-wider rounded-md shadow flex items-center justify-center gap-2 transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Wholesale Enquiry</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
