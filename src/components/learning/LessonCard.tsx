'use client';

import Link from 'next/link';
import { Lesson } from '@/types';
import { useProgressStore } from '@/stores/useProgressStore';
import { CheckCircle, Clock, Star, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LessonCardProps {
  lesson: Lesson;
  locked?: boolean;
}

export function LessonCard({ lesson, locked = false }: LessonCardProps) {
  const { isLessonCompleted, getLessonProgress } = useProgressStore();
  const completed = isLessonCompleted(lesson.id);
  const progress = getLessonProgress(lesson.id);

  if (locked) {
    return (
      <div className="flex items-center gap-4 p-4 rounded-lg bg-surface/50 border border-border/50 opacity-60">
        <Lock size={20} className="text-muted" />
        <div>
          <div className="font-medium text-muted">{lesson.title}</div>
          <div className="text-xs text-muted">Complete prerequisites to unlock</div>
        </div>
      </div>
    );
  }

  return (
    <Link href={`/learn/${lesson.toolSlug}/${lesson.moduleSlug}/${lesson.slug}`}>
      <div className={cn(
        'flex items-center gap-4 p-4 rounded-lg border transition-all hover:bg-surface-hover',
        completed ? 'bg-codex/5 border-codex/20' : 'bg-surface border-border'
      )}>
        <div className={cn(
          'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
          completed ? 'bg-codex/20' : 'bg-claude/10'
        )}>
          {completed ? (
            <CheckCircle size={20} className="text-codex-light" />
          ) : (
            <span className="text-sm font-bold text-claude-light">{lesson.order}</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium">{lesson.title}</div>
          <div className="text-xs text-muted mt-0.5">{lesson.description}</div>
          <div className="flex items-center gap-3 mt-1.5">
            <span className="flex items-center gap-1 text-xs text-muted">
              <Clock size={12} /> {lesson.estimatedMinutes} min
            </span>
            <span className="flex items-center gap-1 text-xs text-xp">
              <Star size={12} /> {lesson.xpReward} XP
            </span>
            {progress?.perfectScore && (
              <span className="text-xs text-legendary">Perfect!</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
