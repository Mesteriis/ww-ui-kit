import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
  'packages/themes/vitest.config.ts',
  'packages/primitives/vitest.config.ts',
  'packages/charts-apex/vitest.config.ts',
  'packages/signal-graph/vitest.config.ts',
  'packages/widgets/vitest.config.ts',
  'packages/page-templates/vitest.config.ts',
  'packages/core/vitest.config.ts'
]);
