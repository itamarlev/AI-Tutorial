'use client';

import { use } from 'react';
import { getToolBySlug } from '@/data';
import { ModuleCard } from '@/components/learning/ModuleCard';
import { useProgressStore } from '@/stores/useProgressStore';
import { ArrowLeft, Brain, Code, Sparkles } from 'lucide-react';
import Link from 'next/link';

const toolIcons: Record<string, React.ElementType> = { claude: Brain, cursor: Code, codex: Sparkles };

export default function ToolPage({ params }: { params: Promise<{ toolSlug: string }> }) {
  const { toolSlug } = use(params);
  const tool = getToolBySlug(toolSlug);
  const { completedModules, skippedModules } = useProgressStore();

  if (!tool) {
    return <div className="text-center py-20 text-muted">Tool not found</div>;
  }

  const Icon = toolIcons[tool.slug] || Brain;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link href="/learn" className="flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors">
        <ArrowLeft size={16} /> Back to tools
      </Link>

      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${tool.color}20` }}>
          <Icon size={28} style={{ color: tool.color }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold" style={{ color: tool.accentColor }}>{tool.name}</h1>
          <p className="text-muted text-sm">{tool.description}</p>
        </div>
      </div>

      <div className="grid gap-4">
        {tool.modules.map((mod) => {
          const isLocked = mod.prerequisites.length > 0 &&
            !mod.prerequisites.every((preId) =>
              completedModules.includes(preId) || skippedModules.includes(preId)
            );
          return (
            <ModuleCard
              key={mod.id}
              module={mod}
              toolSlug={tool.slug}
              locked={isLocked}
              toolColor={tool.color}
            />
          );
        })}
      </div>
    </div>
  );
}
