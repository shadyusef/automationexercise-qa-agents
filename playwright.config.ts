import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

const isCI = !!process.env.CI;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 2 : undefined,
  timeout: 60_000,
  expect: { timeout: 10_000 },
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: process.env.BASE_URL ?? 'https://www.automationexercise.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: process.env.PW_VIDEO === 'on' ? 'on' : process.env.PW_VIDEO ? 'retain-on-failure' : 'off',
    actionTimeout: 15_000,
    launchOptions: { slowMo: Number(process.env.PW_SLOWMO) || 0 },
    navigationTimeout: 30_000,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'], channel: process.env.PW_CHANNEL || undefined } },
    // Cross-browser was out of scope for now. Uncomment to enable:
    // { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    // { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
