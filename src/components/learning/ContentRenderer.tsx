'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ContentBlock } from '@/types';
import { Info, Lightbulb, AlertTriangle, CheckCircle } from 'lucide-react';

interface ContentRendererProps {
  blocks: ContentBlock[];
}

const calloutConfig = {
  info: { icon: Info, bg: 'bg-cursor/10', border: 'border-cursor/30', text: 'text-cursor-light' },
  tip: { icon: Lightbulb, bg: 'bg-codex/10', border: 'border-codex/30', text: 'text-codex-light' },
  warning: { icon: AlertTriangle, bg: 'bg-xp/10', border: 'border-xp/30', text: 'text-xp' },
  success: { icon: CheckCircle, bg: 'bg-codex/10', border: 'border-codex/30', text: 'text-codex-light' },
};

export function ContentRenderer({ blocks }: ContentRendererProps) {
  return (
    <div className="space-y-6">
      {blocks.map((block, i) => {
        switch (block.type) {
          case 'markdown':
            return (
              <div key={i} className="prose prose-invert prose-sm max-w-none prose-headings:text-foreground prose-p:text-muted prose-strong:text-foreground prose-code:text-claude-light prose-a:text-claude-light">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{block.content}</ReactMarkdown>
              </div>
            );
          case 'code':
            return (
              <div key={i} className="rounded-lg overflow-hidden border border-border">
                {block.filename && (
                  <div className="bg-surface-hover px-4 py-2 text-xs text-muted border-b border-border font-mono">
                    {block.filename}
                  </div>
                )}
                <pre className="bg-background p-4 overflow-x-auto">
                  <code className="text-sm font-mono text-foreground">{block.code}</code>
                </pre>
              </div>
            );
          case 'callout': {
            const config = calloutConfig[block.variant];
            const Icon = config.icon;
            return (
              <div key={i} className={`${config.bg} border ${config.border} rounded-lg p-4 flex gap-3`}>
                <Icon size={20} className={`${config.text} flex-shrink-0 mt-0.5`} />
                <div className="text-sm text-foreground">{block.content}</div>
              </div>
            );
          }
          case 'image':
            return (
              <figure key={i} className="my-4">
                <img src={block.src} alt={block.alt} className="rounded-lg max-w-full" />
                {block.caption && <figcaption className="text-xs text-muted mt-2 text-center">{block.caption}</figcaption>}
              </figure>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
