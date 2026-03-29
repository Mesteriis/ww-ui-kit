import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from '@playwright/test';

const rootDir = path.dirname(fileURLToPath(new URL('../../package.json', import.meta.url)));

export default defineConfig({
  testDir: path.join(rootDir, 'tests/e2e/storybook'),
  timeout: 45_000,
  fullyParallel: true,
  use: {
    baseURL: 'http://127.0.0.1:6100',
    browserName: 'chromium',
    headless: true,
    trace: 'retain-on-failure'
  },
  webServer: {
    command: 'python3 -m http.server 6100 -d apps/docs/storybook-static',
    cwd: rootDir,
    url: 'http://127.0.0.1:6100',
    reuseExistingServer: !process.env.CI
  }
});

