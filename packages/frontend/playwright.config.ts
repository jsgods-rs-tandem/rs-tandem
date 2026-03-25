import { defineConfig, devices } from '@playwright/test';

const IS_CI = !!process.env.IS_CI;

export default defineConfig({
  testDir: './e2e',
  globalSetup: './e2e/global-setup.ts',
  fullyParallel: true,
  forbidOnly: IS_CI,
  reporter: [['html', { outputFolder: 'playwright/report' }], ['list']],
  outputDir: `playwright/artifacts`,
  use: {
    baseURL: process.env.BASE_URL ?? 'http://localhost:4200',
    trace: IS_CI ? 'retain-on-failure' : 'on',
  },
  retries: 0,
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome HiDPI'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 7'] },
    },
  ],
});
