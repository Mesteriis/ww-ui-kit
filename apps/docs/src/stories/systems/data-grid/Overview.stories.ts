import type { Meta, StoryObj } from '@storybook/vue3';

import { DataGridStoryHarness } from './data-grid-fixtures';

const meta = {
  title: 'Systems/Data Grid/Overview',
  component: DataGridStoryHarness,
  tags: ['autodocs'],
} satisfies Meta<typeof DataGridStoryHarness>;

export default meta;

export const Default: StoryObj<typeof meta> = {
  args: {
    mode: 'default',
  },
};
