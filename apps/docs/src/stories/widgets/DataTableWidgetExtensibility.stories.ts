import type { Meta, StoryObj } from '@storybook/vue3';

import { DataTableWidgetStoryHarness } from './data-table-widget-fixtures';

const meta = {
  title: 'Widgets/Data Table Widget/Extensibility',
  component: DataTableWidgetStoryHarness,
  tags: ['autodocs'],
} satisfies Meta<typeof DataTableWidgetStoryHarness>;

export default meta;

export const Overview: StoryObj<typeof meta> = {
  args: {
    customSlots: true,
  },
};
