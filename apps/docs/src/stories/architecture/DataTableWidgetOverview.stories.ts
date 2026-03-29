import type { Meta, StoryObj } from '@storybook/vue3';

import { UiBadge, UiCard } from '@ww/core';

const meta = {
  title: 'Architecture/Widgets/Data Table Widget',
  tags: ['autodocs']
} satisfies Meta;

export default meta;

export const Overview: StoryObj = {
  render: () => ({
    components: { UiBadge, UiCard },
    template: `
      <div class="ui-stack">
        <UiCard>
          <template #header>What this widget is</template>
          <div class="ui-stack">
            <p style="margin: 0; color: var(--ui-text-secondary);">
              <code>DataTableWidget</code> is a reusable widget-layer block. It frames title, actions, status, and
              footer composition around the controlled <code>@ww/data-grid</code> system package.
            </p>
            <div class="ui-cluster">
              <UiBadge variant="brand">Widget layer</UiBadge>
              <UiBadge>Composes @ww/data-grid</UiBadge>
              <UiBadge>No backend ownership</UiBadge>
            </div>
          </div>
        </UiCard>

        <UiCard>
          <template #header>What it is not</template>
          <div class="ui-stack">
            <p style="margin: 0; color: var(--ui-text-secondary);">
              It is not a second grid engine, not a route page, and not a backend-aware users/orders table. Query,
              rows, totals, and selection remain controlled by the consumer app.
            </p>
          </div>
        </UiCard>
      </div>
    `
  })
};
