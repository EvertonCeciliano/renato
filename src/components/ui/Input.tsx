import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const inputVariants = cva(
  'w-full rounded-lg transition-colors focus:outline-none',
  {
    variants: {
      variant: {
        default: 'border border-green-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20',
        error: 'border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20',
      },
      size: {
        sm: 'text-sm px-3 py-1.5',
        md: 'px-4 py-2.5',
        lg: 'text-lg px-4 py-3',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  error?: string;
  label?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, size, error, label, leftIcon, rightIcon, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-sm font-medium text-green-700">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-green-500">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            className={inputVariants({
              variant: error ? 'error' : variant,
              size,
              className: `${leftIcon ? 'pl-10' : ''} ${rightIcon ? 'pr-10' : ''} ${className || ''}`,
            })}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-green-500">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="text-sm text-rose-600">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input, inputVariants }; 