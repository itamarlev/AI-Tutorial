import { type ClassValue, clsx } from 'clsx';

// Simple clsx-like utility (no need for tailwind-merge for this project)
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

export function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function getToolColor(toolSlug: string): string {
  switch (toolSlug) {
    case 'claude': return 'var(--color-claude)';
    case 'cursor': return 'var(--color-cursor)';
    case 'codex': return 'var(--color-codex)';
    default: return 'var(--color-muted)';
  }
}

export function getToolColorClass(toolSlug: string): { bg: string; text: string; border: string } {
  switch (toolSlug) {
    case 'claude':
      return { bg: 'bg-claude/20', text: 'text-claude-light', border: 'border-claude/30' };
    case 'cursor':
      return { bg: 'bg-cursor/20', text: 'text-cursor-light', border: 'border-cursor/30' };
    case 'codex':
      return { bg: 'bg-codex/20', text: 'text-codex-light', border: 'border-codex/30' };
    default:
      return { bg: 'bg-muted/20', text: 'text-muted', border: 'border-muted/30' };
  }
}

export function getRarityColor(rarity: string): string {
  switch (rarity) {
    case 'common': return 'text-common';
    case 'rare': return 'text-rare';
    case 'epic': return 'text-epic';
    case 'legendary': return 'text-legendary';
    default: return 'text-muted';
  }
}
