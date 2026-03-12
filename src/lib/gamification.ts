import { LEVEL_TITLES } from '@/types';

// XP required to reach a given level: 25 * n^2
export function xpForLevel(level: number): number {
  return 25 * level * level;
}

// Calculate current level from total XP
export function calculateLevel(totalXP: number): number {
  let level = 0;
  while (xpForLevel(level + 1) <= totalXP) {
    level++;
  }
  return level;
}

// XP progress within current level (0-1)
export function levelProgress(totalXP: number): number {
  const level = calculateLevel(totalXP);
  const currentLevelXP = xpForLevel(level);
  const nextLevelXP = xpForLevel(level + 1);
  return (totalXP - currentLevelXP) / (nextLevelXP - currentLevelXP);
}

// XP needed for next level
export function xpToNextLevel(totalXP: number): number {
  const level = calculateLevel(totalXP);
  return xpForLevel(level + 1) - totalXP;
}

// Get level title
export function getLevelTitle(level: number): string {
  const thresholds = Object.keys(LEVEL_TITLES)
    .map(Number)
    .sort((a, b) => b - a);
  for (const threshold of thresholds) {
    if (level >= threshold) {
      return LEVEL_TITLES[threshold];
    }
  }
  return 'Novice Prompter';
}

// Streak multiplier
export function getStreakMultiplier(streakDays: number): number {
  if (streakDays >= 30) return 1.5;
  if (streakDays >= 14) return 1.3;
  if (streakDays >= 7) return 1.2;
  if (streakDays >= 3) return 1.1;
  return 1.0;
}

// Calculate XP with multipliers
export function calculateXP(
  baseXP: number,
  streakDays: number,
  isPerfect: boolean = false
): { total: number; multiplier: number; breakdown: { base: number; streak: number; perfect: number } } {
  const streakMult = getStreakMultiplier(streakDays);
  const perfectMult = isPerfect ? 1.5 : 1.0;
  const total = Math.round(baseXP * streakMult * perfectMult);
  
  return {
    total,
    multiplier: streakMult * perfectMult,
    breakdown: {
      base: baseXP,
      streak: Math.round(baseXP * (streakMult - 1)),
      perfect: isPerfect ? Math.round(baseXP * streakMult * 0.5) : 0,
    },
  };
}

// Daily goal thresholds
export const DAILY_GOALS = [50, 100, 150, 200] as const;

// Check if a date is today
export function isToday(dateStr: string): boolean {
  const date = new Date(dateStr);
  const today = new Date();
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

// Check if a date is yesterday
export function isYesterday(dateStr: string): boolean {
  const date = new Date(dateStr);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return (
    date.getFullYear() === yesterday.getFullYear() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getDate() === yesterday.getDate()
  );
}
