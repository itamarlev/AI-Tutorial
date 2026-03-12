// ==================== User Types ====================
export interface UserProfile {
  id: string;
  username: string;
  avatar: string;
  createdAt: string;
  dailyGoal: number; // XP per day
  settings: UserSettings;
}

export interface UserSettings {
  soundEnabled: boolean;
  animationsEnabled: boolean;
  dailyGoal: number;
}

export interface XPEvent {
  amount: number;
  source: XPSource;
  timestamp: string;
  multiplier: number;
  details?: string;
}

export type XPSource = 'lesson' | 'exercise' | 'challenge' | 'daily_goal' | 'bonus';

// ==================== Content Types ====================
export interface Tool {
  id: string;
  slug: string;
  name: string;
  description: string;
  color: string;
  accentColor: string;
  icon: string;
  modules: Module[];
}

export interface Module {
  id: string;
  slug: string;
  toolSlug: string;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
  prerequisites: string[]; // module IDs
}

export interface Lesson {
  id: string;
  slug: string;
  moduleSlug: string;
  toolSlug: string;
  title: string;
  description: string;
  order: number;
  xpReward: number;
  estimatedMinutes: number;
  content: ContentBlock[];
  exercises: Exercise[];
}

export type ContentBlock =
  | { type: 'markdown'; content: string }
  | { type: 'code'; language: string; code: string; filename?: string }
  | { type: 'callout'; variant: 'info' | 'tip' | 'warning' | 'success'; content: string }
  | { type: 'image'; src: string; alt: string; caption?: string };

// ==================== Exercise Types ====================
export type Exercise =
  | PromptExercise
  | MultipleChoiceExercise
  | CodeCompletionExercise
  | OrderingExercise;

export interface PromptExercise {
  type: 'prompt';
  id: string;
  title: string;
  description: string;
  context?: string;
  xpReward: number;
  criteria: PromptCriteria[];
  hints: string[];
  responses: {
    excellent: string;
    good: string;
    needsWork: string;
  };
}

export interface PromptCriteria {
  id: string;
  label: string;
  keywords?: string[];
  patterns?: string[];
  weight: number;
}

export interface MultipleChoiceExercise {
  type: 'multiple_choice';
  id: string;
  title: string;
  question: string;
  xpReward: number;
  options: { id: string; text: string }[];
  correctOptionId: string;
  explanation: string;
}

export interface CodeCompletionExercise {
  type: 'code_completion';
  id: string;
  title: string;
  description: string;
  xpReward: number;
  language: string;
  codeTemplate: string; // uses ___BLANK___ placeholders
  blanks: {
    id: string;
    answer: string;
    alternatives?: string[];
    hint?: string;
  }[];
}

export interface OrderingExercise {
  type: 'ordering';
  id: string;
  title: string;
  description: string;
  xpReward: number;
  items: { id: string; text: string }[];
  correctOrder: string[]; // item IDs in correct order
}

// ==================== Gamification Types ====================
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: BadgeCategory;
  rarity: BadgeRarity;
  condition: BadgeCondition;
}

export type BadgeCategory = 'learning' | 'streak' | 'challenge' | 'exploration' | 'mastery';
export type BadgeRarity = 'common' | 'rare' | 'epic' | 'legendary';

export type BadgeCondition =
  | { type: 'lessons_completed'; count: number }
  | { type: 'streak_days'; count: number }
  | { type: 'challenges_completed'; count: number }
  | { type: 'challenge_fast'; challengeDifficulty: ChallengeDifficulty; timeRemainingPercent: number }
  | { type: 'xp_total'; amount: number }
  | { type: 'level_reached'; level: number }
  | { type: 'tool_completed'; toolSlug: string }
  | { type: 'all_tools_completed' }
  | { type: 'module_completed'; moduleId: string }
  | { type: 'perfect_lesson'; count: number }
  | { type: 'night_owl' }
  | { type: 'early_bird' }
  | { type: 'first_lesson' }
  | { type: 'first_challenge' };

export interface UnlockedBadge {
  badgeId: string;
  unlockedAt: string;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null;
  streakFreezes: number;
}

export const LEVEL_TITLES: Record<number, string> = {
  0: 'Novice Prompter',
  5: 'Apprentice Developer',
  10: 'AI Practitioner',
  20: 'Prompt Engineer',
  30: 'AI Architect',
  40: 'Code Whisperer',
  50: 'AI Virtuoso',
  75: 'Grandmaster',
};

// ==================== Skip Challenge Types ====================
export interface SkipChallenge {
  moduleId: string;
  question: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
  explanation: string;
}

// ==================== Challenge Types ====================
export type ChallengeDifficulty = 'easy' | 'medium' | 'hard';

export interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: ChallengeDifficulty;
  timeLimit: number; // seconds
  xpReward: number;
  exercises: Exercise[];
  toolSlug?: string;
}

export interface ChallengeAttempt {
  challengeId: string;
  startedAt: string;
  completedAt?: string;
  score: number;
  maxScore: number;
  timeUsed: number;
  xpEarned: number;
}

// ==================== Skill Tree Types ====================
export interface SkillTreeNode {
  id: string;
  moduleId: string;
  x: number;
  y: number;
  connections: string[]; // node IDs this connects to
}

export interface SkillTree {
  toolSlug: string;
  nodes: SkillTreeNode[];
}

// ==================== Progress Types ====================
export interface LessonProgress {
  lessonId: string;
  completed: boolean;
  completedAt?: string;
  exerciseResults: Record<string, ExerciseResult>;
  perfectScore: boolean;
}

export interface ExerciseResult {
  exerciseId: string;
  completed: boolean;
  score: number;
  attempts: number;
  firstAttemptCorrect: boolean;
}

export interface ModuleProgress {
  moduleId: string;
  lessonsCompleted: number;
  totalLessons: number;
  completed: boolean;
}

// ==================== AI Connection Types ====================
export type AIToolSlug = 'claude' | 'cursor' | 'codex';

/**
 * How the prompt is delivered to the CLI:
 * - 'pipe': prompt is written to stdin (e.g. echo "prompt" | claude -p)
 * - 'arg': prompt is appended as a positional argument (e.g. codex exec "prompt")
 */
export type AIInputMode = 'pipe' | 'arg';

export interface AIToolConfig {
  enabled: boolean;
  command: string;
  args: string[];
  inputMode: AIInputMode;
  available: boolean;
}

export interface AIConnectionSettings {
  claude: AIToolConfig;
  cursor: AIToolConfig;
  codex: AIToolConfig;
}
