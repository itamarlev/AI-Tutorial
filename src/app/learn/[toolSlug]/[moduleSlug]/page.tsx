'use client';

import { use } from 'react';
import { getModuleBySlug, getToolBySlug } from '@/data';
import { LessonCard } from '@/components/learning/LessonCard';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useProgressStore } from '@/stores/useProgressStore';
import { ArrowLeft, BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function ModulePage({ params }: { params: Promise<{ toolSlug: string; moduleSlug: string }> }) {
  const { toolSlug, moduleSlug } = use(params);
  const tool = getToolBySlug(toolSlug);
  const mod = getModuleBySlug(toolSlug, moduleSlug);
  const { getCompletedLessonCountForModule } = useProgressStore();

  if (!mod || !tool) {
    return <div className="text-center py-20 text-muted">Module not found</div>;
  }

  const lessonIds = mod.lessons.map((l) => l.id);
  const completedCount = getCompletedLessonCountForModule(lessonIds);
  const progress = lessonIds.length > 0 ? (completedCount / lessonIds.length) * 100 : 0;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link href={`/learn/${toolSlug}`} className="flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors">
        <ArrowLeft size={16} /> Back to {tool.name}
      </Link>

      <div>
        <div className="flex items-center gap-2 mb-1">
          <BookOpen size={20} style={{ color: tool.color }} />
          <span className="text-sm font-medium" style={{ color: tool.accentColor }}>{tool.name}</span>
        </div>
        <h1 className="text-2xl font-bold">{mod.title}</h1>
        <p className="text-muted text-sm mt-1">{mod.description}</p>
        <div className="flex items-center gap-3 mt-3">
          <ProgressBar value={progress} size="sm" className="flex-1 max-w-xs" />
          <span className="text-xs text-muted">{completedCount}/{lessonIds.length} lessons</span>
        </div>
      </div>

      <div className="space-y-3">
        {mod.lessons.map((lesson) => (
          <LessonCard key={lesson.id} lesson={lesson} />
        ))}
      </div>
    </div>
  );
}
