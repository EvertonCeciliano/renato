import React from 'react';
import { theme } from '../../styles/theme';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200';
  
  const variants = {
    primary: `bg-${theme.colors.primary.main} text-white hover:bg-${theme.colors.primary.dark} focus:ring-${theme.colors.primary.main}`,
    secondary: `bg-${theme.colors.secondary.main} text-white hover:bg-${theme.colors.secondary.dark} focus:ring-${theme.colors.secondary.main}`,
    outline: `border-2 border-${theme.colors.primary.main} text-${theme.colors.primary.main} hover:bg-${theme.colors.primary.main} hover:text-white focus:ring-${theme.colors.primary.main}`,
    ghost: `text-${theme.colors.primary.main} hover:bg-${theme.colors.primary.light} focus:ring-${theme.colors.primary.main}`,
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const width = fullWidth ? 'w-full' : '';
  const opacity = (disabled || isLoading) ? 'opacity-75 cursor-not-allowed' : '';

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${width} ${opacity} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};

export default Button; 