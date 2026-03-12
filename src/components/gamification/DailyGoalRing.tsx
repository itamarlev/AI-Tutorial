'use client';

import { useUserStore } from '@/stores/useUserStore';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { Target } from 'lucide-react';

export function DailyGoalRing({ size = 40 }: { size?: number }) {
  const { todayXP, profile } = useUserStore();
  const goal = profile?.dailyGoal ?? 100;
  const progress = Math.min(100, (todayXP / goal) * 100);

  return (
    <ProgressRing
      value={progress}
      size={size}
      strokeWidth={3}
      color={progress >= 100 ? '#22c55e' : '#f59e0b'}
    >
      <Target size={size * 0.35} className={progress >= 100 ? 'text-codex' : 'text-xp'} />
    </ProgressRing>
  );
}
