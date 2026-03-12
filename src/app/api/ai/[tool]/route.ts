import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import type { AIInputMode } from '@/types';

const TIMEOUT_MS = 120_000; // 2 minutes

interface RequestBody {
  prompt: string;
  command: string;
  args: string[];
  inputMode: AIInputMode;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ tool: string }> }
) {
  const { tool } = await params;

  if (!['claude', 'cursor', 'codex'].includes(tool)) {
    return NextResponse.json(
      { error: `Invalid tool: ${tool}` },
      { status: 400 }
    );
  }

  let body: RequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body' },
      { status: 400 }
    );
  }

  const { prompt, command, args, inputMode } = body;

  if (!prompt || typeof prompt !== 'string') {
    return NextResponse.json(
      { error: 'Missing or invalid prompt' },
      { status: 400 }
    );
  }

  if (!command || typeof command !== 'string') {
    return NextResponse.json(
      { error: 'Missing or invalid command' },
      { status: 400 }
    );
  }

  const mode: AIInputMode = inputMode || 'pipe';

  // Build args based on inputMode:
  // - 'pipe': spawn with flags only, then write prompt to stdin
  // - 'arg':  append prompt as a positional argument
  const spawnArgs = mode === 'arg'
    ? [...(args || []), prompt]
    : [...(args || [])];

  const stream = new ReadableStream({
    start(controller) {
      let killed = false;
      const encoder = new TextEncoder();

      // Spawn without shell: true to avoid argument splitting issues
      const proc = spawn(command, spawnArgs, {
        env: { ...process.env },
        stdio: ['pipe', 'pipe', 'pipe'],
      });

      // For pipe mode, write the prompt to stdin and close it
      if (mode === 'pipe') {
        proc.stdin.write(prompt);
        proc.stdin.end();
      }

      const timeout = setTimeout(() => {
        if (!killed) {
          killed = true;
          proc.kill('SIGTERM');
          controller.enqueue(encoder.encode('\n\n[Error: Process timed out after 2 minutes]'));
          controller.close();
        }
      }, TIMEOUT_MS);

      proc.stdout.on('data', (data: Buffer) => {
        if (!killed) {
          controller.enqueue(data);
        }
      });

      // Capture stderr but don't stream it to the user
      // (CLIs like codex print debug info to stderr)
      const stderrChunks: Buffer[] = [];
      proc.stderr.on('data', (data: Buffer) => {
        stderrChunks.push(data);
      });

      proc.on('error', (error) => {
        clearTimeout(timeout);
        if (!killed) {
          killed = true;
          const message = error.message.includes('ENOENT')
            ? `[Error: Command "${command}" not found. Make sure it is installed and in your PATH.]`
            : `[Error: ${error.message}]`;
          controller.enqueue(encoder.encode(message));
          controller.close();
        }
      });

      proc.on('close', (code) => {
        clearTimeout(timeout);
        if (!killed) {
          killed = true;
          if (code !== 0 && code !== null) {
            // Include stderr in error output for debugging
            const stderr = Buffer.concat(stderrChunks).toString().trim();
            const errorInfo = stderr
              ? `\n\n[Process exited with code ${code}]\n${stderr.slice(0, 500)}`
              : `\n\n[Process exited with code ${code}]`;
            controller.enqueue(encoder.encode(errorInfo));
          }
          controller.close();
        }
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache',
      'Transfer-Encoding': 'chunked',
    },
  });
}
