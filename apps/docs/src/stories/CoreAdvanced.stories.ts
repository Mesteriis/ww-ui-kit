import type { Meta, StoryObj } from '@storybook/vue3';

import CoreAdvancedStoryHarness from './core-advanced/CoreAdvancedStoryHarness';

const meta = {
  title: 'Core/Advanced Surfaces',
  component: CoreAdvancedStoryHarness,
  tags: ['autodocs'],
} satisfies Meta<typeof CoreAdvancedStoryHarness>;

export default meta;

export const Overview: StoryObj<typeof meta> = {
  args: {
    mode: 'overview',
  },
};

export const States: StoryObj<typeof meta> = {
  args: {
    mode: 'states',
  },
};

export const Theming: StoryObj<typeof meta> = {
  args: {
    mode: 'theming',
  },
};

export const Interactions: StoryObj<typeof meta> = {
  args: {
    mode: 'interactions',
  },
};
