import { AIToolConfig, AIToolSlug } from '@/types';
import { getSimulatedResponse } from './simulatedResponses';

export interface AIHealthCheckResult {
  claude: boolean;
  cursor: boolean;
  codex: boolean;
}

export interface SendPromptOptions {
  tool: AIToolSlug;
  prompt: string;
  config: AIToolConfig;
}

export interface StreamResult {
  stream: AsyncIterable<string>;
  isSimulated: boolean;
}

/**
 * Check which CLI tools are available on the system
 */
export async function checkHealth(customCommands?: {
  claude?: string;
  cursor?: string;
  codex?: string;
}): Promise<AIHealthCheckResult> {
  try {
    const response = customCommands
      ? await fetch('/api/ai/health', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ commands: customCommands }),
        })
      : await fetch('/api/ai/health');

    if (!response.ok) {
      throw new Error('Health check failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Health check error:', error);
    return { claude: false, cursor: false, codex: false };
  }
}

/**
 * Convert a ReadableStream to an async iterable of strings
 */
async function* streamToAsyncIterable(
  reader: ReadableStreamDefaultReader<Uint8Array>
): AsyncIterable<string> {
  const decoder = new TextDecoder();

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      yield decoder.decode(value, { stream: true });
    }
    // Flush any remaining bytes
    const final = decoder.decode();
    if (final) yield final;
  } finally {
    reader.releaseLock();
  }
}

/**
 * Convert a static string to an async iterable (for simulated mode)
 */
async function* stringToAsyncIterable(content: string): AsyncIterable<string> {
  yield content;
}

/**
 * Send a prompt to the AI CLI tool and get a streaming response
 * Falls back to simulated response if the tool is not available
 */
export async function sendPrompt(options: SendPromptOptions): Promise<StreamResult> {
  const { tool, prompt, config } = options;

  // If not enabled or not available, use simulated response
  if (!config.enabled || !config.available) {
    const simulatedContent = getSimulatedResponse(prompt, tool);
    return {
      stream: stringToAsyncIterable(simulatedContent),
      isSimulated: true,
    };
  }

  try {
    const response = await fetch(`/api/ai/${tool}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt,
        command: config.command,
        args: config.args,
        inputMode: config.inputMode,
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    if (!response.body) {
      throw new Error('No response body');
    }

    const reader = response.body.getReader();
    return {
      stream: streamToAsyncIterable(reader),
      isSimulated: false,
    };
  } catch (error) {
    console.error('AI request error:', error);
    // Fall back to simulated response on error
    const simulatedContent = getSimulatedResponse(prompt, tool);
    return {
      stream: stringToAsyncIterable(simulatedContent),
      isSimulated: true,
    };
  }
}

/**
 * Collect all chunks from a stream into a single string
 */
export async function collectStream(stream: AsyncIterable<string>): Promise<string> {
  let result = '';
  for await (const chunk of stream) {
    result += chunk;
  }
  return result;
}
