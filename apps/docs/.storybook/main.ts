import type { StorybookConfig } from '@storybook/vue3-vite';
import { mergeConfig } from 'vite';

import { STORYBOOK_CHUNK_WARNING_LIMIT, resolveStorybookManualChunk } from '../../../vite.chunking';

const config: StorybookConfig = {
  addons: ['@storybook/addon-essentials', '@storybook/addon-a11y'],
  framework: {
    name: '@storybook/vue3-vite',
    options: {},
  },
  stories: ['../src/**/*.stories.ts'],
  viteFinal: async (baseConfig) =>
    mergeConfig(baseConfig, {
      build: {
        chunkSizeWarningLimit: STORYBOOK_CHUNK_WARNING_LIMIT,
        rollupOptions: {
          output: {
            manualChunks: resolveStorybookManualChunk,
          },
        },
      },
    }),
};

export default config;
