import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gold' | 'whatsapp';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed select-none active:scale-[0.98]';
    
    const variants = {
      primary: 'bg-brand-wine hover:bg-brand-wine-dark text-white focus:ring-brand-wine shadow-sm hover:shadow',
      secondary: 'bg-brand-beige hover:bg-brand-beige-dark text-brand-charcoal focus:ring-brand-rose',
      outline: 'border border-brand-wine text-brand-wine hover:bg-brand-wine hover:text-white focus:ring-brand-wine',
      ghost: 'text-brand-charcoal hover:bg-brand-beige hover:text-brand-wine',
      gold: 'bg-brand-gold hover:bg-[#B38F56] text-white focus:ring-brand-gold shadow-sm',
      whatsapp: 'bg-[#25D366] hover:bg-[#20BA59] text-white focus:ring-[#25D366] shadow-sm'
    };

    const sizes = {
      sm: 'text-xs px-3 py-1.5 gap-1.5',
      md: 'text-sm px-4 py-2.5 gap-2',
      lg: 'text-base px-6 py-3.5 gap-2.5 font-semibold',
      icon: 'p-2 w-10 h-10'
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
        ) : null}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
