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
          <template #header>Current shell level</template>
          <div class="ui-stack">
            <p style="margin: 0; color: var(--ui-text-secondary);">
              <code>@ww/page-templates</code> now exposes generic layout primitives first. Named dashboard and marketing templates are composed above this shell level later.
            </p>
            <div class="ui-cluster">
              <UiBadge variant="brand">UiLayout</UiBadge>
              <UiBadge variant="brand">UiLayoutHeader</UiBadge>
              <UiBadge variant="brand">UiLayoutSider</UiBadge>
              <UiBadge>UiLayoutContent</UiBadge>
              <UiBadge>UiLayoutFooter</UiBadge>
              <UiBadge>UiLayoutSection</UiBadge>
              <UiBadge>UiLayoutToolbar</UiBadge>
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
          <div class="ui-stack" style="gap: var(--ui-space-3);">
            <p style="margin: 0; color: var(--ui-text-secondary);">
              Future named templates such as dashboard and marketing consumers stay in this package, but they build on top of UiLayout instead of replacing it.
            </p>
            <div class="ui-cluster">
              <code v-for="namespace in namespaces" :key="namespace">{{ namespace }}</code>
            </div>
          </div>
        </UiCard>
      </div>
    `,
  }),
};
