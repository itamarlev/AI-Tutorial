# Contributing to AI Tutorial

First off, thank you for considering contributing to AI Tutorial! It's people like you that make this project such a great tool for learning.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Workflow](#development-workflow)
- [Content Guidelines](#content-guidelines)
- [Style Guide](#style-guide)
- [Commit Messages](#commit-messages)

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/ai-tutorial.git
   cd ai-tutorial
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Create a branch** for your work:
   ```bash
   git checkout -b feature/my-new-feature
   ```
5. **Make your changes** and test them
6. **Push to your fork** and submit a pull request

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce** the problem
- **Expected vs actual behavior**
- **Screenshots** if applicable
- **Browser and OS** information

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Clear title and description**
- **Detailed explanation** of the feature
- **Examples** of how it would work
- **Mockups** if applicable

### Adding Content

We welcome contributions to the learning content!

#### Adding Lessons

1. Choose the appropriate tool directory: `src/data/modules/claude/`, `cursor/`, or `codex/`
2. Find or create the module file
3. Add your lesson to the `lessons` array:

```typescript
{
  id: 'unique-lesson-id',
  title: 'Lesson Title',
  description: 'Brief description of what students will learn',
  xpReward: 50, // 25-100 XP based on complexity
  estimatedMinutes: 10, // Realistic time estimate
  content: [
    // Mix of content blocks
    { type: 'markdown', content: '# Introduction\n\nExplain the concept...' },
    { type: 'code', language: 'typescript', code: 'const example = true;', filename: 'example.ts' },
    { type: 'callout', variant: 'tip', content: 'Pro tip: Always do X before Y' },
  ],
  exercises: [
    // Mix of exercise types
    {
      id: 'ex1',
      type: 'multiple_choice',
      question: 'What is the correct answer?',
      options: [
        { id: 'a', text: 'Option A' },
        { id: 'b', text: 'Option B' },
        { id: 'c', text: 'Option C' },
      ],
      correctAnswer: 'b',
      explanation: 'B is correct because...',
    },
  ],
}
```

#### Adding Badges

Edit `src/data/badges.ts`:

```typescript
{
  id: 'unique-badge-id',
  name: 'Badge Name',
  description: 'How to unlock this badge',
  category: 'learning', // learning, streak, challenge, exploration, mastery
  rarity: 'rare', // common, rare, epic, legendary
  condition: { type: 'lessons_completed', value: 25 }, // See types/index.ts for all condition types
}
```

#### Adding Challenges

Edit `src/data/challenges.ts`:

```typescript
{
  id: 'unique-challenge-id',
  title: 'Challenge Name',
  description: 'Test your skills by...',
  difficulty: 'medium', // easy, medium, hard
  timeLimitMinutes: 10,
  xpReward: 200,
  exercises: [ /* same format as lesson exercises */ ],
}
```

### Pull Requests

1. **Follow the style guide** (ESLint, Prettier)
2. **Write clear commit messages**
3. **Update documentation** if needed
4. **Add tests** for new features
5. **Ensure all tests pass**: `npm run lint`
6. **Generate screenshots** if UI changed: `npm run screenshot`

## Development Workflow

### Running Locally

```bash
npm run dev          # Start dev server
npm run build        # Test production build
npm run lint         # Check code style
npm run screenshot   # Generate screenshots
```

### File Structure

```
src/
├── app/              # Pages (Next.js App Router)
├── components/       # React components
├── data/            # Content and configuration
├── stores/          # Zustand state management
├── hooks/           # Custom React hooks
├── lib/             # Utility functions
└── types/           # TypeScript definitions
```

### Making Changes

1. **UI Components** - Edit files in `src/components/`
2. **Pages** - Edit files in `src/app/`
3. **Content** - Edit files in `src/data/modules/`
4. **Styling** - Use Tailwind classes, custom theme in `src/app/globals.css`
5. **Types** - Add/update in `src/types/index.ts`

### Testing Your Changes

1. Run the dev server: `npm run dev`
2. Navigate to affected pages
3. Test all interactive elements
4. Check responsive design (mobile, tablet, desktop)
5. Verify localStorage persistence (clear and reload)
6. Test with different browsers

## Content Guidelines

### Lesson Content

- **Clear learning objectives** - State what students will learn
- **Practical examples** - Use real-world scenarios
- **Progressive difficulty** - Build on previous lessons
- **Interactive exercises** - Include at least 1-2 exercises
- **Proper formatting** - Use markdown, code blocks, callouts

### Code Examples

- **Syntax highlighting** - Specify language
- **Complete examples** - Runnable code when possible
- **Comments** - Explain complex parts
- **Best practices** - Demonstrate good patterns

### Writing Style

- **Conversational** - Write like you're teaching a friend
- **Concise** - Get to the point quickly
- **Active voice** - "You will learn" not "It will be learned"
- **Gender neutral** - Use "they/them" or avoid pronouns
- **Inclusive** - Assume no prior knowledge unless stated

## Style Guide

### TypeScript

- **Strict mode** enabled
- **No any types** - Use proper typing
- **Interfaces over types** - For object shapes
- **Named exports** - Preferred over default exports

### React

- **Functional components** - No class components
- **Hooks** - Use built-in and custom hooks
- **TypeScript** - All components typed
- **'use client'** - Required for all pages/client components

### Tailwind CSS

- **Utility classes** - Prefer over custom CSS
- **Custom theme** - Use CSS variables from `globals.css`
- **Responsive** - Mobile-first approach
- **Dark theme** - Default and only theme

### File Naming

- **Components** - PascalCase (`Button.tsx`)
- **Utilities** - camelCase (`utils.ts`)
- **Hooks** - camelCase with `use` prefix (`useXP.ts`)
- **Stores** - camelCase with `use` prefix (`useUserStore.ts`)

## Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
feat: add new lesson on API streaming
fix: correct XP calculation for challenges
docs: update README with deployment guide
style: format code with prettier
refactor: extract badge logic to helper
test: add tests for gamification system
chore: update dependencies
```

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat** - New feature
- **fix** - Bug fix
- **docs** - Documentation changes
- **style** - Code style changes (formatting)
- **refactor** - Code refactoring
- **test** - Adding or updating tests
- **chore** - Maintenance tasks

### Examples

```bash
feat(lessons): add advanced Claude prompting lesson

- Add lesson content for prompt optimization
- Include 3 exercises (quiz, prompt, ordering)
- Add supporting code examples
- Award 75 XP on completion

Closes #123
```

```bash
fix(gamification): correct streak multiplier calculation

The streak multiplier was capping at 1.3x instead of 1.5x
for 30+ day streaks. Fixed the calculation in gamification.ts.

Fixes #456
```

## Questions?

Feel free to ask questions by:

- **Opening an issue** with the "question" label
- **Starting a discussion** on GitHub Discussions
- **Contacting maintainers** directly

Thank you for contributing! 🎉
