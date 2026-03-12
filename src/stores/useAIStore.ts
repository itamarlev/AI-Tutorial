'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AIToolConfig, AIToolSlug, AIConnectionSettings } from '@/types';

const DEFAULT_CONFIGS: AIConnectionSettings = {
  claude: {
    enabled: false,
    command: 'claude',
    args: ['-p'],
    inputMode: 'pipe',
    available: false,
  },
  cursor: {
    enabled: false,
    command: 'cursor-agent',
    args: ['-p', '--trust'],
    inputMode: 'pipe',
    available: false,
  },
  codex: {
    enabled: false,
    command: 'codex',
    args: ['exec'],
    inputMode: 'arg',
    available: false,
  },
};

interface AIStore {
  tools: AIConnectionSettings;
  lastHealthCheck: string | null;

  // Actions
  setToolEnabled: (tool: AIToolSlug, enabled: boolean) => void;
  setToolConfig: (tool: AIToolSlug, config: Partial<AIToolConfig>) => void;
  updateAvailability: (tool: AIToolSlug, available: boolean) => void;
  updateAllAvailability: (availability: Record<AIToolSlug, boolean>, autoEnable?: boolean) => void;
  getToolConfig: (tool: AIToolSlug) => AIToolConfig;
  isToolReady: (tool: AIToolSlug) => boolean;
  reset: () => void;
}

export const useAIStore = create<AIStore>()(
  persist(
    (set, get) => ({
      tools: DEFAULT_CONFIGS,
      lastHealthCheck: null,

      setToolEnabled: (tool, enabled) => {
        set((state) => ({
          tools: {
            ...state.tools,
            [tool]: { ...state.tools[tool], enabled },
          },
        }));
      },

      setToolConfig: (tool, config) => {
        set((state) => ({
          tools: {
            ...state.tools,
            [tool]: { ...state.tools[tool], ...config },
          },
        }));
      },

      updateAvailability: (tool, available) => {
        set((state) => ({
          tools: {
            ...state.tools,
            [tool]: { ...state.tools[tool], available },
          },
          lastHealthCheck: new Date().toISOString(),
        }));
      },

      updateAllAvailability: (availability, autoEnable = true) => {
        set((state) => ({
          tools: {
            claude: {
              ...state.tools.claude,
              available: availability.claude,
              enabled: autoEnable && availability.claude ? true : state.tools.claude.enabled,
            },
            cursor: {
              ...state.tools.cursor,
              available: availability.cursor,
              enabled: autoEnable && availability.cursor ? true : state.tools.cursor.enabled,
            },
            codex: {
              ...state.tools.codex,
              available: availability.codex,
              enabled: autoEnable && availability.codex ? true : state.tools.codex.enabled,
            },
          },
          lastHealthCheck: new Date().toISOString(),
        }));
      },

      getToolConfig: (tool) => {
        return get().tools[tool];
      },

      isToolReady: (tool) => {
        const config = get().tools[tool];
        return config.enabled && config.available;
      },

      reset: () => {
        set({
          tools: DEFAULT_CONFIGS,
          lastHealthCheck: null,
        });
      },
    }),
    {
      name: 'ai-tutorial-ai',
      version: 1,
      partialize: (state) => ({
        tools: {
          claude: {
            enabled: state.tools.claude.enabled,
            command: state.tools.claude.command,
            args: state.tools.claude.args,
            inputMode: state.tools.claude.inputMode,
            available: false,
          },
          cursor: {
            enabled: state.tools.cursor.enabled,
            command: state.tools.cursor.command,
            args: state.tools.cursor.args,
            inputMode: state.tools.cursor.inputMode,
            available: false,
          },
          codex: {
            enabled: state.tools.codex.enabled,
            command: state.tools.codex.command,
            args: state.tools.codex.args,
            inputMode: state.tools.codex.inputMode,
            available: false,
          },
        },
      }),
      // Migrate from v0 (no inputMode, wrong args) to v1
      migrate: (persistedState: unknown) => {
        const state = persistedState as Record<string, unknown>;
        const tools = (state.tools || {}) as Record<string, Record<string, unknown>>;

        // Apply correct defaults for any tool missing inputMode
        const migrated = {
          ...state,
          tools: {
            claude: {
              ...DEFAULT_CONFIGS.claude,
              ...tools.claude,
              inputMode: tools.claude?.inputMode || 'pipe',
              args: tools.claude?.inputMode ? tools.claude.args : ['-p'],
            },
            cursor: {
              ...DEFAULT_CONFIGS.cursor,
              ...tools.cursor,
              inputMode: tools.cursor?.inputMode || 'pipe',
              args: tools.cursor?.inputMode ? tools.cursor.args : ['-p', '--trust'],
            },
            codex: {
              ...DEFAULT_CONFIGS.codex,
              ...tools.codex,
              inputMode: tools.codex?.inputMode || 'arg',
              args: tools.codex?.inputMode ? tools.codex.args : ['exec'],
            },
          },
        };
        return migrated;
      },
    }
  )
);
