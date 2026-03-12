'use client';

import { XPBar } from '@/components/gamification/XPBar';
import { StreakFlame } from '@/components/gamification/StreakFlame';
import { DailyGoalRing } from '@/components/gamification/DailyGoalRing';
import { useUserStore } from '@/stores/useUserStore';
import { formatNumber } from '@/lib/utils';
import { Star, Menu } from 'lucide-react';

interface TopBarProps {
  onMenuClick?: () => void;
}

export function TopBar({ onMenuClick }: TopBarProps) {
  const { totalXP } = useUserStore();

  return (
    <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur-md border-b border-border">
      <div className="flex items-center justify-between px-4 md:px-6 h-14">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="md:hidden text-muted hover:text-foreground transition-colors"
        >
          <Menu size={24} />
        </button>

        {/* XP Bar (desktop) */}
        <div className="hidden md:block flex-1 max-w-sm">
          <XPBar />
        </div>

        {/* Right section */}
        <div className="flex items-center gap-4">
          {/* Total XP (mobile) */}
          <div className="md:hidden flex items-center gap-1">
            <Star size={14} className="text-xp" />
            <span className="text-sm font-bold text-xp">{formatNumber(totalXP)}</span>
          </div>

          <DailyGoalRing size={36} />
          <StreakFlame />
        </div>
      </div>
    </header>
  );
}
