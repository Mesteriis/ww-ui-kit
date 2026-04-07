import type { Meta, StoryObj } from '@storybook/vue3-vite';

import { DataGridStoryHarness } from './data-grid-fixtures';

const meta = {
  title: 'Systems/Scenarios/Data Grid/Dense Admin Surface',
  component: DataGridStoryHarness,
  tags: ['autodocs', '!dev'],
} satisfies Meta<typeof DataGridStoryHarness>;

export default meta;

export const Overview: StoryObj<typeof meta> = {
  args: {
    mode: 'dense',
    density: 'compact',
    stickyHeader: true,
  },
};
