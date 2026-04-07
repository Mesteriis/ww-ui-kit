import type { Meta, StoryObj } from '@storybook/vue3-vite';

import { DataGridStoryHarness } from './data-grid-fixtures';
import DataGridSubcomponentsStoryHarness from './DataGridSubcomponentsStoryHarness';

const meta = {
  title: 'Systems/Scenarios/Data Grid/Composition',
  component: DataGridStoryHarness,
  tags: ['autodocs', '!dev'],
} satisfies Meta<typeof DataGridStoryHarness>;

export default meta;

export const Overview: StoryObj<typeof meta> = {
  args: {
    composed: true,
  },
};

export const Subcomponents: StoryObj<typeof meta> = {
  render: () => ({
    components: {
      DataGridSubcomponentsStoryHarness,
    },
    template: `
      <DataGridSubcomponentsStoryHarness />
    `,
  }),
};
