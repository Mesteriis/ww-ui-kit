import type { Meta, StoryObj } from '@storybook/vue3-vite';

import { DataTableWidgetStoryHarness } from './data-table-widget-fixtures';

const meta = {
  title: 'Widgets/Scenarios/Data Table Widget/States',
  component: DataTableWidgetStoryHarness,
  tags: ['autodocs', '!dev'],
} satisfies Meta<typeof DataTableWidgetStoryHarness>;

export default meta;

export const Overview: StoryObj<typeof meta> = {
  render: () => ({
    components: { DataTableWidgetStoryHarness },
    template: `
      <div class="ui-stack" style="gap: var(--ui-space-6);">
        <DataTableWidgetStoryHarness mode="loading" />
        <DataTableWidgetStoryHarness mode="empty" />
        <DataTableWidgetStoryHarness mode="no-results" />
        <DataTableWidgetStoryHarness mode="error" />
      </div>
    `,
  }),
};
