import { Tool } from '@/types';

export const tools: Tool[] = [
  {
    id: 'tool-claude',
    slug: 'claude',
    name: 'Claude',
    description: 'Master Anthropic\'s Claude — from CLI workflows to API integration and advanced prompt engineering.',
    color: '#a855f7',
    accentColor: '#c084fc',
    icon: '🟣',
    modules: [],
  },
  {
    id: 'tool-cursor',
    slug: 'cursor',
    name: 'Cursor',
    description: 'Learn Cursor IDE — AI-powered code editing, tab completion, chat, and multi-file workflows.',
    color: '#3b82f6',
    accentColor: '#60a5fa',
    icon: '🔵',
    modules: [],
  },
  {
    id: 'tool-codex',
    slug: 'codex',
    name: 'Codex',
    description: 'Explore OpenAI Codex — code generation, language-specific patterns, and CI/CD integration.',
    color: '#22c55e',
    accentColor: '#4ade80',
    icon: '🟢',
    modules: [],
  },
];

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find((t) => t.slug === slug);
}
