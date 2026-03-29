import type { Meta, StoryObj } from '@storybook/vue3';

import { UiButton, UiEmptyState } from '@ww/core';

const meta = {
  title: 'Core/Feedback',
  component: UiEmptyState,
} satisfies Meta<typeof UiEmptyState>;

export default meta;

export const EmptyState: StoryObj<typeof UiEmptyState> = {
  render: () => ({
    components: { UiButton, UiEmptyState },
    template: `
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
    `,
  }),
};
