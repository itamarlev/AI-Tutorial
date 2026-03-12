'use client';

import { useState } from 'react';
import { badges } from '@/data/badges';
import { useBadgeStore } from '@/stores/useBadgeStore';
import { Card } from '@/components/ui/Card';
import { Trophy, Lock } from 'lucide-react';
import { cn, getRarityColor } from '@/lib/utils';
import { BadgeCategory, BadgeRarity } from '@/types';

const categories: { value: BadgeCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'learning', label: 'Learning' },
  { value: 'streak', label: 'Streak' },
  { value: 'challenge', label: 'Challenge' },
  { value: 'exploration', label: 'Exploration' },
  { value: 'mastery', label: 'Mastery' },
];

const rarities: { value: BadgeRarity | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'common', label: 'Common' },
  { value: 'rare', label: 'Rare' },
  { value: 'epic', label: 'Epic' },
  { value: 'legendary', label: 'Legendary' },
];

export default function AchievementsPage() {
  const { isBadgeUnlocked, unlockedBadges } = useBadgeStore();
  const [categoryFilter, setCategoryFilter] = useState<BadgeCategory | 'all'>('all');
  const [rarityFilter, setRarityFilter] = useState<BadgeRarity | 'all'>('all');

  const filtered = badges.filter((b) => {
    if (categoryFilter !== 'all' && b.category !== categoryFilter) return false;
    if (rarityFilter !== 'all' && b.rarity !== rarityFilter) return false;
    return true;
  });

  const unlocked = filtered.filter((b) => isBadgeUnlocked(b.id));
  const locked = filtered.filter((b) => !isBadgeUnlocked(b.id));

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Trophy size={24} className="text-legendary" />
          Achievements
        </h1>
        <p className="text-muted mt-1">
          {unlockedBadges.length} of {badges.length} badges unlocked
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex flex-wrap gap-1.5">
          {categories.map((c) => (
            <button
              key={c.value}
              onClick={() => setCategoryFilter(c.value)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                categoryFilter === c.value ? 'bg-claude/20 text-claude-light' : 'bg-surface text-muted hover:text-foreground'
              )}
            >
              {c.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {rarities.map((r) => (
            <button
              key={r.value}
              onClick={() => setRarityFilter(r.value)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                rarityFilter === r.value ? 'bg-claude/20 text-claude-light' : 'bg-surface text-muted hover:text-foreground'
              )}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Unlocked */}
      {unlocked.length > 0 && (
        <div>
          <h2 className="text-lg font-bold mb-3">Unlocked ({unlocked.length})</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {unlocked.map((badge) => (
              <Card key={badge.id} className="text-center p-4">
                <div className="text-4xl mb-2">{badge.icon}</div>
                <div className="font-bold text-sm">{badge.name}</div>
                <div className={cn('text-xs font-medium mt-0.5', getRarityColor(badge.rarity))}>
                  {badge.rarity}
                </div>
                <div className="text-xs text-muted mt-1">{badge.description}</div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Locked */}
      {locked.length > 0 && (
        <div>
          <h2 className="text-lg font-bold mb-3 text-muted">Locked ({locked.length})</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {locked.map((badge) => (
              <Card key={badge.id} className="text-center p-4 opacity-50">
                <div className="text-4xl mb-2 grayscale">
                  <Lock size={32} className="mx-auto text-muted" />
                </div>
                <div className="font-bold text-sm text-muted">{badge.name}</div>
                <div className={cn('text-xs font-medium mt-0.5', getRarityColor(badge.rarity))}>
                  {badge.rarity}
                </div>
                <div className="text-xs text-muted mt-1">{badge.description}</div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
