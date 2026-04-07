import type { Meta, StoryObj } from '@storybook/vue3-vite';

import { DataGridStoryHarness } from './data-grid-fixtures';

const meta = {
  title: 'Systems/Scenarios/Data Grid/States',
  component: DataGridStoryHarness,
  tags: ['autodocs', '!dev'],
} satisfies Meta<typeof DataGridStoryHarness>;

export default meta;

export const Overview: StoryObj<typeof meta> = {
  render: () => ({
    components: { DataGridStoryHarness },
    template: `
      <div class="ui-stack" style="gap: var(--ui-space-6);">
        <DataGridStoryHarness mode="loading" />
        <DataGridStoryHarness mode="empty" />
        <DataGridStoryHarness mode="no-results" />
        <DataGridStoryHarness mode="error" />
      </div>
    `,
  }),
};
