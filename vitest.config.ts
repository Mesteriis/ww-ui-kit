import path from 'node:path';

import { defineConfig } from 'vitest/config';

import { unitVitestProjects } from './vitest.project-paths';
import { storybookConfigDir, storybookVitestProject } from './vitest.storybook.project';

const requestedStorybookConfigDir = process.env.STORYBOOK_CONFIG_DIR;
const shouldIncludeStorybookProject =
  typeof requestedStorybookConfigDir === 'string' &&
  path.normalize(requestedStorybookConfigDir) === path.normalize(storybookConfigDir);

// Includes @storybook/addon-vitest project when Storybook starts Vitest from the repo root.
export default defineConfig({
  test: {
    projects: shouldIncludeStorybookProject
      ? [...unitVitestProjects, storybookVitestProject]
      : unitVitestProjects,
  },
});
