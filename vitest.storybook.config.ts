import { defineConfig } from 'vitest/config';

import { storybookVitestProject } from './vitest.storybook.project';

export default defineConfig({
  test: {
    projects: [storybookVitestProject],
  },
});
