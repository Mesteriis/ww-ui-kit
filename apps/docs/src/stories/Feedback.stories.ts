import type { Meta, StoryObj } from '@storybook/vue3';

import { UiAlert, UiButton, UiCollapse, UiCollapsePanel, UiEmptyState } from '@ww/core';

const meta = {
  title: 'Core/Feedback',
  component: UiEmptyState,
} satisfies Meta<typeof UiEmptyState>;

export default meta;

export const EmptyState: StoryObj<typeof UiEmptyState> = {
  render: () => ({
    components: { UiAlert, UiButton, UiCollapse, UiCollapsePanel, UiEmptyState },
    template: `
      <div class="ui-stack">
        <UiAlert
          type="warning"
          title="Proof surfaces stay in sync"
          description="Stories, playground, and tests must all prove the same stable contract."
          closable
        >
          <template #action>
            <UiButton size="sm" variant="secondary">Review contract</UiButton>
          </template>
        </UiAlert>

        <UiCollapse :default-value="['governance']">
          <UiCollapsePanel value="governance" title="Governance reminders">
            Overlay, motion, and ARIA behavior stay structural rather than ornamental.
          </UiCollapsePanel>
          <UiCollapsePanel value="scope" title="Scope discipline">
            Core stays free of routing, backend orchestration, and system-level query models.
          </UiCollapsePanel>
        </UiCollapse>

        <UiEmptyState
          title="Foundation only"
          description="No product-specific patterns or advanced data components live in this layer."
        >
          <template #icon>◇</template>
          <template #actions>
            <UiButton variant="secondary">Read ADR</UiButton>
            <UiButton>Review package graph</UiButton>
          </template>
        </UiEmptyState>
      </div>
    `,
  }),
};
