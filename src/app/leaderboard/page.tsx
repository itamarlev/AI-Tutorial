'use client';

import { useUserStore } from '@/stores/useUserStore';
import { useStreakStore } from '@/stores/useStreakStore';
import { useProgressStore } from '@/stores/useProgressStore';
import { useBadgeStore } from '@/stores/useBadgeStore';
import { calculateLevel, getLevelTitle } from '@/lib/gamification';
import { Card } from '@/components/ui/Card';
import { formatNumber } from '@/lib/utils';
import { Medal, Star, Flame, Trophy, BookOpen } from 'lucide-react';

// Simulated leaderboard entries for demo purposes
const demoEntries = [
  { name: 'AlexCoder', avatar: '🧑‍💻', xp: 15200, streak: 21, badges: 18, lessons: 28 },
  { name: 'DevSarah', avatar: '👩‍💻', xp: 12800, streak: 14, badges: 15, lessons: 24 },
  { name: 'AIWizard', avatar: '🧙‍♂️', xp: 9500, streak: 30, badges: 12, lessons: 18 },
  { name: 'CodeFox', avatar: '🦊', xp: 7200, streak: 7, badges: 10, lessons: 14 },
  { name: 'ByteOwl', avatar: '🦉', xp: 5100, streak: 5, badges: 8, lessons: 10 },
];

export default function LeaderboardPage() {
  const { profile, totalXP } = useUserStore();
  const { currentStreak } = useStreakStore();
  const { getCompletedLessonCount } = useProgressStore();
  const { unlockedBadges } = useBadgeStore();

  const userEntry = {
    name: profile?.username || 'You',
    avatar: profile?.avatar || '🤖',
    xp: totalXP,
    streak: currentStreak,
    badges: unlockedBadges.length,
    lessons: getCompletedLessonCount(),
  };

  // Combine user with demo entries and sort by XP
  const allEntries = [...demoEntries, userEntry].sort((a, b) => b.xp - a.xp);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Medal size={24} className="text-legendary" />
          Leaderboard
        </h1>
        <p className="text-muted mt-1">See how you rank against other learners.</p>
      </div>

      <div className="space-y-2">
        {allEntries.map((entry, index) => {
          const isUser = entry.name === userEntry.name;
          const level = calculateLevel(entry.xp);
          const title = getLevelTitle(level);
          const rank = index + 1;

          return (
            <Card
              key={entry.name}
              className={`flex items-center gap-4 p-4 ${isUser ? 'ring-2 ring-claude/50 bg-claude/5' : ''}`}
            >
              {/* Rank */}
              <div className="w-8 text-center font-bold text-lg">
                {rank <= 3 ? (
                  <span className={rank === 1 ? 'text-legendary' : rank === 2 ? 'text-muted' : 'text-xp'}>
                    {rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉'}
                  </span>
                ) : (
                  <span className="text-muted">{rank}</span>
                )}
              </div>

              {/* Avatar & Name */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <span className="text-2xl">{entry.avatar}</span>
                <div>
                  <div className="font-bold text-sm">
                    {entry.name} {isUser && <span className="text-claude-light">(you)</span>}
                  </div>
                  <div className="text-xs text-muted">Lvl {level} · {title}</div>
                </div>
              </div>

              {/* Stats */}
              <div className="hidden md:flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1 text-muted">
                  <BookOpen size={14} /> {entry.lessons}
                </span>
                <span className="flex items-center gap-1 text-muted">
                  <Trophy size={14} /> {entry.badges}
                </span>
                <span className="flex items-center gap-1 text-streak">
                  <Flame size={14} /> {entry.streak}
                </span>
              </div>

              {/* XP */}
              <div className="text-right">
                <div className="font-bold text-xp flex items-center gap-1">
                  <Star size={14} /> {formatNumber(entry.xp)}
                </div>
                <div className="text-xs text-muted">XP</div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
