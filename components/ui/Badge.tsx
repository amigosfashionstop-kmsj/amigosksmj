import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'wine' | 'gold' | 'rose' | 'neutral' | 'success' | 'sale';
}

export function Badge({ className, variant = 'wine', children, ...props }: BadgeProps) {
  const variants = {
    wine: 'bg-brand-wine/10 text-brand-wine border border-brand-wine/20',
    gold: 'bg-brand-gold/15 text-[#916B27] border border-brand-gold/30',
    rose: 'bg-brand-rose-light text-brand-wine border border-brand-rose/20',
    neutral: 'bg-stone-100 text-stone-700 border border-stone-200',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    sale: 'bg-red-50 text-red-700 border border-red-200 font-semibold'
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium tracking-wide uppercase',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
