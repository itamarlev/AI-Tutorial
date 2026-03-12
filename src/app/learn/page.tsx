'use client';

import { useState, useMemo } from 'react';
import { tools } from '@/data';
import { Lesson, ContentBlock, Exercise } from '@/types';
import { Card } from '@/components/ui/Card';
import { useProgressStore } from '@/stores/useProgressStore';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { BookOpen, Brain, Code, Sparkles, Search, X, Clock, Zap } from 'lucide-react';
import Link from 'next/link';

const toolIcons: Record<string, React.ElementType> = { claude: Brain, cursor: Code, codex: Sparkles };

interface SearchResult {
  lesson: Lesson;
  moduleSlug: string;
  moduleTitle: string;
  toolSlug: string;
  toolName: string;
  toolColor: string;
}

function getContentText(block: ContentBlock): string {
  switch (block.type) {
    case 'markdown': return block.content;
    case 'code': return block.code;
    case 'callout': return block.content;
    case 'image': return `${block.alt} ${block.caption ?? ''}`;
  }
}

function getExerciseText(ex: Exercise): string {
  const parts = [ex.title];
  switch (ex.type) {
    case 'multiple_choice':
      parts.push(ex.question, ex.explanation, ...ex.options.map(o => o.text));
      break;
    case 'prompt':
      parts.push(ex.description, ...ex.hints);
      break;
    case 'code_completion':
      parts.push(ex.description, ex.codeTemplate);
      break;
    case 'ordering':
      parts.push(ex.description, ...ex.items.map(i => i.text));
      break;
  }
  return parts.join(' ');
}

interface IndexedLesson {
  searchText: string;
  lesson: Lesson;
  moduleSlug: string;
  moduleTitle: string;
  toolSlug: string;
  toolName: string;
  toolColor: string;
}

const searchIndex: IndexedLesson[] = tools.flatMap(tool =>
  tool.modules.flatMap(mod =>
    mod.lessons.map(lesson => ({
      searchText: [
        lesson.title,
        lesson.description,
        mod.title,
        tool.name,
        ...lesson.content.map(getContentText),
        ...lesson.exercises.map(getExerciseText),
      ].join(' ').toLowerCase(),
      lesson,
      moduleSlug: mod.slug,
      moduleTitle: mod.title,
      toolSlug: tool.slug,
      toolName: tool.name,
      toolColor: tool.color,
    }))
  )
);

export default function LearnPage() {
  const { getCompletedLessonCountForModule } = useProgressStore();
  const [query, setQuery] = useState('');

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];

    const words = q.split(/\s+/).filter(w => w.length > 0);
    return searchIndex.filter(entry =>
      words.every(word => entry.searchText.includes(word))
    );
  }, [query]);

  const isSearching = query.trim().length >= 2;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <BookOpen size={24} className="text-claude-light" />
          Learn AI Tools
        </h1>
        <p className="text-muted mt-1">Master three powerful AI developer tools through interactive lessons.</p>
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search lessons..."
          className="w-full pl-9 pr-9 py-2.5 bg-surface border border-border rounded-lg text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-claude transition-colors"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {isSearching ? (
        <div className="space-y-2">
          <p className="text-sm text-muted">
            {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for &quot;{query.trim()}&quot;
          </p>
          {searchResults.length === 0 ? (
            <p className="text-sm text-muted py-8 text-center">No lessons found. Try a different search term.</p>
          ) : (
            <div className="space-y-2">
              {searchResults.map((r) => {
                const Icon = toolIcons[r.toolSlug] || BookOpen;
                return (
                  <Link
                    key={r.lesson.id}
                    href={`/learn/${r.toolSlug}/${r.moduleSlug}/${r.lesson.slug}`}
                  >
                    <div className="bg-surface border border-border rounded-lg p-4 hover:bg-surface-hover hover:border-muted/50 transition-all">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: `${r.toolColor}20` }}>
                          <Icon size={16} style={{ color: r.toolColor }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm">{r.lesson.title}</h3>
                          <p className="text-xs text-muted mt-0.5 truncate">{r.lesson.description}</p>
                          <div className="flex items-center gap-3 mt-1.5">
                            <span className="text-xs px-1.5 py-0.5 rounded bg-background" style={{ color: r.toolColor }}>{r.toolName}</span>
                            <span className="text-xs text-muted">{r.moduleTitle}</span>
                            <span className="text-xs text-muted flex items-center gap-1"><Clock size={10} />{r.lesson.estimatedMinutes}m</span>
                            <span className="text-xs text-xp flex items-center gap-1"><Zap size={10} />{r.lesson.xpReward} XP</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {tools.map((tool) => {
            const totalLessons = tool.modules.reduce((sum, m) => sum + m.lessons.length, 0);
            const completedLessons = tool.modules.reduce((sum, m) => {
              return sum + getCompletedLessonCountForModule(m.lessons.map((l) => l.id));
            }, 0);
            const progress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
            const Icon = toolIcons[tool.slug] || BookOpen;

            return (
              <Link key={tool.id} href={`/learn/${tool.slug}`}>
                <Card hover glow={tool.color}>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${tool.color}20` }}>
                      <Icon size={24} style={{ color: tool.color }} />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-lg font-bold" style={{ color: tool.accentColor }}>{tool.name}</h2>
                      <p className="text-sm text-muted mt-1">{tool.description}</p>
                      <div className="flex items-center gap-3 mt-3">
                        <ProgressBar value={progress} size="sm" className="flex-1" color={`bg-[${tool.color}]`} />
                        <span className="text-xs text-muted whitespace-nowrap">{completedLessons}/{totalLessons} lessons</span>
                      </div>
                      <div className="flex gap-2 mt-2">
                        {tool.modules.map((m) => (
                          <span key={m.id} className="text-xs text-muted bg-background px-2 py-0.5 rounded">{m.title}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
