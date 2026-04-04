import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    projects: [
      'packages/themes/vitest.config.ts',
      'packages/primitives/vitest.config.ts',
      'packages/third-party/charts-apex/vitest.config.ts',
      'packages/third-party/tsparticles/vitest.config.ts',
      'packages/signal-graph/vitest.config.ts',
      'packages/data-grid/vitest.config.ts',
      'packages/interaction/vitest.config.ts',
      'packages/widgets/vitest.config.ts',
      'packages/page-templates/vitest.config.ts',
      'packages/core/vitest.config.ts',
      'apps/playground/vitest.config.ts',
      'tests/meta/vitest.config.ts',
    ],
  },
});
