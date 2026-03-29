import type { StorybookConfig } from '@storybook/vue3-vite';

const config: StorybookConfig = {
  addons: ['@storybook/addon-essentials', '@storybook/addon-a11y'],
  framework: {
    name: '@storybook/vue3-vite',
    options: {},
  },
  stories: ['../src/**/*.stories.ts'],
};

export default config;
