import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from '@playwright/test';

const rootDir = path.dirname(fileURLToPath(new URL('../../package.json', import.meta.url)));

export default defineConfig({
  testDir: path.join(rootDir, 'tests/playground/scenarios'),
  timeout: 45_000,
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: 'http://127.0.0.1:6200',
    browserName: 'chromium',
    headless: true,
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'node tests/playground/serve-playground.mjs',
    cwd: rootDir,
    url: 'http://127.0.0.1:6200/playground/',
    reuseExistingServer: !process.env.CI,
  },
});
