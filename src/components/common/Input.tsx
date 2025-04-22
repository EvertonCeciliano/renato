import React from 'react';
import { theme } from '../../styles/theme';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = '',
  ...props
}) => {
  const baseStyles = `block w-full rounded-md border-gray-300 shadow-sm focus:ring-${theme.colors.primary.main} focus:border-${theme.colors.primary.main} transition-colors duration-200`;
  const width = fullWidth ? 'w-full' : '';
  const errorStyles = error ? `border-${theme.colors.error.main} focus:ring-${theme.colors.error.main} focus:border-${theme.colors.error.main}` : '';

  return (
    <div className={`${width}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative rounded-md shadow-sm">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {leftIcon}
          </div>
        )}
        <input
          className={`${baseStyles} ${errorStyles} ${className} ${
            leftIcon ? 'pl-10' : 'pl-3'
          } ${rightIcon ? 'pr-10' : 'pr-3'}`}
          {...props}
        />
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            {rightIcon}
          </div>
        )}
      </div>
      {error && (
        <p className={`mt-1 text-sm text-${theme.colors.error.main}`}>
          {error}
        </p>
      )}
    </div>
  );
};

export default Input; 