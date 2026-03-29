import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import tsconfigPaths from 'vite-tsconfig-paths';

import { workspaceAliases } from '../../vite.aliases';

export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/playground/' : '/',
  plugins: [vue(), tsconfigPaths()],
  resolve: {
    alias: workspaceAliases,
  },
}));
