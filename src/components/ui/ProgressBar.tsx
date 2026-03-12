'use client';

import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number; // 0-100
  color?: string;
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function ProgressBar({ value, color = 'bg-claude', className, showLabel = false, size = 'md' }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className={cn('w-full', className)}>
      <div className={cn(
        'w-full bg-background rounded-full overflow-hidden',
        { 'h-1.5': size === 'sm', 'h-2.5': size === 'md', 'h-4': size === 'lg' }
      )}>
        <motion.div
          className={cn('h-full rounded-full', color)}
          initial={{ width: 0 }}
          animate={{ width: `${clamped}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
      {showLabel && (
        <span className="text-xs text-muted mt-1">{Math.round(clamped)}%</span>
      )}
    </div>
  );
}
