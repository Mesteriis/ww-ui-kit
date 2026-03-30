import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import tsconfigPaths from 'vite-tsconfig-paths';

import { workspaceAliases } from '../../vite.aliases';
import { PLAYGROUND_CHUNK_WARNING_LIMIT, resolvePlaygroundManualChunk } from '../../vite.chunking';

export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/playground/' : '/',
  plugins: [vue(), tsconfigPaths()],
  resolve: {
    alias: workspaceAliases,
  },
  build: {
    chunkSizeWarningLimit: PLAYGROUND_CHUNK_WARNING_LIMIT,
    rollupOptions: {
      output: {
        manualChunks: resolvePlaygroundManualChunk,
      },
    },
  },
}));
