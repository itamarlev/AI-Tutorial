'use client';

import { calculateLevel, getLevelTitle } from '@/lib/gamification';
import { useUserStore } from '@/stores/useUserStore';

export function LevelBadge() {
  const { totalXP } = useUserStore();
  const level = calculateLevel(totalXP);
  const title = getLevelTitle(level);

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-claude/10 border border-claude/20">
      <span className="text-lg font-bold text-claude-light">{level}</span>
      <span className="text-xs text-muted">{title}</span>
    </div>
  );
}
