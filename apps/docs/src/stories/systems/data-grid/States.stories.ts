import type { Meta, StoryObj } from '@storybook/vue3';

import { DataGridStoryHarness } from './data-grid-fixtures';

const meta = {
  title: 'Systems/Data Grid/States',
  component: DataGridStoryHarness,
  tags: ['autodocs']
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
    `
  })
};
