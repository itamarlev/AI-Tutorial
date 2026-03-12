'use client';

import { use, useState, useCallback, useEffect } from 'react';
import { getChallengeById } from '@/data/challenges';
import { useChallengeStore } from '@/stores/useChallengeStore';
import { useXP } from '@/hooks/useXP';
import { useTimer } from '@/hooks/useTimer';
import { QuizQuestion } from '@/components/learning/QuizQuestion';
import { PromptExerciseComponent } from '@/components/learning/PromptExercise';
import { CodeCompletionExerciseComponent } from '@/components/learning/CodeCompletionExercise';
import { OrderingExerciseComponent } from '@/components/learning/OrderingExercise';
import { Button } from '@/components/ui/Button';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { ConfettiExplosion } from '@/components/ui/ConfettiExplosion';
import { LevelUpModal } from '@/components/gamification/LevelUpModal';
import { BadgeUnlockModal } from '@/components/gamification/BadgeUnlockModal';
import { getBadgeById } from '@/stores/useBadgeStore';
import { Exercise } from '@/types';
import { ArrowLeft, Clock, Star, Zap, Trophy, Gamepad2 } from 'lucide-react';
import Link from 'next/link';
import { formatDuration } from '@/lib/utils';

export default function ChallengePage({ params }: { params: Promise<{ challengeId: string }> }) {
  const { challengeId } = use(params);
  const challenge = getChallengeById(challengeId);
  const { startChallenge, completeChallenge } = useChallengeStore();
  const { awardXP, levelUpTo, dismissLevelUp, newBadgeId, dismissBadge } = useXP();
  const timer = useTimer(challenge?.timeLimit ?? 300);

  const [phase, setPhase] = useState<'intro' | 'active' | 'complete'>('intro');
  const [currentExIndex, setCurrentExIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [maxScore, setMaxScore] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);

  useEffect(() => {
    if (timer.isExpired && phase === 'active') {
      finishChallenge();
    }
  }, [timer.isExpired, phase]);

  if (!challenge) {
    return <div className="text-center py-20 text-muted">Challenge not found</div>;
  }

  const handleStart = () => {
    startChallenge(challenge.id);
    timer.start();
    setPhase('active');
  };

  const handleExerciseComplete = useCallback((exerciseId: string, xpReward: number) => {
    return (correct: boolean, firstAttempt: boolean) => {
      if (correct) {
        setScore((s) => s + xpReward);
      }
      setMaxScore((s) => s + xpReward);

      // Move to next exercise
      if (currentExIndex < challenge.exercises.length - 1) {
        setTimeout(() => setCurrentExIndex((i) => i + 1), 500);
      } else {
        setTimeout(() => finishChallenge(), 500);
      }
    };
  }, [currentExIndex, challenge.exercises.length]);

  const finishChallenge = () => {
    timer.stop();
    setPhase('complete');

    const timeBonus = timer.progress > 50 ? Math.round(challenge.xpReward * 0.5) : 0;
    const totalXP = Math.round((score / Math.max(maxScore, 1)) * challenge.xpReward) + timeBonus;

    setXpEarned(totalXP);

    completeChallenge({
      challengeId: challenge.id,
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      score,
      maxScore: maxScore || challenge.exercises.reduce((sum, e) => sum + e.xpReward, 0),
      timeUsed: timer.timeUsed,
      xpEarned: totalXP,
    });

    awardXP(totalXP, 'challenge', false, `Challenge: ${challenge.title}`);
  };

  const currentExercise = challenge.exercises[currentExIndex];
  const timerColor = timer.progress > 50 ? '#22c55e' : timer.progress > 25 ? '#f59e0b' : '#ef4444';
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
    <div className="max-w-3xl mx-auto space-y-6">
      <ConfettiExplosion trigger={phase === 'complete'} />

      <Link href="/challenges" className="flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors">
        <ArrowLeft size={16} /> Back to challenges
      </Link>

      {/* Intro */}
      {phase === 'intro' && (
        <div className="text-center py-12">
          <Gamepad2 size={48} className="text-xp mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">{challenge.title}</h1>
          <p className="text-muted mb-4">{challenge.description}</p>
          <div className="flex items-center justify-center gap-6 mb-8 text-sm text-muted">
            <span className="flex items-center gap-1"><Clock size={16} /> {formatDuration(challenge.timeLimit)}</span>
            <span className="flex items-center gap-1"><Zap size={16} /> {challenge.exercises.length} exercises</span>
            <span className="flex items-center gap-1"><Star size={16} className="text-xp" /> {challenge.xpReward} XP</span>
          </div>
          <Button onClick={handleStart} size="lg" className="gap-2">
            <Zap size={18} /> Start Challenge
          </Button>
        </div>
      )}

      {/* Active */}
      {phase === 'active' && currentExercise && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="text-sm text-muted">
              Exercise {currentExIndex + 1} / {challenge.exercises.length}
            </div>
            <ProgressRing value={timer.progress} size={50} strokeWidth={4} color={timerColor}>
              <span className="text-xs font-mono font-bold">{formatDuration(timer.timeLeft)}</span>
            </ProgressRing>
          </div>
          {renderExercise(currentExercise)}
        </div>
      )}

      {/* Complete */}
      {phase === 'complete' && (
        <div className="text-center py-8">
          <Trophy size={48} className="text-legendary mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Challenge Complete!</h1>
          <div className="bg-surface border border-border rounded-xl p-6 max-w-sm mx-auto mb-6 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted">Score</span>
              <span className="font-bold">{score}/{maxScore || '?'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted">Time Used</span>
              <span className="font-bold">{formatDuration(timer.timeUsed)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted">Time Bonus</span>
              <span className="font-bold text-codex-light">{timer.progress > 50 ? 'Yes! (+50%)' : 'No'}</span>
            </div>
            <hr className="border-border" />
            <div className="flex justify-between">
              <span className="text-muted">XP Earned</span>
              <span className="font-bold text-xp flex items-center gap-1"><Star size={14} /> {xpEarned}</span>
            </div>
          </div>
          <div className="flex items-center justify-center gap-3">
            <Link href="/challenges">
              <Button variant="secondary">Back to Challenges</Button>
            </Link>
            <Button onClick={() => { setPhase('intro'); setCurrentExIndex(0); setScore(0); setMaxScore(0); timer.reset(); }}>
              Try Again
            </Button>
          </div>
        </div>
      )}

      <LevelUpModal isOpen={levelUpTo !== null} onClose={dismissLevelUp} level={levelUpTo ?? 0} />
      <BadgeUnlockModal isOpen={newBadge !== null} onClose={dismissBadge} badge={newBadge ?? null} />
    </div>
  );
}

