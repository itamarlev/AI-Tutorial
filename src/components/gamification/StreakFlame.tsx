'use client';

import { useStreakStore } from '@/stores/useStreakStore';
import { Flame } from 'lucide-react';

export function StreakFlame() {
  const { currentStreak } = useStreakStore();

  return (
    <div className="flex items-center gap-1.5">
      <Flame
        size={20}
        className={currentStreak > 0 ? 'text-streak fill-streak' : 'text-muted'}
      />
      <span className={`text-sm font-bold ${currentStreak > 0 ? 'text-streak' : 'text-muted'}`}>
        {currentStreak}
      </span>
    </div>
  );
}
