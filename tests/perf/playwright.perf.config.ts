import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig } from '@playwright/test';

const rootDir = path.dirname(fileURLToPath(new URL('../../package.json', import.meta.url)));

export default defineConfig({
  testDir: path.join(rootDir, 'tests/perf/scenarios'),
  timeout: 180_000,
  fullyParallel: false,
  workers: 1,
  retries: 0,
  outputDir: path.join(rootDir, 'test-results/perf'),
  reporter: process.env.CI
    ? [
        ['line'],
        ['html', { open: 'never', outputFolder: path.join(rootDir, 'playwright-report/perf') }],
      ]
    : 'line',
  use: {
    baseURL: 'http://127.0.0.1:6200',
    browserName: 'chromium',
    headless: true,
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'node tests/playground/serve-playground.mjs',
    cwd: rootDir,
    url: 'http://127.0.0.1:6200/playground/',
    reuseExistingServer: !process.env.CI,
  },
});
