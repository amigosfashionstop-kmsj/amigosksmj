'use client';
import React from 'react';
import { X, Ruler } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SizeGuideModal({ isOpen, onClose }: SizeGuideModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={onClose} />
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-200">
            <div className="flex items-center gap-2">
              <Ruler className="w-5 h-5 text-brand-wine" />
              <h3 className="font-serif text-lg font-bold text-brand-charcoal">
                Amigos Kurti Sizing Chart
              </h3>
            </div>
            <button onClick={onClose} className="p-1 rounded-full text-stone-400 hover:text-stone-700">
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-xs text-stone-600">
            All measurements below are in <strong>inches</strong>. Our garments include 2 inches of relaxed ease for all-day comfort.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border border-stone-200">
              <thead className="bg-stone-100 text-stone-800 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-2.5 border-b">Size</th>
                  <th className="p-2.5 border-b">Bust</th>
                  <th className="p-2.5 border-b">Waist</th>
                  <th className="p-2.5 border-b">Hip</th>
                  <th className="p-2.5 border-b">Length</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 text-stone-700 font-medium">
                <tr>
                  <td className="p-2.5 font-bold text-brand-wine">S (Small)</td>
                  <td className="p-2.5">36&quot;</td>
                  <td className="p-2.5">32&quot;</td>
                  <td className="p-2.5">38&quot;</td>
                  <td className="p-2.5">44&quot;</td>
                </tr>
                <tr className="bg-stone-50">
                  <td className="p-2.5 font-bold text-brand-wine">M (Medium)</td>
                  <td className="p-2.5">38&quot;</td>
                  <td className="p-2.5">34&quot;</td>
                  <td className="p-2.5">40&quot;</td>
                  <td className="p-2.5">44&quot;</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-brand-wine">L (Large)</td>
                  <td className="p-2.5">40&quot;</td>
                  <td className="p-2.5">36&quot;</td>
                  <td className="p-2.5">42&quot;</td>
                  <td className="p-2.5">44&quot;</td>
                </tr>
                <tr className="bg-stone-50">
                  <td className="p-2.5 font-bold text-brand-wine">XL (X-Large)</td>
                  <td className="p-2.5">42&quot;</td>
                  <td className="p-2.5">38&quot;</td>
                  <td className="p-2.5">44&quot;</td>
                  <td className="p-2.5">45&quot;</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-brand-wine">2XL (Double XL)</td>
                  <td className="p-2.5">44&quot;</td>
                  <td className="p-2.5">40&quot;</td>
                  <td className="p-2.5">46&quot;</td>
                  <td className="p-2.5">45&quot;</td>
                </tr>
                <tr className="bg-stone-50">
                  <td className="p-2.5 font-bold text-brand-wine">3XL (Triple XL)</td>
                  <td className="p-2.5">46&quot;</td>
                  <td className="p-2.5">42&quot;</td>
                  <td className="p-2.5">48&quot;</td>
                  <td className="p-2.5">45&quot;</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-[#FAF7F2] p-3 rounded-lg text-[11px] text-stone-600 space-y-1">
            <p><strong>Measuring Tip:</strong> Measure around the fullest part of your chest with measuring tape held straight and comfortable.</p>
            <p>If you are between two sizes, we recommend choosing the larger size for a relaxed Indian drape.</p>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-brand-wine text-white text-xs font-semibold rounded-md"
            >
              Got It
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
