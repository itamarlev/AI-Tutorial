'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ChallengeAttempt } from '@/types';

interface ChallengeState {
  attempts: ChallengeAttempt[];
  activeChallengeId: string | null;
  activeStartTime: string | null;

  // Actions
  startChallenge: (challengeId: string) => void;
  completeChallenge: (attempt: ChallengeAttempt) => void;
  cancelChallenge: () => void;
  getBestAttempt: (challengeId: string) => ChallengeAttempt | undefined;
  getChallengesCompletedCount: () => number;
  reset: () => void;
}

export const useChallengeStore = create<ChallengeState>()(
  persist(
    (set, get) => ({
      attempts: [],
      activeChallengeId: null,
      activeStartTime: null,

      startChallenge: (challengeId) =>
        set({
          activeChallengeId: challengeId,
          activeStartTime: new Date().toISOString(),
        }),

      completeChallenge: (attempt) =>
        set((state) => ({
          attempts: [...state.attempts, attempt],
          activeChallengeId: null,
          activeStartTime: null,
        })),

      cancelChallenge: () =>
        set({
          activeChallengeId: null,
          activeStartTime: null,
        }),

      getBestAttempt: (challengeId) => {
        const challengeAttempts = get().attempts.filter(
          (a) => a.challengeId === challengeId
        );
        if (challengeAttempts.length === 0) return undefined;
        return challengeAttempts.reduce((best, current) =>
          current.score > best.score ? current : best
        );
      },

      getChallengesCompletedCount: () => {
        const uniqueChallenges = new Set(get().attempts.map((a) => a.challengeId));
        return uniqueChallenges.size;
      },

      reset: () =>
        set({
          attempts: [],
          activeChallengeId: null,
          activeStartTime: null,
        }),
    }),
    {
      name: 'ai-tutorial-challenges',
    }
  )
);
