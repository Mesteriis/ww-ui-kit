import type { StorybookConfig } from '@storybook/vue3-vite';
import { mergeConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import tsconfigPaths from 'vite-tsconfig-paths';

import { workspaceAliases } from '../../../vite.aliases';
import { STORYBOOK_CHUNK_WARNING_LIMIT, resolveStorybookManualChunk } from '../../../vite.chunking';

const config: StorybookConfig = {
  addons: ['@storybook/addon-essentials', '@storybook/addon-a11y'],
  framework: {
    name: '@storybook/vue3-vite',
    options: {},
  },
  stories: ['../src/**/*.stories.ts'],
  viteFinal: (baseConfig) => {
    const basePlugins = (baseConfig.plugins ?? []).filter(
      (plugin) =>
        !plugin ||
        typeof plugin !== 'object' ||
        !('name' in plugin) ||
        String(plugin.name) !== 'vite:vue'
    );

    const mergedConfig = mergeConfig(baseConfig, {
      resolve: {
        alias: workspaceAliases,
      },
      build: {
        chunkSizeWarningLimit: STORYBOOK_CHUNK_WARNING_LIMIT,
        rollupOptions: {
          output: {
            manualChunks: resolveStorybookManualChunk,
          },
        },
      },
    });

    return {
      ...mergedConfig,
      plugins: [tsconfigPaths(), vue(), ...basePlugins],
    };
  },
};

export default config;
