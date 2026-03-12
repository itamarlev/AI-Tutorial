'use client';

import { toast } from 'sonner';
import { Star } from 'lucide-react';

export function showXPGainToast(amount: number, source: string, multiplier?: number) {
  toast.custom(() => (
    <div className="flex items-center gap-3 bg-surface border border-xp/30 rounded-lg p-3 shadow-lg">
      <div className="w-8 h-8 rounded-full bg-xp/20 flex items-center justify-center">
        <Star size={16} className="text-xp" />
      </div>
      <div>
        <div className="font-bold text-foreground">+{amount} XP</div>
        <div className="text-xs text-muted">
          {source}
          {multiplier && multiplier > 1 && ` (${multiplier}x multiplier)`}
        </div>
      </div>
    </div>
  ), { duration: 3000 });
}
