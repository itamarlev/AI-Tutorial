import { test, expect } from '@playwright/test';
import { mkdirSync, existsSync } from 'fs';
import { join } from 'path';

const SCREENSHOT_DIR = join(process.cwd(), 'public', 'screenshots');

test.beforeAll(() => {
  // Ensure screenshot directory exists
  if (!existsSync(SCREENSHOT_DIR)) {
    mkdirSync(SCREENSHOT_DIR, { recursive: true });
  }
});

test.describe('AI Tutorial Screenshots', () => {
  test('capture landing page', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Wait for animations to settle
    await page.waitForTimeout(1000);

    await page.screenshot({
      path: join(SCREENSHOT_DIR, 'landing.png'),
      fullPage: false,
    });
  });

  test('capture onboarding flow', async ({ page }) => {
    await page.goto('/onboarding');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    await page.screenshot({
      path: join(SCREENSHOT_DIR, 'onboarding.png'),
      fullPage: false,
    });
  });

  test('capture dashboard', async ({ page }) => {
    // Navigate directly to dashboard (it will work without onboarding in localStorage)
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    await page.screenshot({
      path: join(SCREENSHOT_DIR, 'dashboard.png'),
      fullPage: false,
    });
  });

  test('capture learn page', async ({ page }) => {
    await page.goto('/learn');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    await page.screenshot({
      path: join(SCREENSHOT_DIR, 'learn.png'),
      fullPage: false,
    });
  });

  test('capture lesson view', async ({ page }) => {
    await page.goto('/learn/claude/cli-basics/getting-started');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    await page.screenshot({
      path: join(SCREENSHOT_DIR, 'lesson.png'),
      fullPage: true,
    });
  });

  test('capture playground', async ({ page }) => {
    await page.goto('/playground');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    await page.screenshot({
      path: join(SCREENSHOT_DIR, 'playground.png'),
      fullPage: false,
    });
  });

  test('capture challenges', async ({ page }) => {
    await page.goto('/challenges');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    await page.screenshot({
      path: join(SCREENSHOT_DIR, 'challenges.png'),
      fullPage: false,
    });
  });

  test('capture achievements', async ({ page }) => {
    await page.goto('/achievements');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    await page.screenshot({
      path: join(SCREENSHOT_DIR, 'achievements.png'),
      fullPage: false,
    });
  });

  test('capture leaderboard', async ({ page }) => {
    await page.goto('/leaderboard');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    await page.screenshot({
      path: join(SCREENSHOT_DIR, 'leaderboard.png'),
      fullPage: false,
    });
  });
});
