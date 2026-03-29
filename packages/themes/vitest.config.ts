import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

import { workspaceAliases, workspaceRoot } from '../../vite.aliases';

export default defineConfig({
  plugins: [tsconfigPaths()],
  resolve: {
    alias: workspaceAliases
  },
  test: {
    name: 'themes',
    root: workspaceRoot,
    environment: 'jsdom',
    include: ['packages/themes/src/**/*.test.ts'],
    globals: true
  }
});
