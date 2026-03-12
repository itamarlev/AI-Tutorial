'use client';

import { useState } from 'react';
import { MultipleChoiceExercise } from '@/types';
import { cn } from '@/lib/utils';
import { CheckCircle, XCircle } from 'lucide-react';

interface QuizQuestionProps {
  exercise: MultipleChoiceExercise;
  onComplete: (correct: boolean, firstAttempt: boolean) => void;
}

export function QuizQuestion({ exercise, onComplete }: QuizQuestionProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const isCorrect = selectedId === exercise.correctOptionId;

  const handleSubmit = () => {
    if (!selectedId) return;
    setIsSubmitted(true);
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    if (isCorrect) {
      onComplete(true, newAttempts === 1);
    }
  };

  const handleRetry = () => {
    setSelectedId(null);
    setIsSubmitted(false);
  };

  return (
    <div className="bg-surface border border-border rounded-xl p-6">
      <h3 className="font-bold mb-1">{exercise.title}</h3>
      <p className="text-sm text-muted mb-4">{exercise.question}</p>
      <div className="space-y-2 mb-4">
        {exercise.options.map((option) => {
          const isSelected = selectedId === option.id;
          const isCorrectOption = option.id === exercise.correctOptionId;
          return (
            <button
              key={option.id}
              onClick={() => !isSubmitted && setSelectedId(option.id)}
              disabled={isSubmitted}
              className={cn(
                'w-full text-left p-3 rounded-lg border transition-all text-sm',
                !isSubmitted && isSelected && 'border-claude bg-claude/10',
                !isSubmitted && !isSelected && 'border-border hover:border-muted',
                isSubmitted && isCorrectOption && 'border-codex bg-codex/10',
                isSubmitted && isSelected && !isCorrectOption && 'border-streak bg-streak/10',
                isSubmitted && !isSelected && !isCorrectOption && 'opacity-50',
              )}
            >
              <div className="flex items-center justify-between">
                <span>{option.text}</span>
                {isSubmitted && isCorrectOption && <CheckCircle size={16} className="text-codex-light" />}
                {isSubmitted && isSelected && !isCorrectOption && <XCircle size={16} className="text-streak" />}
              </div>
            </button>
          );
        })}
      </div>
      {!isSubmitted ? (
        <button
          onClick={handleSubmit}
          disabled={!selectedId}
          className="px-4 py-2 bg-claude hover:bg-claude-light text-white rounded-lg text-sm disabled:opacity-50 transition-colors"
        >
          Check Answer
        </button>
      ) : (
        <div>
          <div className={cn('text-sm mb-3', isCorrect ? 'text-codex-light' : 'text-streak')}>
            {isCorrect ? 'Correct!' : 'Not quite.'}
          </div>
          <div className="text-sm text-muted bg-background rounded-lg p-3 mb-3">{exercise.explanation}</div>
          {!isCorrect && (
            <button onClick={handleRetry} className="px-4 py-2 bg-surface-hover text-foreground rounded-lg text-sm hover:bg-border transition-colors">
              Try Again
            </button>
          )}
          {isCorrect && (
            <div className="text-xs text-xp">+{exercise.xpReward} XP</div>
          )}
        </div>
      )}
    </div>
  );
}
