import type { Meta, StoryObj } from '@storybook/vue3';

import { UiBadge, UiCard } from '@ww/core';
import { PAGE_TEMPLATE_LAYER_RULES, RESERVED_PAGE_TEMPLATE_NAMESPACES } from '@ww/page-templates';

const meta = {
  title: 'Architecture/Page Templates/Overview',
  tags: ['autodocs'],
} satisfies Meta;

export default meta;

export const PageTemplatesLayer: StoryObj = {
  render: () => ({
    components: { UiBadge, UiCard },
    setup() {
      return {
        namespaces: RESERVED_PAGE_TEMPLATE_NAMESPACES,
        rules: PAGE_TEMPLATE_LAYER_RULES,
      };
    },
    template: `
      <div class="ui-stack">
        <UiCard>
          <template #header>What page templates are</template>
          <div class="ui-stack">
            <p style="margin: 0; color: var(--ui-text-secondary);">
              Page templates define reusable layout shells. They are not route pages and they do not fetch domain data.
            </p>
            <div class="ui-cluster">
              <UiBadge variant="brand">AuthPageTemplate</UiBadge>
              <UiBadge variant="brand">WorkspacePageTemplate</UiBadge>
              <UiBadge variant="brand">DashboardPageTemplate</UiBadge>
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
