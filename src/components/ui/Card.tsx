import React from 'react';
import { cn } from '../../utils/cn';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'bg-white rounded-2xl shadow-[0_2px_16px_0_rgba(0,0,0,0.06)] p-8 border border-gray-100 transition-all duration-200 hover:shadow-[0_8px_32px_0_rgba(0,0,0,0.12)] hover:-translate-y-1',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
Card.displayName = 'Card'; 