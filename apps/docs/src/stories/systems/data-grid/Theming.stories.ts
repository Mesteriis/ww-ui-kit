import type { Meta, StoryObj } from '@storybook/vue3';

import { UiBadge } from '@ww/core';

import { DataGridStoryHarness } from './data-grid-fixtures';

const meta = {
  title: 'Systems/Data Grid/Theming',
  component: DataGridStoryHarness,
  tags: ['autodocs']
} satisfies Meta<typeof DataGridStoryHarness>;

export default meta;

export const Overview: StoryObj<typeof meta> = {
  render: () => ({
    components: { DataGridStoryHarness, UiBadge },
    template: `
      <div class="ui-stack" style="gap: var(--ui-space-6);">
        <section class="ui-stack" style="gap: var(--ui-space-3);">
          <UiBadge variant="brand">Light subtree</UiBadge>
          <DataGridStoryHarness subtree-theme="light" />
        </section>
        <section class="ui-stack" style="gap: var(--ui-space-3);">
          <UiBadge variant="brand">Dark subtree</UiBadge>
          <DataGridStoryHarness subtree-theme="dark" />
        </section>
        <section class="ui-stack" style="gap: var(--ui-space-3);">
          <UiBadge variant="brand">Belovodye subtree</UiBadge>
          <DataGridStoryHarness subtree-theme="belovodye" />
        </section>
      </div>
    `
  })
};
