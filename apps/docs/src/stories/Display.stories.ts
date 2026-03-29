import type { Meta, StoryObj } from '@storybook/vue3';

import { UiBadge, UiCard, UiDivider, UiSkeleton, UiSpinner } from '@ww/core';

const meta = {
  title: 'Core/Display',
  component: UiCard
} satisfies Meta<typeof UiCard>;

export default meta;

export const SurfacesAndStatus: StoryObj<typeof UiCard> = {
  render: () => ({
    components: { UiBadge, UiCard, UiDivider, UiSkeleton, UiSpinner },
    template: `
      <div class="ui-stack">
        <div class="ui-cluster">
          <UiBadge>Neutral</UiBadge>
          <UiBadge variant="brand">Brand</UiBadge>
          <UiBadge variant="success">Success</UiBadge>
          <UiBadge variant="warning">Warning</UiBadge>
          <UiBadge variant="danger">Danger</UiBadge>
        </div>
        <UiCard>
          <template #header>Surface baseline</template>
          <p>Cards, dividers, spinners, and skeletons stay theme-agnostic.</p>
          <UiDivider />
          <div class="ui-cluster">
            <UiSpinner size="sm" />
            <UiSpinner />
            <UiSpinner size="lg" />
          </div>
          <UiSkeleton width="100%" height="1rem" />
          <UiSkeleton width="4rem" height="4rem" shape="circle" />
        </UiCard>
      </div>
    `
  })
};
