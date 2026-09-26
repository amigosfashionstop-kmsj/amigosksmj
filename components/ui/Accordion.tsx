'use client';
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function AccordionItem({ title, children, defaultOpen = false }: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-stone-200 py-3">
      <button
        type="button"
        className="w-full flex justify-between items-center text-left py-1 text-sm font-semibold text-brand-charcoal hover:text-brand-wine transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span>{title}</span>
        <ChevronDown
          className={cn('w-4 h-4 text-stone-500 transition-transform duration-200', isOpen && 'rotate-180 text-brand-wine')}
        />
      </button>
      {isOpen && (
        <div className="pt-2 pb-1 text-sm text-stone-600 leading-relaxed space-y-2 animate-fadeIn">
          {children}
        </div>
      )}
    </div>
  );
}
