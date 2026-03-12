'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UnlockedBadge, Badge, BadgeCondition } from '@/types';
import { badges } from '@/data/badges';

interface BadgeState {
  unlockedBadges: UnlockedBadge[];
  newBadgeQueue: string[]; // Badge IDs to show unlock animation

  // Actions
  checkAndUnlockBadges: (context: BadgeCheckContext) => string[];
  isBadgeUnlocked: (badgeId: string) => boolean;
  popNewBadge: () => string | undefined;
  reset: () => void;
}

export interface BadgeCheckContext {
  totalXP: number;
  level: number;
  lessonsCompleted: number;
  currentStreak: number;
  challengesCompleted: number;
  completedTools: string[];
  completedModules: string[];
  perfectLessons: number;
  currentHour: number;
}

function checkCondition(condition: BadgeCondition, ctx: BadgeCheckContext): boolean {
  switch (condition.type) {
    case 'first_lesson':
      return ctx.lessonsCompleted >= 1;
    case 'lessons_completed':
      return ctx.lessonsCompleted >= condition.count;
    case 'streak_days':
      return ctx.currentStreak >= condition.count;
    case 'challenges_completed':
      return ctx.challengesCompleted >= condition.count;
    case 'xp_total':
      return ctx.totalXP >= condition.amount;
    case 'level_reached':
      return ctx.level >= condition.level;
    case 'tool_completed':
      return ctx.completedTools.includes(condition.toolSlug);
    case 'all_tools_completed':
      return ctx.completedTools.length >= 3;
    case 'module_completed':
      return ctx.completedModules.includes(condition.moduleId);
    case 'perfect_lesson':
      return ctx.perfectLessons >= condition.count;
    case 'night_owl':
      return ctx.currentHour >= 0 && ctx.currentHour < 5;
    case 'early_bird':
      return ctx.currentHour >= 5 && ctx.currentHour < 7;
    case 'first_challenge':
      return ctx.challengesCompleted >= 1;
    case 'challenge_fast':
      return ctx.challengesCompleted >= 1; // Simplified check; real check happens in challenge flow
    default:
      return false;
  }
}

export const useBadgeStore = create<BadgeState>()(
  persist(
    (set, get) => ({
      unlockedBadges: [],
      newBadgeQueue: [],

      checkAndUnlockBadges: (context) => {
        const { unlockedBadges } = get();
        const unlockedIds = new Set(unlockedBadges.map((b) => b.badgeId));
        const newlyUnlocked: string[] = [];

        for (const badge of badges) {
          if (unlockedIds.has(badge.id)) continue;
          if (checkCondition(badge.condition, context)) {
            newlyUnlocked.push(badge.id);
          }
        }

        if (newlyUnlocked.length > 0) {
          set((state) => ({
            unlockedBadges: [
              ...state.unlockedBadges,
              ...newlyUnlocked.map((id) => ({
                badgeId: id,
                unlockedAt: new Date().toISOString(),
              })),
            ],
            newBadgeQueue: [...state.newBadgeQueue, ...newlyUnlocked],
          }));
        }

        return newlyUnlocked;
      },

      isBadgeUnlocked: (badgeId) =>
        get().unlockedBadges.some((b) => b.badgeId === badgeId),

      popNewBadge: () => {
        const { newBadgeQueue } = get();
        if (newBadgeQueue.length === 0) return undefined;
        const [first, ...rest] = newBadgeQueue;
        set({ newBadgeQueue: rest });
        return first;
      },

      reset: () => set({ unlockedBadges: [], newBadgeQueue: [] }),
    }),
    {
      name: 'ai-tutorial-badges',
    }
  )
);

export function getBadgeById(id: string): Badge | undefined {
  return badges.find((b) => b.id === id);
}
