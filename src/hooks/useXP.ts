'use client';

import { useCallback, useState } from 'react';
import { useUserStore } from '@/stores/useUserStore';
import { useStreakStore } from '@/stores/useStreakStore';
import { useBadgeStore, BadgeCheckContext } from '@/stores/useBadgeStore';
import { useProgressStore } from '@/stores/useProgressStore';
import { useChallengeStore } from '@/stores/useChallengeStore';
import { calculateXP, calculateLevel } from '@/lib/gamification';
import { showXPGainToast } from '@/components/gamification/XPGainToast';
import { XPSource } from '@/types';

export function useXP() {
  const { totalXP, addXP, profile } = useUserStore();
  const { currentStreak, recordActivity } = useStreakStore();
  const { checkAndUnlockBadges } = useBadgeStore();
  const { getCompletedLessonCount, lessonProgress, completedModules } = useProgressStore();
  const { getChallengesCompletedCount } = useChallengeStore();
  const [levelUpTo, setLevelUpTo] = useState<number | null>(null);
  const [newBadgeId, setNewBadgeId] = useState<string | null>(null);

  const awardXP = useCallback(
    (baseAmount: number, source: XPSource, isPerfect: boolean = false, sourceLabel?: string) => {
      const levelBefore = calculateLevel(totalXP);

      const { total, multiplier } = calculateXP(baseAmount, currentStreak, isPerfect);

      addXP({
        amount: total,
        source,
        timestamp: new Date().toISOString(),
        multiplier,
        details: sourceLabel,
      });

      recordActivity();

      // Show toast
      showXPGainToast(total, sourceLabel || source, multiplier > 1 ? multiplier : undefined);

      // Check level up
      const levelAfter = calculateLevel(totalXP + total);
      if (levelAfter > levelBefore) {
        setLevelUpTo(levelAfter);
      }

      // Check badges
      const perfectCount = Object.values(lessonProgress).filter((p) => p.perfectScore).length;
      const completedTools: string[] = [];
      // Simplified: would need full tool data to check properly

      const ctx: BadgeCheckContext = {
        totalXP: totalXP + total,
        level: levelAfter,
        lessonsCompleted: getCompletedLessonCount(),
        currentStreak,
        challengesCompleted: getChallengesCompletedCount(),
        completedTools,
        completedModules,
        perfectLessons: perfectCount,
        currentHour: new Date().getHours(),
      };

      const newBadges = checkAndUnlockBadges(ctx);
      if (newBadges.length > 0) {
        setNewBadgeId(newBadges[0]);
      }

      return total;
    },
    [totalXP, currentStreak, addXP, recordActivity, checkAndUnlockBadges, getCompletedLessonCount, getChallengesCompletedCount, lessonProgress, completedModules]
  );

  const dismissLevelUp = useCallback(() => setLevelUpTo(null), []);
  const dismissBadge = useCallback(() => setNewBadgeId(null), []);

  return {
    awardXP,
    levelUpTo,
    dismissLevelUp,
    newBadgeId,
    dismissBadge,
  };
}
