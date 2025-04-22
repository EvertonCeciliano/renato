import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const selectVariants = cva(
  'w-full rounded-lg transition-colors focus:outline-none appearance-none bg-white',
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

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'>,
    VariantProps<typeof selectVariants> {
  error?: string;
  label?: string;
  options: SelectOption[];
  placeholder?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, variant, size, error, label, options, placeholder, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-sm font-medium text-green-700">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={selectVariants({
              variant: error ? 'error' : variant,
              size,
              className,
            })}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <svg
              className="h-5 w-5 text-green-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
        {error && (
          <p className="text-sm text-rose-600">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export { Select, selectVariants }; 