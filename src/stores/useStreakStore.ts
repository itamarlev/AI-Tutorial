'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { StreakData } from '@/types';
import { isToday, isYesterday } from '@/lib/gamification';

interface StreakState extends StreakData {
  recordActivity: () => void;
  checkStreak: () => void;
  useStreakFreeze: () => boolean;
  reset: () => void;
}

export const useStreakStore = create<StreakState>()(
  persist(
    (set, get) => ({
      currentStreak: 0,
      longestStreak: 0,
      lastActiveDate: null,
      streakFreezes: 1,

      recordActivity: () => {
        const { lastActiveDate, currentStreak, longestStreak } = get();

        if (lastActiveDate && isToday(lastActiveDate)) {
          return; // Already recorded today
        }

        let newStreak: number;
        if (!lastActiveDate) {
          newStreak = 1;
        } else if (isYesterday(lastActiveDate)) {
          newStreak = currentStreak + 1;
        } else {
          newStreak = 1; // Streak broken
        }

        set({
          currentStreak: newStreak,
          longestStreak: Math.max(longestStreak, newStreak),
          lastActiveDate: new Date().toISOString(),
        });
      },

      checkStreak: () => {
        const { lastActiveDate, currentStreak, streakFreezes } = get();

        if (!lastActiveDate) return;
        if (isToday(lastActiveDate) || isYesterday(lastActiveDate)) return;

        // Streak is at risk - more than 1 day has passed
        if (currentStreak > 0) {
          // Auto-use freeze if available
          if (streakFreezes > 0) {
            set({ streakFreezes: streakFreezes - 1 });
          } else {
            set({ currentStreak: 0 });
          }
        }
      },

      useStreakFreeze: () => {
        const { streakFreezes } = get();
        if (streakFreezes > 0) {
          set({ streakFreezes: streakFreezes - 1 });
          return true;
        }
        return false;
      },

      reset: () =>
        set({
          currentStreak: 0,
          longestStreak: 0,
          lastActiveDate: null,
          streakFreezes: 1,
        }),
    }),
    {
      name: 'ai-tutorial-streak',
    }
  )
);
