import type { Meta, StoryObj } from '@storybook/vue3-vite';

import { DataGridStoryHarness } from './data-grid-fixtures';

const meta = {
  title: 'Systems/Scenarios/Data Grid/Accessibility',
  component: DataGridStoryHarness,
  tags: ['autodocs', '!dev'],
} satisfies Meta<typeof DataGridStoryHarness>;

export default meta;

export const Overview: StoryObj<typeof meta> = {
  args: {
    mode: 'default',
    caption: 'Account operations grid',
    ariaLabel: 'Accessible account operations data grid',
  },
};
