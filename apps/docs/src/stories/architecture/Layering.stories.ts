import type { Meta, StoryObj } from '@storybook/vue3';

import { UiBadge, UiCard } from '@ww/core';

const meta = {
  title: 'Architecture/Layering',
  tags: ['autodocs']
} satisfies Meta;

export default meta;

export const Overview: StoryObj = {
  render: () => ({
    components: { UiBadge, UiCard },
    setup() {
      const layers = [
        {
          name: 'Core',
          package: '@ww/core',
          description: 'Baseline components and visual contracts.'
        },
        {
          name: 'Systems',
          package: '@ww/charts-apex · @ww/signal-graph',
          description: 'Larger subsystems and optional adapters.'
        },
        {
          name: 'Widgets',
          package: '@ww/widgets',
          description: 'Black-box composed UI blocks above core and systems.'
        },
        {
          name: 'Page templates',
          package: '@ww/page-templates',
          description: 'Reusable page shells and slot-driven layouts.'
        },
        {
          name: 'Apps',
          package: 'apps/*',
          description: 'Real route pages, domain logic, and backend orchestration.'
        }
      ];

      const examples = [
        ['LoginWindow', '@ww/widgets'],
        ['DataTableWidget', '@ww/widgets'],
        ['AuthPageTemplate', '@ww/page-templates'],
        ['DashboardPageTemplate', '@ww/page-templates'],
        ['Actual route page', 'apps/*']
      ];

      return {
        examples,
        layers
      };
    },
    template: `
      <div class="ui-stack">
        <UiCard>
          <template #header>Layer map</template>
          <div class="ui-stack">
            <div
              v-for="layer in layers"
              :key="layer.name"
              style="
                display: grid;
                gap: var(--ui-space-2);
                padding: var(--ui-space-4);
                border: 1px solid var(--ui-border-subtle);
                border-radius: var(--ui-radius-lg);
                background: color-mix(in srgb, var(--ui-surface-default) 94%, transparent);
              "
            >
              <div class="ui-cluster">
                <UiBadge variant="brand">{{ layer.name }}</UiBadge>
                <code>{{ layer.package }}</code>
              </div>
              <p style="margin: 0; color: var(--ui-text-secondary);">{{ layer.description }}</p>
            </div>
          </div>
        </UiCard>

        <UiCard>
          <template #header>Placement examples</template>
          <div class="ui-stack">
            <div
              v-for="[name, layer] in examples"
              :key="name"
              style="
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: var(--ui-space-4);
                padding: var(--ui-space-3) var(--ui-space-4);
                border: 1px solid var(--ui-border-subtle);
                border-radius: var(--ui-radius-lg);
              "
            >
              <strong>{{ name }}</strong>
              <code>{{ layer }}</code>
            </div>
          </div>
        </UiCard>
      </div>
    `
  })
};
