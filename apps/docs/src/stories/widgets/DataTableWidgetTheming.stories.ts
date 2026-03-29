import type { Meta, StoryObj } from '@storybook/vue3';

import { UiBadge } from '@ww/core';

import { DataTableWidgetStoryHarness } from './data-table-widget-fixtures';

const meta = {
  title: 'Widgets/Data Table Widget/Theming',
  component: DataTableWidgetStoryHarness,
  tags: ['autodocs'],
} satisfies Meta<typeof DataTableWidgetStoryHarness>;

export default meta;

export const Overview: StoryObj<typeof meta> = {
  render: () => ({
    components: { DataTableWidgetStoryHarness, UiBadge },
    template: `
      <div class="ui-stack" style="gap: var(--ui-space-6);">
        <section class="ui-stack" style="gap: var(--ui-space-3);">
          <UiBadge variant="brand">Light subtree</UiBadge>
          <DataTableWidgetStoryHarness subtree-theme="light" />
        </section>
        <section class="ui-stack" style="gap: var(--ui-space-3);">
          <UiBadge variant="brand">Dark subtree</UiBadge>
          <DataTableWidgetStoryHarness subtree-theme="dark" />
        </section>
        <section class="ui-stack" style="gap: var(--ui-space-3);">
          <UiBadge variant="brand">Belovodye subtree</UiBadge>
          <DataTableWidgetStoryHarness subtree-theme="belovodye" />
        </section>
      </div>
    `,
  }),
};
