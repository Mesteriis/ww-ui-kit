import type { Meta, StoryObj } from '@storybook/vue3';

import { DataGridStoryHarness } from './data-grid-fixtures';

const meta = {
  title: 'Systems/Data Grid/Composition',
  component: DataGridStoryHarness,
  tags: ['autodocs'],
} satisfies Meta<typeof DataGridStoryHarness>;

export default meta;

export const Overview: StoryObj<typeof meta> = {
  args: {
    composed: true,
  },
};
