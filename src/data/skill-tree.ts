import { SkillTree } from '@/types';

export const skillTrees: SkillTree[] = [
  {
    toolSlug: 'claude',
    nodes: [
      { id: 'st-claude-cli', moduleId: 'claude-cli', x: 200, y: 80, connections: ['st-claude-api', 'st-claude-prompts'] },
      { id: 'st-claude-api', moduleId: 'claude-api', x: 100, y: 220, connections: [] },
      { id: 'st-claude-prompts', moduleId: 'claude-prompts', x: 300, y: 220, connections: ['st-claude-contexts'] },
      { id: 'st-claude-contexts', moduleId: 'claude-contexts', x: 300, y: 360, connections: [] },
    ],
  },
  {
    toolSlug: 'cursor',
    nodes: [
      { id: 'st-cursor-basics', moduleId: 'cursor-basics', x: 200, y: 80, connections: ['st-cursor-features'] },
      { id: 'st-cursor-features', moduleId: 'cursor-features', x: 200, y: 220, connections: ['st-cursor-workflow'] },
      { id: 'st-cursor-workflow', moduleId: 'cursor-workflow', x: 200, y: 360, connections: [] },
    ],
  },
  {
    toolSlug: 'codex',
    nodes: [
      { id: 'st-codex-overview', moduleId: 'codex-overview', x: 200, y: 80, connections: ['st-codex-gen'] },
      { id: 'st-codex-gen', moduleId: 'codex-generation', x: 200, y: 220, connections: ['st-codex-int'] },
      { id: 'st-codex-int', moduleId: 'codex-integration', x: 200, y: 360, connections: [] },
    ],
  },
];
