/**
 * CLI Connection Test Script
 *
 * Tests that each AI CLI tool (claude, cursor-agent, codex) can be
 * spawned, receive a prompt, and produce a response, matching the exact
 * patterns used by the Next.js API route.
 *
 * Run:  npx tsx scripts/test-cli-connections.ts
 */

import { spawn } from 'child_process';

interface ToolConfig {
  name: string;
  command: string;
  args: string[];
  inputMode: 'pipe' | 'arg';
}

const TOOLS: ToolConfig[] = [
  { name: 'Claude',        command: 'claude',        args: ['-p'],    inputMode: 'pipe' },
  { name: 'Cursor Agent',  command: 'cursor-agent',  args: ['-p', '--trust'],  inputMode: 'pipe' },
  { name: 'Codex',         command: 'codex',         args: ['exec'],  inputMode: 'arg'  },
];

const TEST_PROMPT = 'Say hello in exactly one word. Nothing else.';
const TIMEOUT_MS = 60_000;

function testTool(config: ToolConfig): Promise<{
  name: string;
  success: boolean;
  output: string;
  error: string;
  exitCode: number | null;
  durationMs: number;
}> {
  return new Promise((resolve) => {
    const start = Date.now();
    let stdout = '';
    let stderr = '';
    let resolved = false;

    const finish = (success: boolean, exitCode: number | null) => {
      if (resolved) return;
      resolved = true;
      resolve({
        name: config.name,
        success,
        output: stdout.trim(),
        error: stderr.trim(),
        exitCode,
        durationMs: Date.now() - start,
      });
    };

    // Build args based on input mode
    const spawnArgs = config.inputMode === 'arg'
      ? [...config.args, TEST_PROMPT]
      : [...config.args];

    console.log(`\n--- Testing ${config.name} ---`);
    console.log(`  Command: ${config.command} ${spawnArgs.join(' ')}${config.inputMode === 'pipe' ? ' (prompt via stdin)' : ''}`);

    let proc;
    try {
      proc = spawn(config.command, spawnArgs, {
        env: { ...process.env },
        stdio: ['pipe', 'pipe', 'pipe'],
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.log(`  FAIL: Could not spawn process - ${msg}`);
      finish(false, null);
      return;
    }

    // For pipe mode, write prompt to stdin
    if (config.inputMode === 'pipe') {
      proc.stdin.write(TEST_PROMPT);
      proc.stdin.end();
    }

    // Timeout
    const timeout = setTimeout(() => {
      console.log(`  FAIL: Timed out after ${TIMEOUT_MS / 1000}s`);
      proc.kill('SIGTERM');
      finish(false, null);
    }, TIMEOUT_MS);

    proc.stdout.on('data', (data: Buffer) => {
      stdout += data.toString();
    });

    proc.stderr.on('data', (data: Buffer) => {
      stderr += data.toString();
    });

    proc.on('error', (err) => {
      clearTimeout(timeout);
      console.log(`  FAIL: Process error - ${err.message}`);
      finish(false, null);
    });

    proc.on('close', (code) => {
      clearTimeout(timeout);
      if (stdout.trim().length > 0) {
        console.log(`  OK: Got response (${stdout.trim().length} chars, ${((Date.now() - start) / 1000).toFixed(1)}s)`);
        console.log(`  Response: "${stdout.trim().slice(0, 100)}${stdout.trim().length > 100 ? '...' : ''}"`);
        finish(true, code);
      } else {
        console.log(`  FAIL: Empty stdout (exit code: ${code})`);
        if (stderr.trim()) {
          console.log(`  Stderr: "${stderr.trim().slice(0, 200)}"`);
        }
        finish(false, code);
      }
    });
  });
}

async function versionCheck(command: string): Promise<string | null> {
  return new Promise((resolve) => {
    const proc = spawn(command, ['--version'], { stdio: ['pipe', 'pipe', 'pipe'] });
    let stdout = '';
    proc.stdout.on('data', (d: Buffer) => { stdout += d.toString(); });
    proc.on('close', () => resolve(stdout.trim() || null));
    proc.on('error', () => resolve(null));
    setTimeout(() => { proc.kill(); resolve(null); }, 5000);
  });
}

async function main() {
  console.log('=== AI CLI Connection Tests ===\n');

  // Version checks first
  console.log('Version checks:');
  for (const tool of TOOLS) {
    const version = await versionCheck(tool.command);
    if (version) {
      console.log(`  ${tool.name}: ${version}`);
    } else {
      console.log(`  ${tool.name}: NOT FOUND`);
    }
  }

  // Run actual prompt tests
  const results = [];
  for (const tool of TOOLS) {
    const result = await testTool(tool);
    results.push(result);
  }

  // Summary
  console.log('\n=== Summary ===');
  const passed = results.filter((r) => r.success).length;
  const total = results.length;
  console.log(`\n  ${passed}/${total} tools connected successfully\n`);

  for (const r of results) {
    const status = r.success ? 'PASS' : 'FAIL';
    const time = `${(r.durationMs / 1000).toFixed(1)}s`;
    console.log(`  [${status}] ${r.name} (${time})`);
    if (!r.success && r.error) {
      console.log(`         Error: ${r.error.slice(0, 150)}`);
    }
  }

  console.log('');
  process.exit(passed === total ? 0 : 1);
}

main();
