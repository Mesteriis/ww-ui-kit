import type { Meta, StoryObj } from '@storybook/vue3-vite';

import { UiAlert, UiButton, UiCollapse, UiCollapsePanel, UiEmptyState, UiResult } from '@ww/core';

const meta = {
  title: 'Core/Scenarios/Feedback',
  component: UiEmptyState,
  tags: ['autodocs', '!dev'],
} satisfies Meta<typeof UiEmptyState>;

export default meta;

export const EmptyState: StoryObj<typeof UiEmptyState> = {
  render: () => ({
    components: { UiAlert, UiButton, UiCollapse, UiCollapsePanel, UiEmptyState, UiResult },
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

        <UiResult
          status="success"
          title="Core verify passed"
          subtitle="Feedback states remain explicit without product workflow logic."
        >
          <template #extra>
            <UiButton variant="secondary">Inspect proofs</UiButton>
            <UiButton>Ship changeset</UiButton>
          </template>
        </UiResult>
      </div>
    `,
  }),
};

export const ResultStates: StoryObj<typeof UiEmptyState> = {
  render: () => ({
    components: { UiResult },
    template: `
      <div
        style="
          display: grid;
          gap: var(--ui-space-4);
          grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
        "
      >
        <UiResult status="info" title="Awaiting input" subtitle="Baseline informational result" />
        <UiResult status="warning" title="Review needed" subtitle="Warning tone stays tokenized" />
        <UiResult status="404" title="Story not found" subtitle="Status presets include common empty-result cases" />
      </div>
    `,
  }),
};
