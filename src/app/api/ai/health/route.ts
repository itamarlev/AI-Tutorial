import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

interface HealthCheckResult {
  claude: boolean;
  cursor: boolean;
  codex: boolean;
}

/**
 * Check if a CLI command exists and can respond.
 * We run a lightweight version check to verify the CLI is actually working,
 * not just that the binary exists.
 */
async function checkTool(command: string, versionFlag: string = '--version'): Promise<boolean> {
  try {
    const { stdout } = await execAsync(`${command} ${versionFlag}`, {
      timeout: 10_000,
    });
    return stdout.trim().length > 0;
  } catch {
    return false;
  }
}

export async function GET() {
  const [claude, cursor, codex] = await Promise.all([
    checkTool('claude', '--version'),
    checkTool('cursor-agent', '--version'),
    checkTool('codex', '--version'),
  ]);

  const result: HealthCheckResult = { claude, cursor, codex };
  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  let commands: { claude?: string; cursor?: string; codex?: string } = {};
  try {
    const body = await request.json();
    commands = body.commands || {};
  } catch {
    // Use defaults
  }

  const [claude, cursor, codex] = await Promise.all([
    checkTool(commands.claude || 'claude', '--version'),
    checkTool(commands.cursor || 'cursor-agent', '--version'),
    checkTool(commands.codex || 'codex', '--version'),
  ]);

  const result: HealthCheckResult = { claude, cursor, codex };
  return NextResponse.json(result);
}
