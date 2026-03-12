'use client';

import { useState } from 'react';
import { Lightbulb, ChevronDown, ChevronRight } from 'lucide-react';

interface HintPanelProps {
  hints: string[];
}

export function HintPanel({ hints }: HintPanelProps) {
  const [revealedCount, setRevealedCount] = useState(0);

  if (hints.length === 0) return null;

  return (
    <div className="bg-surface border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Lightbulb size={16} className="text-xp" />
          Hints
        </div>
        {revealedCount < hints.length && (
          <button
            onClick={() => setRevealedCount((c) => c + 1)}
            className="text-xs text-claude-light hover:text-claude transition-colors"
          >
            Show hint ({revealedCount}/{hints.length})
          </button>
        )}
      </div>
      <div className="space-y-2">
        {hints.map((hint, i) => (
          <div key={i} className="flex items-start gap-2 text-sm">
            {i < revealedCount ? (
              <>
                <ChevronDown size={14} className="text-xp mt-0.5 flex-shrink-0" />
                <span className="text-muted">{hint}</span>
              </>
            ) : (
              <>
                <ChevronRight size={14} className="text-muted mt-0.5 flex-shrink-0" />
                <span className="text-muted/50">Hidden hint</span>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
