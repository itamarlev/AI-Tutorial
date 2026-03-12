interface SimulatedResponse {
  triggers: string[];
  tool: string;
  topic: string;
  response: string;
}

const responses: SimulatedResponse[] = [
  // Claude responses
  { triggers: ['explain', 'what is', 'how does'], tool: 'claude', topic: 'general',
    response: '## Explanation\n\nGreat question! Let me break this down for you.\n\nThe concept you\'re asking about involves several key components:\n\n1. **Core Mechanism**: The underlying system works by processing inputs through a defined pipeline\n2. **Key Benefit**: This approach provides better maintainability and testability\n3. **Common Usage**: You\'ll see this pattern in most modern applications\n\n### Example\n```typescript\n// Here\'s a simple example\nconst result = process(input);\nconsole.log(result);\n```\n\nWould you like me to go deeper into any specific aspect?' },
  { triggers: ['refactor', 'improve', 'clean up', 'optimize'], tool: 'claude', topic: 'refactoring',
    response: '## Refactored Code\n\nHere are the improvements I\'ve made:\n\n### Changes\n1. **Extracted constants** for magic numbers\n2. **Added type safety** with TypeScript interfaces\n3. **Simplified logic** using modern syntax\n4. **Added error handling** for edge cases\n\n```typescript\ninterface ProcessOptions {\n  maxRetries: number;\n  timeout: number;\n}\n\nconst DEFAULT_OPTIONS: ProcessOptions = {\n  maxRetries: 3,\n  timeout: 5000,\n};\n\nasync function processData(\n  data: unknown[],\n  options: ProcessOptions = DEFAULT_OPTIONS\n): Promise<Result[]> {\n  if (!data?.length) return [];\n  \n  return Promise.all(\n    data.map(item => transform(item, options))\n  );\n}\n```\n\nThe refactored version is more readable, type-safe, and handles edge cases.' },
  { triggers: ['debug', 'error', 'fix', 'bug', 'not working'], tool: 'claude', topic: 'debugging',
    response: '## Bug Analysis\n\n### Root Cause\nThe issue is likely caused by a **null reference** when accessing a property on an undefined object.\n\n### Step-by-Step Analysis\n1. The function receives the data correctly\n2. However, when the input is empty or null, the `.map()` call fails\n3. No error boundary catches this, causing the crash\n\n### Fix\n```typescript\n// Before (buggy)\nconst results = data.map(item => item.value);\n\n// After (fixed)\nconst results = (data ?? []).map(item => item?.value ?? defaultValue);\n```\n\n### Prevention\nAdd a null check at the function entry point and consider adding a unit test for the empty input case.' },
  { triggers: ['test', 'unit test', 'spec', 'jest', 'vitest'], tool: 'claude', topic: 'testing',
    response: '## Generated Tests\n\n```typescript\nimport { describe, it, expect } from \'vitest\';\nimport { processData } from \'./processData\';\n\ndescribe(\'processData\', () => {\n  it(\'processes valid input correctly\', () => {\n    const input = [{ id: 1, value: \'test\' }];\n    const result = processData(input);\n    expect(result).toHaveLength(1);\n    expect(result[0].processed).toBe(true);\n  });\n\n  it(\'handles empty array\', () => {\n    expect(processData([])).toEqual([]);\n  });\n\n  it(\'handles null input\', () => {\n    expect(processData(null)).toEqual([]);\n  });\n\n  it(\'throws on invalid items\', () => {\n    expect(() => processData([{ invalid: true }])).toThrow();\n  });\n});\n```\n\nThese tests cover the happy path, edge cases, and error scenarios.' },
  // Cursor responses
  { triggers: ['component', 'react', 'create', 'build'], tool: 'cursor', topic: 'component',
    response: '## Generated Component\n\nI\'ll create the component with TypeScript, proper props, and styling:\n\n```tsx\ninterface CardProps {\n  title: string;\n  description: string;\n  image?: string;\n  onClick?: () => void;\n}\n\nexport function Card({ title, description, image, onClick }: CardProps) {\n  return (\n    <div\n      className="rounded-xl border bg-card p-6 hover:shadow-lg transition-shadow cursor-pointer"\n      onClick={onClick}\n    >\n      {image && <img src={image} alt={title} className="w-full h-48 object-cover rounded-lg mb-4" />}\n      <h3 className="text-lg font-semibold">{title}</h3>\n      <p className="text-muted-foreground mt-2">{description}</p>\n    </div>\n  );\n}\n```\n\nThis component is:\n- Fully typed with TypeScript\n- Styled with Tailwind CSS\n- Accessible and responsive' },
  { triggers: ['cursor rules', 'cursorrules', '.cursorrules', 'project rules'], tool: 'cursor', topic: 'rules',
    response: '## .cursorrules File\n\nHere\'s a recommended `.cursorrules` for your project:\n\n```\nYou are working on a modern web application.\n\nTech Stack:\n- Next.js 14 (App Router)\n- TypeScript (strict mode)\n- Tailwind CSS\n- Prisma ORM\n\nConventions:\n- Use functional components with hooks\n- Use server components by default, "use client" only when needed\n- Use Tailwind for all styling (no CSS modules)\n- Follow the app router file conventions\n- Use Zod for validation\n\nCode Style:\n- Descriptive variable names\n- Small, focused functions\n- Types over interfaces for unions\n- Avoid any types\n- Use const assertions where possible\n```\n\nPlace this file in your project root.' },
  // Codex responses
  { triggers: ['generate', 'function', 'algorithm', 'implement'], tool: 'codex', topic: 'generation',
    response: '## Generated Implementation\n\n```typescript\n/**\n * Efficiently merges two sorted arrays into a single sorted array.\n * Time complexity: O(n + m)\n * Space complexity: O(n + m)\n */\nfunction mergeSorted<T>(\n  arr1: T[],\n  arr2: T[],\n  compareFn: (a: T, b: T) => number = (a, b) => (a > b ? 1 : -1)\n): T[] {\n  const result: T[] = [];\n  let i = 0;\n  let j = 0;\n\n  while (i < arr1.length && j < arr2.length) {\n    if (compareFn(arr1[i], arr2[j]) <= 0) {\n      result.push(arr1[i++]);\n    } else {\n      result.push(arr2[j++]);\n    }\n  }\n\n  return [...result, ...arr1.slice(i), ...arr2.slice(j)];\n}\n```\n\nThis implementation:\n- Uses generics for type safety\n- Accepts a custom comparator\n- Handles edge cases (empty arrays)\n- Has optimal time complexity' },
  { triggers: ['api', 'endpoint', 'route', 'rest'], tool: 'codex', topic: 'api',
    response: '## API Endpoint\n\n```typescript\nimport { NextRequest, NextResponse } from \'next/server\';\nimport { z } from \'zod\';\n\nconst CreateUserSchema = z.object({\n  name: z.string().min(1).max(100),\n  email: z.string().email(),\n  role: z.enum([\'user\', \'admin\']).default(\'user\'),\n});\n\nexport async function POST(req: NextRequest) {\n  try {\n    const body = await req.json();\n    const data = CreateUserSchema.parse(body);\n    \n    const user = await db.user.create({ data });\n    \n    return NextResponse.json(user, { status: 201 });\n  } catch (error) {\n    if (error instanceof z.ZodError) {\n      return NextResponse.json(\n        { error: \'Validation failed\', details: error.errors },\n        { status: 400 }\n      );\n    }\n    return NextResponse.json(\n      { error: \'Internal server error\' },\n      { status: 500 }\n    );\n  }\n}\n```\n\nIncludes input validation, error handling, and proper HTTP status codes.' },
  // Generic fallback responses
  { triggers: ['help', 'how to', 'guide', 'tutorial'], tool: 'any', topic: 'help',
    response: '## Getting Started Guide\n\nHere\'s how to approach this:\n\n### Step 1: Understand the Requirements\nBreak down what you need to accomplish into smaller, manageable tasks.\n\n### Step 2: Set Up Your Environment\nMake sure you have the right tools and dependencies installed.\n\n### Step 3: Start Small\nBegin with the simplest implementation that works, then iterate.\n\n### Step 4: Test as You Go\nWrite tests for each piece of functionality.\n\n### Step 5: Refactor\nOnce it works, clean up and optimize.\n\n### Resources\n- Check the official documentation for your tool\n- Look at examples in the community\n- Ask specific questions when you get stuck\n\nWhat specific part would you like help with?' },
];

export function getSimulatedResponse(prompt: string, tool: string): string {
  const normalizedPrompt = prompt.toLowerCase();

  // Find best matching response
  let bestMatch: SimulatedResponse | null = null;
  let bestScore = 0;

  for (const resp of responses) {
    if (resp.tool !== 'any' && resp.tool !== tool) continue;

    const score = resp.triggers.reduce((acc, trigger) => {
      return acc + (normalizedPrompt.includes(trigger) ? 1 : 0);
    }, 0);

    if (score > bestScore) {
      bestScore = score;
      bestMatch = resp;
    }
  }

  if (bestMatch && bestScore > 0) {
    return bestMatch.response;
  }

  // Default response
  return `## Response\n\nI understand you're asking about: "${prompt.slice(0, 100)}"\n\nHere's my analysis:\n\n1. **Context**: Based on your prompt, this relates to ${tool} development workflows\n2. **Approach**: I'd recommend breaking this down into smaller steps\n3. **Next Steps**: Try being more specific about what you need\n\n\`\`\`typescript\n// Example code\nconst result = await process(input);\nconsole.log(result);\n\`\`\`\n\nWould you like me to elaborate on any specific aspect?`;
}
