import type { Meta, StoryObj } from '@storybook/vue3';

import InteractionStoryHarness from './InteractionStoryHarness';

const meta = {
  title: 'Systems/Interaction/Overview',
  component: InteractionStoryHarness,
  tags: ['autodocs'],
} satisfies Meta<typeof InteractionStoryHarness>;

export default meta;

export const Default: StoryObj<typeof meta> = {
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
