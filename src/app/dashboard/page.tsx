'use client';

import { useUserStore } from '@/stores/useUserStore';
import { useStreakStore } from '@/stores/useStreakStore';
import { useProgressStore } from '@/stores/useProgressStore';
import { useBadgeStore } from '@/stores/useBadgeStore';
import { calculateLevel, getLevelTitle, levelProgress, xpToNextLevel, getStreakMultiplier } from '@/lib/gamification';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { formatNumber } from '@/lib/utils';
import { badges } from '@/data/badges';
import Link from 'next/link';
import { Star, Flame, Target, BookOpen, Trophy, Zap, ArrowRight, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
  const { totalXP, todayXP, profile } = useUserStore();
  const { currentStreak, longestStreak } = useStreakStore();
  const { getCompletedLessonCount } = useProgressStore();
  const { unlockedBadges } = useBadgeStore();

  const level = calculateLevel(totalXP);
  const title = getLevelTitle(level);
  const progress = levelProgress(totalXP) * 100;
  const xpNeeded = xpToNextLevel(totalXP);
  const dailyGoal = profile?.dailyGoal ?? 100;
  const dailyProgress = Math.min(100, (todayXP / dailyGoal) * 100);
  const streakMultiplier = getStreakMultiplier(currentStreak);
  const completedLessons = getCompletedLessonCount();

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold">
          Welcome back{profile?.username ? `, ${profile.username}` : ''}! {profile?.avatar}
        </h1>
        <p className="text-muted mt-1">Keep learning and building your AI skills.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-claude/20 flex items-center justify-center">
              <Star size={20} className="text-claude-light" />
            </div>
            <div>
              <div className="text-2xl font-bold">{level}</div>
              <div className="text-xs text-muted">{title}</div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-xp/20 flex items-center justify-center">
              <Zap size={20} className="text-xp" />
            </div>
            <div>
              <div className="text-2xl font-bold">{formatNumber(totalXP)}</div>
              <div className="text-xs text-muted">Total XP</div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-streak/20 flex items-center justify-center">
              <Flame size={20} className="text-streak" />
            </div>
            <div>
              <div className="text-2xl font-bold">{currentStreak}</div>
              <div className="text-xs text-muted">Day Streak</div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-codex/20 flex items-center justify-center">
              <BookOpen size={20} className="text-codex-light" />
            </div>
            <div>
              <div className="text-2xl font-bold">{completedLessons}</div>
              <div className="text-xs text-muted">Lessons Done</div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Level Progress */}
        <Card>
          <h2 className="font-bold mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-claude-light" />
            Level Progress
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Level {level}</span>
              <span className="text-muted">{xpNeeded} XP to Level {level + 1}</span>
            </div>
            <ProgressBar value={progress} />
            {streakMultiplier > 1 && (
              <div className="text-xs text-xp flex items-center gap-1">
                <Flame size={12} /> {streakMultiplier}x streak bonus active!
              </div>
            )}
          </div>
        </Card>

        {/* Daily Goal */}
        <Card>
          <h2 className="font-bold mb-4 flex items-center gap-2">
            <Target size={18} className="text-xp" />
            Daily Goal
          </h2>
          <div className="flex items-center gap-6">
            <ProgressRing
              value={dailyProgress}
              size={80}
              strokeWidth={6}
              color={dailyProgress >= 100 ? '#22c55e' : '#f59e0b'}
            >
              <span className="text-sm font-bold">{Math.round(dailyProgress)}%</span>
            </ProgressRing>
            <div>
              <div className="text-2xl font-bold">{todayXP} / {dailyGoal}</div>
              <div className="text-sm text-muted">XP earned today</div>
              {dailyProgress >= 100 && (
                <div className="text-sm text-codex-light mt-1">Goal reached!</div>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4">
        <Link href="/learn">
          <Card hover>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BookOpen size={20} className="text-claude-light" />
                <div>
                  <div className="font-medium">Continue Learning</div>
                  <div className="text-xs text-muted">Pick up where you left off</div>
                </div>
              </div>
              <ArrowRight size={16} className="text-muted" />
            </div>
          </Card>
        </Link>

        <Link href="/challenges">
          <Card hover>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Zap size={20} className="text-xp" />
                <div>
                  <div className="font-medium">Timed Challenge</div>
                  <div className="text-xs text-muted">Test your skills</div>
                </div>
              </div>
              <ArrowRight size={16} className="text-muted" />
            </div>
          </Card>
        </Link>

        <Link href="/achievements">
          <Card hover>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Trophy size={20} className="text-legendary" />
                <div>
                  <div className="font-medium">Achievements</div>
                  <div className="text-xs text-muted">{unlockedBadges.length}/{badges.length} badges</div>
                </div>
              </div>
              <ArrowRight size={16} className="text-muted" />
            </div>
          </Card>
        </Link>
      </div>

      {/* Recent Badges */}
      {unlockedBadges.length > 0 && (
        <Card>
          <h2 className="font-bold mb-4 flex items-center gap-2">
            <Trophy size={18} className="text-legendary" />
            Recent Badges
          </h2>
          <div className="flex flex-wrap gap-3">
            {unlockedBadges.slice(-6).reverse().map((ub) => {
              const badge = badges.find((b) => b.id === ub.badgeId);
              if (!badge) return null;
              return (
                <div key={ub.badgeId} className="flex items-center gap-2 bg-background rounded-lg px-3 py-2">
                  <span className="text-xl">{badge.icon}</span>
                  <div>
                    <div className="text-sm font-medium">{badge.name}</div>
                    <div className="text-xs text-muted">{badge.rarity}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}
