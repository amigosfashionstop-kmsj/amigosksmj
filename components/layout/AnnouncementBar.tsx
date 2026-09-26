'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';

const MESSAGES = [
  "✨ FREE PAN-INDIA SHIPPING ON ORDERS OVER ₹799",
  "🌸 OUR PASSION, YOUR FASHION • VISIT OUR TITWALA BOUTIQUE",
  "💬 INSTANT WHATSAPP SIZING & ORDER ASSISTANCE: +91 9820140138",
  "🛍️ USE CODE 'AMIGOS10' FOR 10% OFF ON ORDERS ABOVE ₹999"
];

export function AnnouncementBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex(prev => (prev + 1) % MESSAGES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-brand-wine text-white text-[11px] font-medium tracking-wider py-2 px-4 text-center transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
        <Sparkles className="w-3 h-3 text-brand-gold shrink-0 animate-pulse" />
        <span className="truncate">{MESSAGES[index]}</span>
        <span className="hidden md:inline-block text-brand-gold text-[10px] ml-2 font-semibold">
          • WHOLESALE & RETAIL
        </span>
      </div>
    </div>
  );
}
