import { SkipChallenge } from '@/types';

const skipChallenges: SkipChallenge[] = [
  // Claude modules
  {
    moduleId: 'claude-api',
    question: 'What authentication header does the Claude API require?',
    options: [
      { id: 'a', text: 'Authorization: Bearer' },
      { id: 'b', text: 'x-api-key' },
      { id: 'c', text: 'X-Auth-Token' },
      { id: 'd', text: 'Api-Key' },
    ],
    correctOptionId: 'b',
    explanation:
      'The Claude API uses the x-api-key header for authentication, not the more common Bearer token pattern.',
  },
  {
    moduleId: 'claude-prompts',
    question: 'Which technique involves giving Claude a role or persona to improve response quality?',
    options: [
      { id: 'a', text: 'Chain-of-thought prompting' },
      { id: 'b', text: 'Few-shot prompting' },
      { id: 'c', text: 'System prompt role assignment' },
      { id: 'd', text: 'Temperature tuning' },
    ],
    correctOptionId: 'c',
    explanation:
      'Assigning a role in the system prompt (e.g., "You are an expert code reviewer") helps Claude produce more focused and relevant responses.',
  },
  {
    moduleId: 'claude-contexts',
    question: 'What is the main benefit of providing relevant context in your Claude prompts?',
    options: [
      { id: 'a', text: 'It makes responses longer' },
      { id: 'b', text: 'It reduces token usage' },
      { id: 'c', text: 'It helps Claude give more accurate, relevant answers' },
      { id: 'd', text: 'It bypasses rate limits' },
    ],
    correctOptionId: 'c',
    explanation:
      'Providing relevant context — such as code snippets, documentation, or constraints — helps Claude understand your specific situation and produce more accurate responses.',
  },
  {
    moduleId: 'claude-advanced',
    question: 'What does Claude Code\'s /init command do?',
    options: [
      { id: 'a', text: 'Initializes a new Git repository' },
      { id: 'b', text: 'Creates a CLAUDE.md project memory file' },
      { id: 'c', text: 'Installs Claude Code dependencies' },
      { id: 'd', text: 'Resets Claude\'s conversation context' },
    ],
    correctOptionId: 'b',
    explanation:
      'The /init command generates a CLAUDE.md file that serves as persistent project memory, storing conventions, architecture notes, and preferences across sessions.',
  },
  // Cursor modules
  {
    moduleId: 'cursor-features',
    question: 'What shortcut opens Cursor\'s inline edit mode?',
    options: [
      { id: 'a', text: 'Cmd/Ctrl+Shift+P' },
      { id: 'b', text: 'Cmd/Ctrl+K' },
      { id: 'c', text: 'Cmd/Ctrl+L' },
      { id: 'd', text: 'Cmd/Ctrl+I' },
    ],
    correctOptionId: 'b',
    explanation:
      'Cmd/Ctrl+K opens Cursor\'s inline edit mode, allowing you to describe changes to selected code using natural language.',
  },
  {
    moduleId: 'cursor-workflow',
    question: 'What is the purpose of Cursor\'s .cursorrules file?',
    options: [
      { id: 'a', text: 'It stores API keys for AI models' },
      { id: 'b', text: 'It defines project-specific AI instructions and coding conventions' },
      { id: 'c', text: 'It configures keyboard shortcuts' },
      { id: 'd', text: 'It manages Git merge conflicts' },
    ],
    correctOptionId: 'b',
    explanation:
      'The .cursorrules file lets you define project-specific instructions, coding conventions, and context that Cursor\'s AI follows when generating or editing code.',
  },
  {
    moduleId: 'cursor-advanced',
    question: 'How does Cursor\'s Composer feature differ from inline edits?',
    options: [
      { id: 'a', text: 'Composer only works with Python files' },
      { id: 'b', text: 'Composer can make coordinated changes across multiple files' },
      { id: 'c', text: 'Composer is slower but more accurate' },
      { id: 'd', text: 'Composer requires a paid subscription' },
    ],
    correctOptionId: 'b',
    explanation:
      'Composer enables multi-file editing — it can plan and apply coordinated changes across your entire project, unlike inline edits which target a single selection.',
  },
  // Codex modules
  {
    moduleId: 'codex-generation',
    question: 'What is the primary advantage of providing context comments before asking Codex to generate code?',
    options: [
      { id: 'a', text: 'It reduces the cost of API calls' },
      { id: 'b', text: 'It makes the code run faster' },
      { id: 'c', text: 'It guides the model to produce more relevant output' },
      { id: 'd', text: 'It enables syntax highlighting' },
    ],
    correctOptionId: 'c',
    explanation:
      'Context comments act as a guide for Codex, helping it understand your intent and generate code that matches your specific requirements and coding style.',
  },
  {
    moduleId: 'codex-integration',
    question: 'What is the recommended way to integrate Codex into an existing development workflow?',
    options: [
      { id: 'a', text: 'Replace all manual coding with Codex' },
      { id: 'b', text: 'Use Codex as a pair programmer — generate, then review and refine' },
      { id: 'c', text: 'Only use Codex for writing tests' },
      { id: 'd', text: 'Run Codex in a separate environment from your codebase' },
    ],
    correctOptionId: 'b',
    explanation:
      'Codex works best as a pair programmer: let it generate code, then carefully review, test, and refine the output to ensure it meets your quality standards.',
  },
  {
    moduleId: 'codex-advanced',
    question: 'What strategy helps Codex handle complex, multi-step code generation tasks?',
    options: [
      { id: 'a', text: 'Writing the entire prompt in a single line' },
      { id: 'b', text: 'Breaking the task into smaller, sequential prompts' },
      { id: 'c', text: 'Using the highest temperature setting' },
      { id: 'd', text: 'Avoiding any code comments' },
    ],
    correctOptionId: 'b',
    explanation:
      'Breaking complex tasks into smaller, sequential prompts allows Codex to focus on one piece at a time, producing more accurate and maintainable code.',
  },
];

export function getSkipChallenge(moduleId: string): SkipChallenge | undefined {
  return skipChallenges.find((c) => c.moduleId === moduleId);
}
