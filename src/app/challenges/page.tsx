'use client';

import { challenges } from '@/data/challenges';
import { useChallengeStore } from '@/stores/useChallengeStore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Gamepad2, Clock, Star, Zap, Trophy, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const difficultyConfig = {
  easy: { label: 'Easy', color: 'text-codex-light', bg: 'bg-codex/10', border: 'border-codex/30' },
  medium: { label: 'Medium', color: 'text-xp', bg: 'bg-xp/10', border: 'border-xp/30' },
  hard: { label: 'Hard', color: 'text-streak', bg: 'bg-streak/10', border: 'border-streak/30' },
};

export default function ChallengesPage() {
  const { getBestAttempt } = useChallengeStore();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Gamepad2 size={24} className="text-xp" />
          Timed Challenges
        </h1>
        <p className="text-muted mt-1">Test your AI skills under time pressure. Earn bonus XP for fast completions.</p>
      </div>

      {(['easy', 'medium', 'hard'] as const).map((difficulty) => {
        const config = difficultyConfig[difficulty];
        const filtered = challenges.filter((c) => c.difficulty === difficulty);
        if (filtered.length === 0) return null;

        return (
          <div key={difficulty}>
            <h2 className={cn('text-lg font-bold mb-3', config.color)}>{config.label}</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {filtered.map((challenge) => {
                const best = getBestAttempt(challenge.id);
                return (
                  <Card key={challenge.id} hover>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold">{challenge.title}</h3>
                        <p className="text-sm text-muted mt-0.5">{challenge.description}</p>
                      </div>
                      <span className={cn('text-xs px-2 py-1 rounded-full font-medium', config.bg, config.color, config.border, 'border')}>
                        {config.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted mb-3">
                      <span className="flex items-center gap-1"><Clock size={14} /> {Math.floor(challenge.timeLimit / 60)}:{(challenge.timeLimit % 60).toString().padStart(2, '0')}</span>
                      <span className="flex items-center gap-1"><Star size={14} className="text-xp" /> {challenge.xpReward} XP</span>
                      <span className="flex items-center gap-1"><Zap size={14} /> {challenge.exercises.length} exercises</span>
                    </div>
                    {best && (
                      <div className="flex items-center gap-2 text-sm mb-3">
                        <CheckCircle size={14} className="text-codex-light" />
                        <span className="text-codex-light">Best: {Math.round((best.score / best.maxScore) * 100)}%</span>
                        <span className="text-muted">({best.xpEarned} XP)</span>
                      </div>
                    )}
                    <Link href={`/challenges/${challenge.id}`}>
                      <Button size="sm" variant={best ? 'secondary' : 'primary'} className="gap-1">
                        {best ? (
                          <><Trophy size={14} /> Retry</>
                        ) : (
                          <><Zap size={14} /> Start</>
                        )}
                      </Button>
                    </Link>
                  </Card>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
