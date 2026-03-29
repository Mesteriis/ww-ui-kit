import type { Meta, StoryObj } from '@storybook/vue3';

import { UiBadge, UiCard } from '@ww/core';
import { RESERVED_WIDGET_NAMESPACES, WIDGET_LAYER_RULES } from '@ww/widgets';

const meta = {
  title: 'Architecture/Widgets/Overview',
  tags: ['autodocs'],
} satisfies Meta;

export default meta;

export const WidgetsLayer: StoryObj = {
  render: () => ({
    components: { UiBadge, UiCard },
    setup() {
      return {
        namespaces: RESERVED_WIDGET_NAMESPACES,
        rules: WIDGET_LAYER_RULES,
      };
    },
    template: `
      <div class="ui-stack">
        <UiCard>
          <template #header>What belongs in widgets</template>
          <div class="ui-stack">
            <p style="margin: 0; color: var(--ui-text-secondary);">
              Widgets are black-box composition surfaces. They can assemble core components and optional systems,
              but they do not own routing, backend integration, or app-level orchestration. DataTableWidget
              is the canonical proof that widget-layer business blocks sit above systems instead of replacing them.
            </p>
            <div class="ui-cluster">
              <UiBadge variant="brand">LoginWindow</UiBadge>
              <UiBadge variant="brand">DataTableWidget</UiBadge>
              <UiBadge variant="brand">ActivityFeedWidget</UiBadge>
            </div>
          </div>
        </UiCard>

        <UiCard>
          <template #header>Layer rules</template>
          <div class="ui-stack">
            <div
              v-for="rule in rules"
              :key="rule.title"
              style="
                display: grid;
                gap: var(--ui-space-2);
                padding: var(--ui-space-4);
                border: 1px solid var(--ui-border-subtle);
                border-radius: var(--ui-radius-lg);
              "
            >
              <strong>{{ rule.title }}</strong>
              <p style="margin: 0; color: var(--ui-text-secondary);">{{ rule.description }}</p>
            </div>
          </div>
        </UiCard>

        <UiCard>
          <template #header>Reserved namespaces</template>
          <div class="ui-cluster">
            <code v-for="namespace in namespaces" :key="namespace">{{ namespace }}</code>
          </div>
        </UiCard>
      </div>
    `,
  }),
};
