import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineProject } from 'vitest/config';

import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';

const dirname =
  typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

export const storybookConfigDir = path.join(dirname, 'apps/docs/.storybook');
export const storybookProjectName = `storybook:${path.normalize(storybookConfigDir)}`;

export const storybookVitestProject = defineProject({
  plugins: [storybookTest({ configDir: storybookConfigDir })],
  test: {
    dir: path.join(dirname, 'apps/docs'),
    name: storybookProjectName,
    browser: {
      enabled: true,
      headless: true,
      provider: 'playwright',
      instances: [{ browser: 'chromium' }],
    },
  },
});
