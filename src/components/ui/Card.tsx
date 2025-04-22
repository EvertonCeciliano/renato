import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const cardVariants = cva(
  'relative overflow-hidden rounded-3xl transition-all duration-300',
  {
    variants: {
      variant: {
        default: 'bg-white border border-green-100',
        interactive: 'bg-white border border-green-100 hover:shadow-xl hover:bg-green-50/80',
        solid: 'bg-green-50',
      },
      shadow: {
        sm: 'shadow-sm',
        md: 'shadow-md',
        lg: 'shadow-lg',
      },
      padding: {
        none: 'p-0',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      shadow: 'sm',
      padding: 'md',
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  as?: React.ElementType;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, shadow, padding, as: Component = 'div', children, ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cardVariants({ variant, shadow, padding, className })}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Card.displayName = 'Card';

export { Card, cardVariants }; 