import React from 'react';
import { cn } from '../../utils/cn';

export interface SectionHeaderProps extends React.HTMLAttributes<HTMLHeadingElement> {}

export const SectionHeader = React.forwardRef<HTMLHeadingElement, SectionHeaderProps>(
  ({ className, children, ...props }, ref) => (
    <h2
      ref={ref}
      className={cn('text-2xl font-semibold text-gray-900 mb-6', className)}
      {...props}
    >
      {children}
    </h2>
  )
);
SectionHeader.displayName = 'SectionHeader'; 