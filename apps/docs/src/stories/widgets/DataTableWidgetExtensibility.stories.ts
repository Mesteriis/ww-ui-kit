import type { Meta, StoryObj } from '@storybook/vue3-vite';

import { DataTableWidgetStoryHarness } from './data-table-widget-fixtures';

const meta = {
  title: 'Widgets/Scenarios/Data Table Widget/Extensibility',
  component: DataTableWidgetStoryHarness,
  tags: ['autodocs', '!dev'],
} satisfies Meta<typeof DataTableWidgetStoryHarness>;

export default meta;

export const Overview: StoryObj<typeof meta> = {
  args: {
    customSlots: true,
  },
};
