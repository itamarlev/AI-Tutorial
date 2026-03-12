'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LessonProgress, ExerciseResult } from '@/types';

interface ProgressState {
  lessonProgress: Record<string, LessonProgress>;
  completedModules: string[];
  skippedModules: string[];

  // Actions
  markLessonComplete: (lessonId: string, exerciseResults: Record<string, ExerciseResult>) => void;
  updateExerciseResult: (lessonId: string, result: ExerciseResult) => void;
  isLessonCompleted: (lessonId: string) => boolean;
  isModuleCompleted: (moduleId: string) => boolean;
  markModuleComplete: (moduleId: string) => void;
  getLessonProgress: (lessonId: string) => LessonProgress | undefined;
  getCompletedLessonCount: () => number;
  getCompletedLessonCountForModule: (lessonIds: string[]) => number;
  skipModule: (moduleId: string) => void;
  isModuleSkipped: (moduleId: string) => boolean;
  reset: () => void;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      lessonProgress: {},
      completedModules: [],
      skippedModules: [],

      markLessonComplete: (lessonId, exerciseResults) => {
        const allPerfect = Object.values(exerciseResults).every(
          (r) => r.firstAttemptCorrect
        );
        set((state) => ({
          lessonProgress: {
            ...state.lessonProgress,
            [lessonId]: {
              lessonId,
              completed: true,
              completedAt: new Date().toISOString(),
              exerciseResults,
              perfectScore: allPerfect,
            },
          },
        }));
      },

      updateExerciseResult: (lessonId, result) =>
        set((state) => {
          const existing = state.lessonProgress[lessonId] || {
            lessonId,
            completed: false,
            exerciseResults: {},
            perfectScore: false,
          };
          return {
            lessonProgress: {
              ...state.lessonProgress,
              [lessonId]: {
                ...existing,
                exerciseResults: {
                  ...existing.exerciseResults,
                  [result.exerciseId]: result,
                },
              },
            },
          };
        }),

      isLessonCompleted: (lessonId) =>
        get().lessonProgress[lessonId]?.completed ?? false,

      isModuleCompleted: (moduleId) =>
        get().completedModules.includes(moduleId),

      markModuleComplete: (moduleId) =>
        set((state) => ({
          completedModules: state.completedModules.includes(moduleId)
            ? state.completedModules
            : [...state.completedModules, moduleId],
        })),

      getLessonProgress: (lessonId) => get().lessonProgress[lessonId],

      getCompletedLessonCount: () =>
        Object.values(get().lessonProgress).filter((p) => p.completed).length,

      getCompletedLessonCountForModule: (lessonIds) =>
        lessonIds.filter((id) => get().lessonProgress[id]?.completed).length,

      skipModule: (moduleId) =>
        set((state) => ({
          skippedModules: state.skippedModules.includes(moduleId)
            ? state.skippedModules
            : [...state.skippedModules, moduleId],
        })),

      isModuleSkipped: (moduleId) =>
        get().skippedModules.includes(moduleId),

      reset: () => set({ lessonProgress: {}, completedModules: [], skippedModules: [] }),
    }),
    {
      name: 'ai-tutorial-progress',
    }
  )
);
