import React from 'react';
import Link from 'next/link';
import { Ruler, Sparkles, MessageCircle, HelpCircle } from 'lucide-react';
import { STORE_INFO } from '@/lib/data/store-info';

export const metadata = {
  title: "Size & Measurement Guide | Amigos Fashionstop",
  description: "Find your ideal fit with our comprehensive Indian ethnic wear size chart for kurtis, kurti sets, and anarkalis.",
};

export default function SizeGuidePage() {
  return (
    <div className="bg-[#FAF7F2] min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center space-y-3 mb-10">
          <span className="text-xs font-bold text-brand-wine uppercase tracking-widest bg-brand-wine/10 px-3.5 py-1 rounded-full inline-flex items-center gap-1.5">
            <Ruler className="w-3.5 h-3.5" />
            <span>Fit & Measurement Guide</span>
          </span>
          <h1 className="font-serif text-4xl font-bold text-brand-charcoal">
            Find Your Flawless Fit
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 max-w-lg mx-auto">
            Our garments are tailored to comfortable Indian silhouettes with generous ease so you look polished without feeling restricted.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 border border-stone-200/80 shadow-xs space-y-8">
          {/* Sizing Table */}
          <div>
            <h2 className="font-serif text-xl font-bold text-brand-charcoal mb-4">
              Standard Kurti & Set Measurement Chart (Inches)
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border border-stone-200">
                <thead className="bg-stone-100 text-stone-800 font-bold uppercase text-[11px]">
                  <tr>
                    <th className="p-3 border-b">Size Tag</th>
                    <th className="p-3 border-b">Bust (To Fit)</th>
                    <th className="p-3 border-b">Garment Bust</th>
                    <th className="p-3 border-b">Waist</th>
                    <th className="p-3 border-b">Hip</th>
                    <th className="p-3 border-b">Kurta Length</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 text-stone-700 font-medium">
                  <tr>
                    <td className="p-3 font-bold text-brand-wine">S (Small)</td>
                    <td className="p-3">34&quot; � 35&quot;</td>
                    <td className="p-3 font-bold">36&quot;</td>
                    <td className="p-3">32&quot;</td>
                    <td className="p-3">38&quot;</td>
                    <td className="p-3">44&quot;</td>
                  </tr>
                  <tr className="bg-stone-50">
                    <td className="p-3 font-bold text-brand-wine">M (Medium)</td>
                    <td className="p-3">36&quot; � 37&quot;</td>
                    <td className="p-3 font-bold">38&quot;</td>
                    <td className="p-3">34&quot;</td>
                    <td className="p-3">40&quot;</td>
                    <td className="p-3">44&quot;</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-brand-wine">L (Large)</td>
                    <td className="p-3">38&quot; � 39&quot;</td>
                    <td className="p-3 font-bold">40&quot;</td>
                    <td className="p-3">36&quot;</td>
                    <td className="p-3">42&quot;</td>
                    <td className="p-3">44&quot;</td>
                  </tr>
                  <tr className="bg-stone-50">
                    <td className="p-3 font-bold text-brand-wine">XL (X-Large)</td>
                    <td className="p-3">40&quot; � 41&quot;</td>
                    <td className="p-3 font-bold">42&quot;</td>
                    <td className="p-3">38&quot;</td>
                    <td className="p-3">44&quot;</td>
                    <td className="p-3">45&quot;</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-brand-wine">2XL (Double XL)</td>
                    <td className="p-3">42&quot; � 43&quot;</td>
                    <td className="p-3 font-bold">44&quot;</td>
                    <td className="p-3">40&quot;</td>
                    <td className="p-3">46&quot;</td>
                    <td className="p-3">45&quot;</td>
                  </tr>
                  <tr className="bg-stone-50">
                    <td className="p-3 font-bold text-brand-wine">3XL (Triple XL)</td>
                    <td className="p-3">44&quot; � 45&quot;</td>
                    <td className="p-3 font-bold">46&quot;</td>
                    <td className="p-3">42&quot;</td>
                    <td className="p-3">48&quot;</td>
                    <td className="p-3">45&quot;</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* How to Measure Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-xs">
            <div className="p-4 bg-[#FAF7F2] rounded-xl space-y-1.5 border border-stone-200">
              <strong className="block text-brand-charcoal">1. Bust</strong>
              <p className="text-stone-600">Measure around the fullest part of your bust, keeping the measuring tape parallel to the floor.</p>
            </div>
            <div className="p-4 bg-[#FAF7F2] rounded-xl space-y-1.5 border border-stone-200">
              <strong className="block text-brand-charcoal">2. Waist</strong>
              <p className="text-stone-600">Measure around your natural waistline, usually the narrowest point above your navel.</p>
            </div>
            <div className="p-4 bg-[#FAF7F2] rounded-xl space-y-1.5 border border-stone-200">
              <strong className="block text-brand-charcoal">3. Hip</strong>
              <p className="text-stone-600">Stand with feet together and measure around the fullest part of your hips and rear.</p>
            </div>
          </div>

          {/* WhatsApp Assisted Sizing Callout */}
          <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div>
              <p className="font-bold text-emerald-900 text-sm">Still unsure between two sizes?</p>
              <p className="text-emerald-700 mt-0.5">
                Send your measurements to our Titwala boutique team on WhatsApp. We will measure the actual piece before packing!
              </p>
            </div>
            <a
              href={`https://wa.me/${STORE_INFO.primaryWhatsApp}?text=${encodeURIComponent("Hi Amigos Fashionstop! ?? Can you please help me confirm my kurti size before placing an order?")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold rounded-md flex items-center gap-1.5 shrink-0"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Ask on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
