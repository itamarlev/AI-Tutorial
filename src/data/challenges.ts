import { Challenge } from '@/types';

export const challenges: Challenge[] = [
  {
    id: 'challenge-easy-1',
    title: 'Prompt Basics',
    description: 'Test your knowledge of basic prompting techniques.',
    difficulty: 'easy',
    timeLimit: 180,
    xpReward: 75,
    exercises: [
      {
        type: 'multiple_choice', id: 'ch-e1-1', title: 'Prompt Components', question: 'What is the most important element of an effective prompt?',
        xpReward: 15,
        options: [
          { id: 'a', text: 'Using formal language' },
          { id: 'b', text: 'Being specific about what you need' },
          { id: 'c', text: 'Making it as short as possible' },
          { id: 'd', text: 'Including emojis' },
        ],
        correctOptionId: 'b', explanation: 'Specificity is the most important element — tell the AI exactly what you need.',
      },
      {
        type: 'multiple_choice', id: 'ch-e1-2', title: 'System Prompts', question: 'What is the purpose of a system prompt?',
        xpReward: 15,
        options: [
          { id: 'a', text: 'To greet the user' },
          { id: 'b', text: 'To set the AI\'s behavior and persona consistently' },
          { id: 'c', text: 'To configure API rate limits' },
          { id: 'd', text: 'To store conversation history' },
        ],
        correctOptionId: 'b', explanation: 'System prompts define how the AI should behave across all interactions.',
      },
      {
        type: 'prompt', id: 'ch-e1-3', title: 'Quick Prompt', description: 'Write a prompt asking an AI to explain a concept simply.',
        xpReward: 20,
        criteria: [
          { id: 'c1', label: 'Names a concept', keywords: ['explain', 'what is', 'describe', 'tell me'], weight: 1 },
          { id: 'c2', label: 'Asks for simplicity', keywords: ['simple', 'beginner', 'easy', 'basic', 'plain', 'like I\'m'], weight: 1 },
        ],
        hints: ['Ask about a specific concept', 'Request a simple explanation'],
        responses: {
          excellent: 'Great prompt! It\'s specific and requests the right level of explanation.',
          good: 'Good prompt! Consider specifying the audience level.',
          needsWork: 'Be more specific about what concept and how simply you want it explained.',
        },
      },
    ],
  },
  {
    id: 'challenge-easy-2',
    title: 'Tool Knowledge',
    description: 'Test your knowledge of AI developer tools.',
    difficulty: 'easy',
    timeLimit: 180,
    xpReward: 75,
    exercises: [
      {
        type: 'multiple_choice', id: 'ch-e2-1', title: 'Claude Code', question: 'What is the best way to start Claude Code?',
        xpReward: 15,
        options: [
          { id: 'a', text: 'Double-click the desktop icon' },
          { id: 'b', text: 'Navigate to your project and run "claude"' },
          { id: 'c', text: 'Open it from the system tray' },
          { id: 'd', text: 'It starts automatically' },
        ],
        correctOptionId: 'b', explanation: 'Claude Code is a CLI tool — navigate to your project and run "claude" in the terminal.',
      },
      {
        type: 'multiple_choice', id: 'ch-e2-2', title: 'Cursor', question: 'What keyboard shortcut opens Cursor Composer?',
        xpReward: 15,
        options: [
          { id: 'a', text: 'Cmd/Ctrl+L' },
          { id: 'b', text: 'Cmd/Ctrl+K' },
          { id: 'c', text: 'Cmd/Ctrl+I' },
          { id: 'd', text: 'Cmd/Ctrl+P' },
        ],
        correctOptionId: 'c', explanation: 'Cmd/Ctrl+I opens Cursor Composer for multi-file editing.',
      },
      {
        type: 'multiple_choice', id: 'ch-e2-3', title: 'Codex', question: 'What temperature setting is recommended for code generation?',
        xpReward: 20,
        options: [
          { id: 'a', text: '0.9-1.0 (very high)' },
          { id: 'b', text: '0.5 (medium)' },
          { id: 'c', text: '0.1-0.3 (low)' },
          { id: 'd', text: 'Temperature doesn\'t matter' },
        ],
        correctOptionId: 'c', explanation: 'Low temperature (0.1-0.3) produces more consistent and deterministic code generation.',
      },
    ],
  },
  {
    id: 'challenge-medium-1',
    title: 'Prompt Engineering',
    description: 'Apply prompt engineering techniques under pressure.',
    difficulty: 'medium',
    timeLimit: 300,
    xpReward: 125,
    exercises: [
      {
        type: 'prompt', id: 'ch-m1-1', title: 'Chain of Thought', description: 'Write a prompt that uses chain-of-thought to debug a function.',
        xpReward: 30,
        criteria: [
          { id: 'c1', label: 'Step-by-step', keywords: ['step by step', 'first', 'then', 'analyze', 'think through'], weight: 1 },
          { id: 'c2', label: 'About debugging', keywords: ['debug', 'bug', 'error', 'fix', 'issue', 'problem'], weight: 1 },
          { id: 'c3', label: 'Structured', keywords: ['check', 'verify', 'look for', 'identify', 'trace'], weight: 0.5 },
        ],
        hints: ['Use "step by step" or numbered steps', 'Be specific about what to debug'],
        responses: {
          excellent: 'Excellent use of chain-of-thought! This would produce thorough, methodical debugging.',
          good: 'Good prompt! Add more specific steps for the analysis.',
          needsWork: 'Add step-by-step instructions for debugging.',
        },
      },
      {
        type: 'prompt', id: 'ch-m1-2', title: 'Few-Shot Prompt', description: 'Write a few-shot prompt with examples for code refactoring.',
        xpReward: 35,
        criteria: [
          { id: 'c1', label: 'Has examples', keywords: ['example', 'input', 'output', 'before', 'after', 'like this'], weight: 1 },
          { id: 'c2', label: 'About refactoring', keywords: ['refactor', 'improve', 'clean', 'rewrite', 'better'], weight: 1 },
          { id: 'c3', label: 'Pattern is clear', keywords: ['pattern', 'following', 'same way', 'similarly', 'format'], weight: 0.5 },
        ],
        hints: ['Provide at least one before/after example', 'Make the pattern clear'],
        responses: {
          excellent: 'Great few-shot prompt! The examples clearly teach the refactoring pattern.',
          good: 'Good start! Consider adding a second example to reinforce the pattern.',
          needsWork: 'Include at least one before/after example of the refactoring you want.',
        },
      },
      {
        type: 'multiple_choice', id: 'ch-m1-3', title: 'Temperature', question: 'For creative brainstorming of feature ideas, which temperature is best?',
        xpReward: 15,
        options: [
          { id: 'a', text: '0.0 - Deterministic' },
          { id: 'b', text: '0.3 - Slightly creative' },
          { id: 'c', text: '0.7-0.9 - High creativity' },
          { id: 'd', text: '2.0 - Maximum randomness' },
        ],
        correctOptionId: 'c', explanation: 'For creative tasks, higher temperature (0.7-0.9) produces more varied and creative outputs.',
      },
    ],
  },
  {
    id: 'challenge-medium-2',
    title: 'API Mastery',
    description: 'Test your knowledge of AI APIs and integration.',
    difficulty: 'medium',
    timeLimit: 300,
    xpReward: 125,
    exercises: [
      {
        type: 'code_completion', id: 'ch-m2-1', title: 'API Call', description: 'Complete the Claude API call.',
        xpReward: 25, language: 'typescript',
        codeTemplate: 'const response = await client.___BLANK_1___.create({\n  model: "claude-sonnet-4-5-20250929",\n  ___BLANK_2___: 1024,\n  messages: [{ role: "user", content: prompt }],\n});',
        blanks: [
          { id: 'BLANK_1', answer: 'messages', hint: 'The API resource for conversations' },
          { id: 'BLANK_2', answer: 'max_tokens', hint: 'Parameter controlling response length' },
        ],
      },
      {
        type: 'multiple_choice', id: 'ch-m2-2', title: 'Streaming', question: 'What event type contains the actual text in a streaming response?',
        xpReward: 20,
        options: [
          { id: 'a', text: 'message_start' },
          { id: 'b', text: 'content_block_delta' },
          { id: 'c', text: 'message_stop' },
          { id: 'd', text: 'ping' },
        ],
        correctOptionId: 'b', explanation: 'content_block_delta events contain the actual text chunks in streaming responses.',
      },
      {
        type: 'prompt', id: 'ch-m2-3', title: 'System Prompt Design',
        description: 'Design a system prompt for an AI code review service.',
        xpReward: 30,
        criteria: [
          { id: 'c1', label: 'Defines role', keywords: ['you are', 'act as', 'code reviewer', 'expert'], weight: 1 },
          { id: 'c2', label: 'Has guidelines', keywords: ['check', 'focus', 'look for', 'security', 'bug', 'performance'], weight: 1 },
          { id: 'c3', label: 'Output format', keywords: ['format', 'severity', 'list', 'critical', 'suggestion'], weight: 0.5 },
        ],
        hints: ['Define the reviewer persona', 'List what to check for', 'Specify the output format'],
        responses: {
          excellent: 'Excellent system prompt for a code review service!',
          good: 'Good prompt! Add output format specifications.',
          needsWork: 'Include a clear role, review guidelines, and output format.',
        },
      },
    ],
  },
  {
    id: 'challenge-hard-1',
    title: 'Full Stack AI',
    description: 'Advanced challenge combining all AI tool skills.',
    difficulty: 'hard',
    timeLimit: 420,
    xpReward: 200,
    exercises: [
      {
        type: 'prompt', id: 'ch-h1-1', title: 'Architecture Prompt',
        description: 'Write a detailed prompt asking Claude to design a microservices architecture for an e-commerce platform. Include all 5 prompt components.',
        xpReward: 40,
        criteria: [
          { id: 'c1', label: 'Role definition', keywords: ['you are', 'architect', 'senior', 'expert', 'role'], weight: 1 },
          { id: 'c2', label: 'Specific task', keywords: ['microservice', 'architecture', 'design', 'e-commerce', 'platform'], weight: 1 },
          { id: 'c3', label: 'Constraints/specifics', keywords: ['scale', 'service', 'api', 'database', 'queue', 'cache', 'authentication'], weight: 0.5 },
          { id: 'c4', label: 'Output format', keywords: ['diagram', 'list', 'explain', 'document', 'format'], weight: 0.5 },
          { id: 'c5', label: 'Examples or references', keywords: ['example', 'similar to', 'like', 'pattern', 'aws', 'cloud'], weight: 0.5 },
        ],
        hints: ['Include all 5 prompt components', 'Be specific about the e-commerce requirements', 'Define the output format'],
        responses: {
          excellent: 'Outstanding architecture prompt! All 5 components present with excellent specificity.',
          good: 'Good prompt! Consider adding more specifics about scale and output format.',
          needsWork: 'Include all 5 prompt components: role, task, specifics, format, examples.',
        },
      },
      {
        type: 'prompt', id: 'ch-h1-2', title: 'Multi-Tool Workflow',
        description: 'Describe a development workflow that uses Claude, Cursor, and Codex together for building a new feature.',
        xpReward: 40,
        criteria: [
          { id: 'c1', label: 'Mentions Claude', keywords: ['claude', 'anthropic', 'api', 'cli'], weight: 1 },
          { id: 'c2', label: 'Mentions Cursor', keywords: ['cursor', 'composer', 'chat', 'editor', 'ide'], weight: 1 },
          { id: 'c3', label: 'Mentions Codex/Copilot', keywords: ['codex', 'copilot', 'completion', 'suggestion', 'github'], weight: 1 },
          { id: 'c4', label: 'Describes a workflow', keywords: ['first', 'then', 'step', 'workflow', 'process', 'start', 'next'], weight: 0.5 },
        ],
        hints: ['Describe when you would use each tool', 'Create a step-by-step workflow', 'Show how the tools complement each other'],
        responses: {
          excellent: 'Brilliant workflow design! You\'ve shown how these tools complement each other perfectly.',
          good: 'Good workflow! Consider being more specific about when to switch between tools.',
          needsWork: 'Describe a workflow using all three tools: Claude, Cursor, and Codex/Copilot.',
        },
      },
      {
        type: 'code_completion', id: 'ch-h1-3', title: 'Tool Integration',
        description: 'Complete this Claude API tool use implementation.',
        xpReward: 30, language: 'typescript',
        codeTemplate: 'const response = await client.messages.create({\n  model: "claude-sonnet-4-5-20250929",\n  max_tokens: 1024,\n  ___BLANK_1___: [{\n    name: "search_code",\n    ___BLANK_2___: "Search the codebase for relevant files",\n    input_schema: {\n      type: "___BLANK_3___",\n      properties: { query: { type: "string" } },\n      required: ["query"],\n    },\n  }],\n  messages: [{ role: "user", content: "Find all auth-related files" }],\n});',
        blanks: [
          { id: 'BLANK_1', answer: 'tools', hint: 'The parameter for defining available tools' },
          { id: 'BLANK_2', answer: 'description', hint: 'Describes what the tool does' },
          { id: 'BLANK_3', answer: 'object', hint: 'JSON Schema type for the input' },
        ],
      },
    ],
  },
  {
    id: 'challenge-hard-2',
    title: 'Prompt Engineering Master',
    description: 'The ultimate prompt engineering challenge.',
    difficulty: 'hard',
    timeLimit: 420,
    xpReward: 200,
    exercises: [
      {
        type: 'prompt', id: 'ch-h2-1', title: 'Complex System Prompt',
        description: 'Design a comprehensive system prompt for an AI coding assistant that reviews code, suggests improvements, and generates tests — all in one interaction.',
        xpReward: 45,
        criteria: [
          { id: 'c1', label: 'Multi-capability role', keywords: ['review', 'suggest', 'test', 'improve', 'generate'], weight: 1 },
          { id: 'c2', label: 'Clear structure', keywords: ['first', 'then', 'section', 'step', 'format', 'output'], weight: 1 },
          { id: 'c3', label: 'Quality standards', keywords: ['security', 'performance', 'best practice', 'clean', 'maintain'], weight: 0.5 },
          { id: 'c4', label: 'Boundaries', keywords: ['do not', 'only', 'focus', 'avoid', 'limit', 'never'], weight: 0.5 },
        ],
        hints: ['Define a multi-capable role', 'Structure the output in clear sections', 'Set quality standards and boundaries'],
        responses: {
          excellent: 'Masterful system prompt! It handles multiple capabilities while maintaining structure and quality.',
          good: 'Good multi-capability prompt! Consider adding clearer output structure.',
          needsWork: 'Define all three capabilities (review, suggest, test) with clear structure.',
        },
      },
      {
        type: 'prompt', id: 'ch-h2-2', title: 'XML-Structured Prompt',
        description: 'Write a prompt using XML tags to structure a complex code migration task from JavaScript to TypeScript.',
        xpReward: 45,
        criteria: [
          { id: 'c1', label: 'Uses XML tags', keywords: ['<', '>', 'context', 'task', 'code', 'output', 'constraints'], weight: 1 },
          { id: 'c2', label: 'About migration', keywords: ['migrate', 'convert', 'javascript', 'typescript', 'migration', 'transform'], weight: 1 },
          { id: 'c3', label: 'Detailed requirements', keywords: ['type', 'interface', 'strict', 'any', 'import', 'export'], weight: 0.5 },
        ],
        hints: ['Use XML tags like <context>, <task>, <code>, <output_format>', 'Be specific about the JS to TS migration', 'Include TypeScript-specific requirements'],
        responses: {
          excellent: 'Expert-level prompt! XML tags provide excellent structure for complex migration tasks.',
          good: 'Good use of XML structure! Add more specific TypeScript migration requirements.',
          needsWork: 'Use XML tags to structure different sections of your prompt.',
        },
      },
    ],
  },
];

export function getChallengeById(id: string): Challenge | undefined {
  return challenges.find((c) => c.id === id);
}

export function getChallengesByDifficulty(difficulty: string): Challenge[] {
  return challenges.filter((c) => c.difficulty === difficulty);
}
