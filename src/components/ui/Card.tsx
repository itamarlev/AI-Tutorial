import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  glow?: string;
}

export function Card({ className, hover = false, glow, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl bg-surface border border-border p-6',
        hover && 'hover:bg-surface-hover hover:border-muted/50 transition-all duration-200 cursor-pointer',
        className
      )}
      style={glow ? { boxShadow: `0 0 20px ${glow}20` } : undefined}
      {...props}
    >
      {children}
    </div>
  );
}
