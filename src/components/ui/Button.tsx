import React from 'react';
import { cn } from '../../utils/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: ButtonVariant;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, isLoading, children, variant = 'primary', ...props }, ref) => {
    const base =
      'inline-flex items-center justify-center rounded-full px-6 py-2 font-medium transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0071e3] focus-visible:ring-offset-2 shadow-sm';
    const variants = {
      primary:
        'bg-[#0071e3] text-white hover:bg-[#005bb5] active:bg-[#003e7e] shadow-[0_2px_8px_0_rgba(0,113,227,0.08)]',
      secondary:
        'bg-white text-[#0071e3] border border-[#0071e3] hover:bg-[#f0f4f8] active:bg-[#e5e9ef] shadow-[0_2px_8px_0_rgba(0,113,227,0.04)]',
      ghost:
        'bg-transparent text-[#0071e3] hover:bg-[#f0f4f8] active:bg-[#e5e9ef] shadow-none',
    };
    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], className)}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? (
          <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2 align-middle" />
        ) : null}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button'; 