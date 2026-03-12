'use client';

import { use, useState, useCallback } from 'react';
import { getLessonBySlug, getToolBySlug, getNextLesson, getModuleBySlug } from '@/data';
import { ContentRenderer } from '@/components/learning/ContentRenderer';
import { QuizQuestion } from '@/components/learning/QuizQuestion';
import { PromptExerciseComponent } from '@/components/learning/PromptExercise';
import { CodeCompletionExerciseComponent } from '@/components/learning/CodeCompletionExercise';
import { OrderingExerciseComponent } from '@/components/learning/OrderingExercise';
import { Button } from '@/components/ui/Button';
import { useProgressStore } from '@/stores/useProgressStore';
import { useXP } from '@/hooks/useXP';
import { LevelUpModal } from '@/components/gamification/LevelUpModal';
import { BadgeUnlockModal } from '@/components/gamification/BadgeUnlockModal';
import { getBadgeById } from '@/stores/useBadgeStore';
import { ExerciseResult, Exercise } from '@/types';
import { ArrowLeft, ArrowRight, CheckCircle, Star } from 'lucide-react';
import Link from 'next/link';
import { ConfettiExplosion } from '@/components/ui/ConfettiExplosion';

export default function LessonPage({ params }: { params: Promise<{ toolSlug: string; moduleSlug: string; lessonSlug: string }> }) {
  const { toolSlug, moduleSlug, lessonSlug } = use(params);
  const tool = getToolBySlug(toolSlug);
  const mod = getModuleBySlug(toolSlug, moduleSlug);
  const lesson = getLessonBySlug(toolSlug, moduleSlug, lessonSlug);
  const nextLesson = lesson ? getNextLesson(lesson.id) : undefined;

  const { markLessonComplete, isLessonCompleted, updateExerciseResult } = useProgressStore();
  const { awardXP, levelUpTo, dismissLevelUp, newBadgeId, dismissBadge } = useXP();
  const [exerciseResults, setExerciseResults] = useState<Record<string, ExerciseResult>>({});
  const [showComplete, setShowComplete] = useState(false);

  const isCompleted = lesson ? isLessonCompleted(lesson.id) : false;

  const handleExerciseComplete = useCallback((exerciseId: string, xpReward: number) => {
    return (correct: boolean, firstAttempt: boolean) => {
      if (!lesson) return;
      const result: ExerciseResult = {
        exerciseId,
        completed: true, // Exercise is completed once onComplete fires (even with "good" score)
        score: correct ? 1 : 0.7,
        attempts: (exerciseResults[exerciseId]?.attempts || 0) + 1,
        firstAttemptCorrect: correct && firstAttempt,
      };
      setExerciseResults((prev) => ({ ...prev, [exerciseId]: result }));
      updateExerciseResult(lesson.id, result);

      awardXP(xpReward, 'exercise', correct && firstAttempt, `Exercise: ${exerciseId}`);
    };
  }, [lesson, exerciseResults, updateExerciseResult, awardXP]);

  const handleCompleteLesson = () => {
    if (!lesson || isCompleted) return;
    markLessonComplete(lesson.id, exerciseResults);
    awardXP(lesson.xpReward, 'lesson', false, `Lesson: ${lesson.title}`);
    setShowComplete(true);

    // Check if module is complete
    if (mod) {
      const { markModuleComplete, getCompletedLessonCountForModule } = useProgressStore.getState();
      const lessonIds = mod.lessons.map((l) => l.id);
      const completedCount = getCompletedLessonCountForModule(lessonIds);
      if (completedCount + 1 >= lessonIds.length) {
        markModuleComplete(mod.id);
      }
    }
  };

  if (!lesson || !tool) {
    return <div className="text-center py-20 text-muted">Lesson not found</div>;
  }

  const allExercisesAttempted = lesson.exercises.length === 0 || lesson.exercises.every(
    (ex) => exerciseResults[ex.id]?.completed
  );

  const newBadge = newBadgeId ? getBadgeById(newBadgeId) : null;

  const renderExercise = (exercise: Exercise) => {
    switch (exercise.type) {
      case 'multiple_choice':
        return <QuizQuestion key={exercise.id} exercise={exercise} onComplete={handleExerciseComplete(exercise.id, exercise.xpReward)} />;
      case 'prompt':
        return <PromptExerciseComponent key={exercise.id} exercise={exercise} onComplete={handleExerciseComplete(exercise.id, exercise.xpReward)} />;
      case 'code_completion':
        return <CodeCompletionExerciseComponent key={exercise.id} exercise={exercise} onComplete={handleExerciseComplete(exercise.id, exercise.xpReward)} />;
      case 'ordering':
        return <OrderingExerciseComponent key={exercise.id} exercise={exercise} onComplete={handleExerciseComplete(exercise.id, exercise.xpReward)} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <ConfettiExplosion trigger={showComplete} />

      <Link href={`/learn/${toolSlug}/${moduleSlug}`} className="flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors">
        <ArrowLeft size={16} /> Back to {mod?.title || 'module'}
      </Link>

      {/* Lesson Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium" style={{ color: tool.accentColor }}>{tool.name}</span>
          <span className="text-muted text-sm">/</span>
          <span className="text-sm text-muted">{mod?.title}</span>
        </div>
        <h1 className="text-2xl font-bold">{lesson.title}</h1>
        <div className="flex items-center gap-4 mt-2 text-sm text-muted">
          <span className="flex items-center gap-1"><Star size={14} className="text-xp" /> {lesson.xpReward} XP</span>
          <span>{lesson.estimatedMinutes} min</span>
          {isCompleted && <span className="flex items-center gap-1 text-codex-light"><CheckCircle size={14} /> Completed</span>}
        </div>
      </div>

      {/* Content */}
      <ContentRenderer blocks={lesson.content} />

      {/* Exercises */}
      {lesson.exercises.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold">Exercises</h2>
          {lesson.exercises.map(renderExercise)}
        </div>
      )}

      {/* Complete Button */}
      {!isCompleted && !showComplete && (
        <div className="flex justify-center pt-4">
          <Button
            onClick={handleCompleteLesson}
            disabled={!allExercisesAttempted}
            size="lg"
            className="gap-2"
          >
            <CheckCircle size={18} />
            {allExercisesAttempted ? 'Complete Lesson' : 'Complete all exercises first'}
          </Button>
        </div>
      )}

      {/* Completion / Next */}
      {(isCompleted || showComplete) && (
        <div className="bg-codex/5 border border-codex/20 rounded-xl p-6 text-center">
          <CheckCircle size={40} className="text-codex-light mx-auto mb-3" />
          <h2 className="text-xl font-bold mb-1">Lesson Complete!</h2>
          <p className="text-sm text-muted mb-4">You earned {lesson.xpReward} XP</p>
          {nextLesson ? (
            <Link href={`/learn/${nextLesson.toolSlug}/${nextLesson.moduleSlug}/${nextLesson.slug}`}>
              <Button className="gap-2">
                Next Lesson <ArrowRight size={16} />
              </Button>
            </Link>
          ) : (
            <Link href={`/learn/${toolSlug}`}>
              <Button variant="secondary" className="gap-2">
                Back to {tool.name}
              </Button>
            </Link>
          )}
        </div>
      )}

      {/* Modals */}
      <LevelUpModal isOpen={levelUpTo !== null} onClose={dismissLevelUp} level={levelUpTo ?? 0} />
      <BadgeUnlockModal isOpen={newBadge !== null} onClose={dismissBadge} badge={newBadge ?? null} />
    </div>
  );
}
