import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  timeout: 30_000,
  use: {
    baseURL: 'http://127.0.0.1:4321',
    headless: true,
    launchOptions: { args: ['--enable-unsafe-swiftshader'], executablePath: process.env.PORTFOLIO_CHROMIUM || undefined },
  },
  webServer: {
    command: 'npm run preview -- --port 4321 --ignore-lock',
    url: 'http://127.0.0.1:4321',
    reuseExistingServer: !process.env.CI,
  },
});
