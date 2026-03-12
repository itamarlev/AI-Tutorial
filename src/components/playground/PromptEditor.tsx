'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Send } from 'lucide-react';

interface PromptEditorProps {
  onSubmit: (prompt: string) => void;
  placeholder?: string;
  context?: string;
  disabled?: boolean;
}

export function PromptEditor({ onSubmit, placeholder = 'Type your prompt here...', context, disabled = false }: PromptEditorProps) {
  const [value, setValue] = useState('');

  const handleSubmit = () => {
    if (!value.trim() || disabled) return;
    onSubmit(value.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit();
    }
  };

  return (
    <div className="space-y-3">
      {context && (
        <div className="bg-claude/5 border border-claude/20 rounded-lg p-3 text-sm text-muted">
          <span className="text-claude-light font-medium">Context: </span>
          {context}
        </div>
      )}
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={5}
          className="w-full bg-background border border-border rounded-lg p-4 pr-14 text-sm font-mono text-foreground resize-none focus:outline-none focus:border-claude transition-colors placeholder:text-muted/50"
        />
        <Button
          onClick={handleSubmit}
          disabled={!value.trim() || disabled}
          size="sm"
          className="absolute bottom-3 right-3"
        >
          <Send size={14} />
        </Button>
      </div>
      <div className="text-xs text-muted">Press Cmd/Ctrl+Enter to submit</div>
    </div>
  );
}
