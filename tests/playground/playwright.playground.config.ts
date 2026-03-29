import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from '@playwright/test';

const rootDir = path.dirname(fileURLToPath(new URL('../../package.json', import.meta.url)));

export default defineConfig({
  testDir: path.join(rootDir, 'tests/playground/scenarios'),
  timeout: 45_000,
  fullyParallel: true,
  use: {
    baseURL: 'http://127.0.0.1:6200',
    browserName: 'chromium',
    headless: true,
    trace: 'retain-on-failure'
  },
  webServer: {
    command: 'python3 -m http.server 6200 -d apps/playground/dist',
    cwd: rootDir,
    url: 'http://127.0.0.1:6200',
    reuseExistingServer: !process.env.CI
  }
});

