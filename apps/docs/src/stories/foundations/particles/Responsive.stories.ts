import type { Meta, StoryObj } from '@storybook/vue3';

import { UiBadge, UiCard } from '@ww/core';
import { UiHorizontalLayout, UiVerticalLayout } from '@ww/page-templates';
import { UiTsParticlesBackdrop } from '@ww/tsparticles';

import { calmParticlesOptions } from './particles-fixtures';

const meta = {
  title: 'Foundations/Particles/Responsive',
  tags: ['autodocs'],
} satisfies Meta<typeof UiTsParticlesBackdrop>;

export default meta;

export const Responsive: StoryObj<typeof UiTsParticlesBackdrop> = {
  render: () => ({
    components: { UiBadge, UiCard, UiHorizontalLayout, UiTsParticlesBackdrop, UiVerticalLayout },
    setup() {
      return {
        calmParticlesOptions,
      };
    },
    template: `
      <div style="display: grid; gap: var(--ui-space-6); grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));">
        <UiCard>
          <template #header>Narrow parent</template>
          <div style="max-inline-size: 16rem;">
            <UiTsParticlesBackdrop :options="calmParticlesOptions">
              <div style="display: grid; gap: var(--ui-space-4); padding: var(--ui-space-5);">
                <UiBadge variant="brand">Auto width</UiBadge>
                <UiVerticalLayout gap="var(--ui-space-2)">
                  <UiBadge>Follows parent width</UiBadge>
                  <UiBadge>Does not inject padding</UiBadge>
                  <UiBadge>Decorative only</UiBadge>
                </UiVerticalLayout>
              </div>
            </UiTsParticlesBackdrop>
          </div>
        </UiCard>

        <UiCard>
          <template #header>Wide parent</template>
          <UiTsParticlesBackdrop :options="calmParticlesOptions">
            <div style="display: grid; gap: var(--ui-space-4); padding: var(--ui-space-5);">
              <UiBadge variant="brand">Flexible width</UiBadge>
              <UiHorizontalLayout gap="var(--ui-space-3)">
                <UiBadge>Respects parent geometry</UiBadge>
                <UiBadge>Backdrop stays behind content</UiBadge>
                <UiBadge>No full-screen takeover</UiBadge>
              </UiHorizontalLayout>
            </div>
          </UiTsParticlesBackdrop>
        </UiCard>
      </div>
    `,
  }),
};
