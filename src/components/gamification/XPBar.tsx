'use client';

import { useUserStore } from '@/stores/useUserStore';
import { calculateLevel, levelProgress, xpToNextLevel, getLevelTitle } from '@/lib/gamification';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Star } from 'lucide-react';

export function XPBar() {
  const { totalXP } = useUserStore();
  const level = calculateLevel(totalXP);
  const progress = levelProgress(totalXP) * 100;
  const xpNeeded = xpToNextLevel(totalXP);
  const title = getLevelTitle(level);

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1.5">
        <div className="w-8 h-8 rounded-full bg-claude/20 flex items-center justify-center">
          <Star size={16} className="text-claude-light" />
        </div>
        <div className="text-sm">
          <div className="font-bold text-foreground">Lvl {level}</div>
          <div className="text-xs text-muted">{title}</div>
        </div>
      </div>
      <div className="flex-1 min-w-[100px]">
        <ProgressBar value={progress} size="sm" />
        <div className="text-xs text-muted mt-0.5">{xpNeeded} XP to next level</div>
      </div>
    </div>
  );
}
