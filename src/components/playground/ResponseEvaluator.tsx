'use client';

import { EvaluationResult } from '@/lib/evaluator';
import { CheckCircle, XCircle, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResponseEvaluatorProps {
  result: EvaluationResult;
  xpEarned: number;
}

export function ResponseEvaluator({ result, xpEarned }: ResponseEvaluatorProps) {
  const scorePercent = Math.round(result.score * 100);

  return (
    <div className="bg-surface border border-border rounded-lg p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold">Evaluation</h3>
        <div className="flex items-center gap-2">
          <span className={cn(
            'text-lg font-bold',
            result.responseVariant === 'excellent' ? 'text-codex-light' :
            result.responseVariant === 'good' ? 'text-xp' : 'text-streak'
          )}>
            {scorePercent}%
          </span>
          <span className="flex items-center gap-1 text-sm text-xp">
            <Star size={14} /> +{xpEarned} XP
          </span>
        </div>
      </div>
      <div className="space-y-2">
        {result.criteriaResults.map((cr) => (
          <div key={cr.criteriaId} className="flex items-center gap-2 text-sm">
            {cr.met ? (
              <CheckCircle size={16} className="text-codex-light flex-shrink-0" />
            ) : (
              <XCircle size={16} className="text-streak flex-shrink-0" />
            )}
            <span className={cr.met ? 'text-foreground' : 'text-muted'}>{cr.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
