'use client';

import { useState } from 'react';
import { CodeCompletionExercise as CodeCompletionType } from '@/types';
import { CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CodeCompletionExerciseProps {
  exercise: CodeCompletionType;
  onComplete: (correct: boolean, firstAttempt: boolean) => void;
}

export function CodeCompletionExerciseComponent({ exercise, onComplete }: CodeCompletionExerciseProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const checkAnswers = () => {
    return exercise.blanks.every((blank) => {
      const userAnswer = (answers[blank.id] || '').trim().toLowerCase();
      const correctAnswer = blank.answer.toLowerCase();
      const alternatives = blank.alternatives?.map((a) => a.toLowerCase()) || [];
      return userAnswer === correctAnswer || alternatives.includes(userAnswer);
    });
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    const allCorrect = checkAnswers();
    if (allCorrect) {
      onComplete(true, newAttempts === 1);
    }
  };

  const handleRetry = () => {
    setIsSubmitted(false);
    setAnswers({});
  };

  const isCorrect = checkAnswers();

  // Render code template with input blanks
  const parts = exercise.codeTemplate.split(/(___BLANK_\w+___)/g);

  return (
    <div className="bg-surface border border-border rounded-xl p-6">
      <h3 className="font-bold mb-1">{exercise.title}</h3>
      <p className="text-sm text-muted mb-4">{exercise.description}</p>
      <pre className="bg-background rounded-lg p-4 overflow-x-auto text-sm font-mono">
        {parts.map((part, i) => {
          const blankMatch = part.match(/___(\w+)___/);
          if (blankMatch) {
            const blankId = blankMatch[1];
            const blank = exercise.blanks.find((b) => b.id === blankId);
            const userAnswer = answers[blankId] || '';
            const isBlankCorrect = blank && (
              userAnswer.trim().toLowerCase() === blank.answer.toLowerCase() ||
              blank.alternatives?.some((a) => a.toLowerCase() === userAnswer.trim().toLowerCase())
            );

            return (
              <span key={i} className="inline-block mx-1">
                <input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setAnswers({ ...answers, [blankId]: e.target.value })}
                  disabled={isSubmitted && isCorrect}
                  placeholder={blank?.hint || '...'}
                  className={cn(
                    'bg-background border-b-2 px-2 py-0.5 text-sm font-mono outline-none min-w-[120px]',
                    !isSubmitted && 'border-claude/50 focus:border-claude text-foreground',
                    isSubmitted && isBlankCorrect && 'border-codex text-codex-light',
                    isSubmitted && !isBlankCorrect && 'border-streak text-streak',
                  )}
                />
                {isSubmitted && (
                  <span className="inline-block ml-1">
                    {isBlankCorrect ? (
                      <CheckCircle size={14} className="inline text-codex-light" />
                    ) : (
                      <XCircle size={14} className="inline text-streak" />
                    )}
                  </span>
                )}
              </span>
            );
          }
          return <span key={i}>{part}</span>;
        })}
      </pre>
      <div className="mt-4">
        {!isSubmitted ? (
          <button onClick={handleSubmit} className="px-4 py-2 bg-claude hover:bg-claude-light text-white rounded-lg text-sm transition-colors">
            Check Answers
          </button>
        ) : isCorrect ? (
          <div className="text-sm text-codex-light">All correct! +{exercise.xpReward} XP</div>
        ) : (
          <div className="flex items-center gap-3">
            <span className="text-sm text-streak">Some answers need fixing</span>
            <button onClick={handleRetry} className="px-4 py-2 bg-surface-hover text-foreground rounded-lg text-sm hover:bg-border transition-colors">
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
