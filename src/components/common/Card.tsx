import React from 'react';
import { theme } from '../../styles/theme';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'default',
  padding = 'md',
}) => {
  const baseStyles = 'bg-white rounded-lg transition-all duration-200';
  
  const variants = {
    default: `border border-gray-200 shadow-${theme.shadows.sm}`,
    elevated: `border border-gray-200 shadow-${theme.shadows.lg} hover:shadow-${theme.shadows.xl}`,
    outlined: `border-2 border-${theme.colors.primary.main} shadow-none`,
  };

  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div className={`${baseStyles} ${variants[variant]} ${paddings[padding]} ${className}`}>
      {children}
    </div>
  );
};

export default Card; 