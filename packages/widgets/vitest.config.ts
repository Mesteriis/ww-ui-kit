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
    name: 'widgets',
    root: workspaceRoot,
    environment: 'jsdom',
    include: ['packages/widgets/src/**/*.test.ts'],
    globals: true,
  },
});
