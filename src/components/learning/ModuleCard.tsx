'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Module } from '@/types';
import { useProgressStore } from '@/stores/useProgressStore';
import { getSkipChallenge } from '@/data/skipChallenges';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { BookOpen, Lock, CheckCircle, Unlock, XCircle } from 'lucide-react';
import { ConfettiExplosion } from '@/components/ui/ConfettiExplosion';
import { cn } from '@/lib/utils';

interface ModuleCardProps {
  module: Module;
  toolSlug: string;
  locked?: boolean;
  toolColor?: string;
}

export function ModuleCard({ module, toolSlug, locked = false, toolColor }: ModuleCardProps) {
  const { getCompletedLessonCountForModule, isModuleCompleted, skipModule } = useProgressStore();
  const lessonIds = module.lessons.map((l) => l.id);
  const completedCount = getCompletedLessonCountForModule(lessonIds);
  const totalCount = module.lessons.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  const completed = isModuleCompleted(module.id);

  const [showChallenge, setShowChallenge] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null);

  if (locked) {
    const challenge = getSkipChallenge(module.id);

    const handleSubmit = () => {
      if (!selectedOption || !challenge) return;
      if (selectedOption === challenge.correctOptionId) {
        setResult('correct');
        // Skip this module and its prerequisites so the chain unlocks
        skipModule(module.id);
        module.prerequisites.forEach((preId) => skipModule(preId));
      } else {
        setResult('wrong');
      }
    };

    const handleRetry = () => {
      setSelectedOption(null);
      setResult(null);
    };

    return (
      <div className={cn(
        'bg-surface/50 border border-border/50 rounded-xl p-5 opacity-80 transition-all',
        result === 'correct' && 'border-codex/50 opacity-100',
        result === 'wrong' && 'animate-shake',
      )}>
        <ConfettiExplosion trigger={result === 'correct'} />
        <div className="flex items-center gap-3 mb-3">
          {result === 'correct' ? (
            <Unlock size={20} className="text-codex-light" />
          ) : (
            <Lock size={20} className="text-muted" />
          )}
          <h3 className="font-bold text-muted">{module.title}</h3>
        </div>

        {!showChallenge ? (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted">Complete prerequisites to unlock</p>
            {challenge && (
              <button
                onClick={() => setShowChallenge(true)}
                className="text-xs px-3 py-1.5 rounded-lg bg-claude/10 text-claude-light hover:bg-claude/20 transition-colors font-medium"
              >
                Skip? Prove it
              </button>
            )}
          </div>
        ) : challenge && result === 'correct' ? (
          <div className="space-y-3 mt-3">
            <span className="text-codex-light font-medium text-sm">Correct!</span>
            <div className="flex items-center gap-2 text-codex-light text-sm">
              <CheckCircle size={16} />
              <span>Module unlocked!</span>
            </div>
          </div>
        ) : (
          <div className="space-y-3 mt-3">
            <p className="text-sm font-medium">{challenge?.question}</p>
            <div className="space-y-2">
              {challenge?.options.map((option) => {
                const isSelected = selectedOption === option.id;
                const isCorrectOption = option.id === challenge?.correctOptionId;
                return (
                  <button
                    key={option.id}
                    onClick={() => {
                      if (result === null) setSelectedOption(option.id);
                    }}
                    disabled={result !== null}
                    className={cn(
                      'w-full text-left text-sm px-3 py-2 rounded-lg border transition-all',
                      !result && isSelected && 'border-claude bg-claude/10',
                      !result && !isSelected && 'border-border/50 hover:border-muted/50',
                      result && isCorrectOption && 'border-codex bg-codex/10',
                      result && isSelected && !isCorrectOption && 'border-streak bg-streak/10',
                      result && !isSelected && !isCorrectOption && 'opacity-50',
                      result !== null && 'cursor-not-allowed',
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span>{option.text}</span>
                      {result && isCorrectOption && <CheckCircle size={16} className="text-codex-light" />}
                      {result && isSelected && !isCorrectOption && <XCircle size={16} className="text-streak" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {result === 'wrong' && challenge && (
              <div className="space-y-2">
                <span className="text-streak font-medium text-sm">Not quite.</span>
                <div className="text-sm text-muted bg-background rounded-lg p-3">
                  {challenge.explanation}
                </div>
              </div>
            )}

            <div className="flex gap-2">
              {result === null ? (
                <button
                  onClick={handleSubmit}
                  disabled={!selectedOption}
                  className="text-xs px-4 py-1.5 rounded-lg font-medium transition-colors bg-claude hover:bg-claude-light text-white disabled:opacity-50"
                >
                  Submit
                </button>
              ) : (
                <button
                  onClick={handleRetry}
                  className="text-xs px-4 py-1.5 rounded-lg font-medium bg-surface-hover text-foreground hover:bg-border transition-colors"
                >
                  Try Again
                </button>
              )}
              <button
                onClick={() => {
                  setShowChallenge(false);
                  setSelectedOption(null);
                  setResult(null);
                }}
                className="text-xs px-3 py-1.5 rounded-lg text-muted hover:text-foreground transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <Link href={`/learn/${toolSlug}/${module.slug}`}>
      <div className={cn(
        'bg-surface border rounded-xl p-5 transition-all hover:bg-surface-hover',
        completed ? 'border-codex/30' : 'border-border hover:border-muted/50'
      )}>
        <div className="flex items-center gap-3 mb-2">
          {completed ? (
            <CheckCircle size={20} className="text-codex-light" />
          ) : (
            <BookOpen size={20} style={{ color: toolColor }} />
          )}
          <h3 className="font-bold">{module.title}</h3>
        </div>
        <p className="text-sm text-muted mb-3">{module.description}</p>
        <div className="flex items-center gap-3">
          <ProgressBar value={progress} size="sm" color={completed ? 'bg-codex' : 'bg-claude'} className="flex-1" />
          <span className="text-xs text-muted whitespace-nowrap">{completedCount}/{totalCount}</span>
        </div>
      </div>
    </Link>
  );
}
