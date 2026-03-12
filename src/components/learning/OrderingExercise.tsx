'use client';

import { useState } from 'react';
import { OrderingExercise as OrderingType } from '@/types';
import { GripVertical, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OrderingExerciseProps {
  exercise: OrderingType;
  onComplete: (correct: boolean, firstAttempt: boolean) => void;
}

export function OrderingExerciseComponent({ exercise, onComplete }: OrderingExerciseProps) {
  const [items, setItems] = useState(() => [...exercise.items].sort(() => Math.random() - 0.5));
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const isCorrect = items.every((item, i) => item.id === exercise.correctOrder[i]);

  const handleDragStart = (index: number) => {
    setDragIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    const newItems = [...items];
    const [dragged] = newItems.splice(dragIndex, 1);
    newItems.splice(index, 0, dragged);
    setItems(newItems);
    setDragIndex(index);
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    if (isCorrect) {
      onComplete(true, newAttempts === 1);
    }
  };

  const handleRetry = () => {
    setIsSubmitted(false);
    setItems([...exercise.items].sort(() => Math.random() - 0.5));
  };

  // Also support click-to-move
  const moveItem = (from: number, direction: 'up' | 'down') => {
    if (isSubmitted) return;
    const to = direction === 'up' ? from - 1 : from + 1;
    if (to < 0 || to >= items.length) return;
    const newItems = [...items];
    [newItems[from], newItems[to]] = [newItems[to], newItems[from]];
    setItems(newItems);
  };

  return (
    <div className="bg-surface border border-border rounded-xl p-6">
      <h3 className="font-bold mb-1">{exercise.title}</h3>
      <p className="text-sm text-muted mb-4">{exercise.description}</p>
      <div className="space-y-2 mb-4">
        {items.map((item, index) => {
          const correctPosition = exercise.correctOrder.indexOf(item.id);
          const isItemCorrect = index === correctPosition;

          return (
            <div
              key={item.id}
              draggable={!isSubmitted}
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              className={cn(
                'flex items-center gap-3 p-3 rounded-lg border transition-all cursor-grab active:cursor-grabbing',
                !isSubmitted && 'bg-background border-border hover:border-muted',
                isSubmitted && isItemCorrect && 'bg-codex/10 border-codex/30',
                isSubmitted && !isItemCorrect && 'bg-streak/10 border-streak/30',
              )}
            >
              <GripVertical size={16} className="text-muted flex-shrink-0" />
              <span className="text-sm font-mono text-muted mr-2">{index + 1}.</span>
              <span className="text-sm flex-1">{item.text}</span>
              {!isSubmitted && (
                <div className="flex gap-1">
                  <button onClick={() => moveItem(index, 'up')} disabled={index === 0} className="text-xs text-muted hover:text-foreground disabled:opacity-30">Up</button>
                  <button onClick={() => moveItem(index, 'down')} disabled={index === items.length - 1} className="text-xs text-muted hover:text-foreground disabled:opacity-30">Down</button>
                </div>
              )}
              {isSubmitted && (
                isItemCorrect ? <CheckCircle size={16} className="text-codex-light" /> : <XCircle size={16} className="text-streak" />
              )}
            </div>
          );
        })}
      </div>
      {!isSubmitted ? (
        <button onClick={handleSubmit} className="px-4 py-2 bg-claude hover:bg-claude-light text-white rounded-lg text-sm transition-colors">
          Check Order
        </button>
      ) : isCorrect ? (
        <div className="text-sm text-codex-light">Correct order! +{exercise.xpReward} XP</div>
      ) : (
        <div className="flex items-center gap-3">
          <span className="text-sm text-streak">Not quite right</span>
          <button onClick={handleRetry} className="px-4 py-2 bg-surface-hover text-foreground rounded-lg text-sm hover:bg-border transition-colors">
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}
