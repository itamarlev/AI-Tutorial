'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProfile, XPEvent, UserSettings } from '@/types';
import { calculateLevel } from '@/lib/gamification';

interface UserState {
  profile: UserProfile | null;
  totalXP: number;
  xpHistory: XPEvent[];
  todayXP: number;
  isOnboarded: boolean;

  // Actions
  setProfile: (profile: UserProfile) => void;
  addXP: (event: XPEvent) => void;
  updateSettings: (settings: Partial<UserSettings>) => void;
  getLevel: () => number;
  reset: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      profile: null,
      totalXP: 0,
      xpHistory: [],
      todayXP: 0,
      isOnboarded: false,

      setProfile: (profile) => set({ profile, isOnboarded: true }),

      addXP: (event) => {
        const today = new Date().toDateString();
        const currentTodayXP = get().todayXP;
        const lastEvent = get().xpHistory[get().xpHistory.length - 1];
        const lastEventDay = lastEvent ? new Date(lastEvent.timestamp).toDateString() : '';

        set((state) => ({
          totalXP: state.totalXP + event.amount,
          xpHistory: [...state.xpHistory.slice(-100), event], // Keep last 100 events
          todayXP: lastEventDay === today ? currentTodayXP + event.amount : event.amount,
        }));
      },

      updateSettings: (settings) =>
        set((state) => ({
          profile: state.profile
            ? {
                ...state.profile,
                settings: { ...state.profile.settings, ...settings },
                dailyGoal: settings.dailyGoal ?? state.profile.dailyGoal,
              }
            : null,
        })),

      getLevel: () => calculateLevel(get().totalXP),

      reset: () =>
        set({
          profile: null,
          totalXP: 0,
          xpHistory: [],
          todayXP: 0,
          isOnboarded: false,
        }),
    }),
    {
      name: 'ai-tutorial-user',
    }
  )
);
