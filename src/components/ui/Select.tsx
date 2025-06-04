import React from 'react';
import { cn } from '../../utils/cn';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, ...props }, ref) => (
    <div className="mb-4">
      {label && <label className="block text-gray-500 text-sm font-medium mb-1">{label}</label>}
      <select
        ref={ref}
        className={cn(
          'w-full rounded-xl border border-gray-200 px-4 py-2 bg-white text-gray-900 shadow-sm focus:ring-2 focus:ring-[#0071e3] focus:border-[#0071e3] transition-all duration-150',
          error && 'border-red-400 focus:border-red-500 focus:ring-red-200',
          className
        )}
        {...props}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
);
Select.displayName = 'Select'; 