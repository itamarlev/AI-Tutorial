'use client';

import { useState } from 'react';
import { PromptExercise as PromptExerciseType } from '@/types';
import { PromptEditor } from '@/components/playground/PromptEditor';
import { SimulatedResponse } from '@/components/playground/SimulatedResponse';
import { ResponseEvaluator } from '@/components/playground/ResponseEvaluator';
import { HintPanel } from '@/components/playground/HintPanel';
import { evaluatePrompt, calculateExerciseXP, EvaluationResult } from '@/lib/evaluator';

interface PromptExerciseProps {
  exercise: PromptExerciseType;
  onComplete: (correct: boolean, firstAttempt: boolean) => void;
}

export function PromptExerciseComponent({ exercise, onComplete }: PromptExerciseProps) {
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [response, setResponse] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [completed, setCompleted] = useState(false);

  const handleSubmit = (prompt: string) => {
    const evalResult = evaluatePrompt(prompt, exercise.criteria);
    setResult(evalResult);
    setResponse(exercise.responses[evalResult.responseVariant]);
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    if (evalResult.score >= 0.5 && !completed) {
      setCompleted(true);
      onComplete(evalResult.score >= 0.8, newAttempts === 1);
    }
  };

  const xpEarned = result ? calculateExerciseXP(exercise.xpReward, result.score) : 0;

  return (
    <div className="bg-surface border border-border rounded-xl p-6 space-y-4">
      <div>
        <h3 className="font-bold mb-1">{exercise.title}</h3>
        <p className="text-sm text-muted">{exercise.description}</p>
      </div>

      <PromptEditor
        onSubmit={handleSubmit}
        context={exercise.context}
        placeholder="Write your prompt here..."
        disabled={false}
      />

      {response && <SimulatedResponse content={response} />}
      {result && <ResponseEvaluator result={result} xpEarned={xpEarned} />}
      {!completed && <HintPanel hints={exercise.hints} />}
    </div>
  );
}
