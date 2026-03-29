import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import tsconfigPaths from 'vite-tsconfig-paths';

import { workspaceAliases, workspaceRoot } from '../../vite.aliases';

export default defineConfig({
  plugins: [vue(), tsconfigPaths()],
  resolve: {
    alias: workspaceAliases,
  },
  test: {
    name: 'signal-graph',
    root: workspaceRoot,
    environment: 'jsdom',
    include: ['packages/signal-graph/src/**/*.test.ts'],
    globals: true,
  },
});
