import { tools as toolDefs } from './tools';
import { claudeModules } from './modules/claude';
import { cursorModules } from './modules/cursor';
import { codexModules } from './modules/codex';
import { Tool, Module, Lesson } from '@/types';

// Attach modules to tools
const toolsWithModules: Tool[] = toolDefs.map((tool) => {
  switch (tool.slug) {
    case 'claude':
      return { ...tool, modules: claudeModules };
    case 'cursor':
      return { ...tool, modules: cursorModules };
    case 'codex':
      return { ...tool, modules: codexModules };
    default:
      return tool;
  }
});

export const tools = toolsWithModules;

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find((t) => t.slug === slug);
}

export function getModuleById(moduleId: string): Module | undefined {
  for (const tool of tools) {
    const mod = tool.modules.find((m) => m.id === moduleId);
    if (mod) return mod;
  }
  return undefined;
}

export function getModuleBySlug(toolSlug: string, moduleSlug: string): Module | undefined {
  const tool = getToolBySlug(toolSlug);
  return tool?.modules.find((m) => m.slug === moduleSlug);
}

export function getLessonBySlug(toolSlug: string, moduleSlug: string, lessonSlug: string): Lesson | undefined {
  const mod = getModuleBySlug(toolSlug, moduleSlug);
  return mod?.lessons.find((l) => l.slug === lessonSlug);
}

export function getLessonById(lessonId: string): Lesson | undefined {
  for (const tool of tools) {
    for (const mod of tool.modules) {
      const lesson = mod.lessons.find((l) => l.id === lessonId);
      if (lesson) return lesson;
    }
  }
  return undefined;
}

export function getAllLessons(): Lesson[] {
  return tools.flatMap((t) => t.modules.flatMap((m) => m.lessons));
}

export function getAllModules(): Module[] {
  return tools.flatMap((t) => t.modules);
}

export function getNextLesson(currentLessonId: string): Lesson | undefined {
  const allLessons = getAllLessons();
  const idx = allLessons.findIndex((l) => l.id === currentLessonId);
  if (idx === -1 || idx === allLessons.length - 1) return undefined;
  return allLessons[idx + 1];
}
