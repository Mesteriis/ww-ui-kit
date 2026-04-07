import type { Meta, StoryObj } from '@storybook/vue3-vite';

import { UiBadge, UiCard } from '@ww/core';
import { UiTsParticlesBackdrop } from '@ww/tsparticles';

import { calmParticlesOptions, overviewParticlesOptions } from './particles-fixtures';

const meta = {
  title: 'Foundations/Particles/States',
  tags: ['autodocs', '!dev'],
} satisfies Meta<typeof UiTsParticlesBackdrop>;

export default meta;

export const States: StoryObj<typeof UiTsParticlesBackdrop> = {
  render: () => ({
    components: { UiBadge, UiCard, UiTsParticlesBackdrop },
    setup() {
      return {
        calmParticlesOptions,
        overviewParticlesOptions,
      };
    },
    template: `
      <div style="display: grid; gap: var(--ui-space-6); grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));">
        <UiCard>
          <template #header>Default runtime</template>
          <UiTsParticlesBackdrop :options="overviewParticlesOptions">
            <div style="display: grid; gap: var(--ui-space-3); padding: var(--ui-space-5);">
              <UiBadge variant="brand">Active</UiBadge>
              <p style="margin: 0; color: var(--ui-text-secondary);">
                Decorative particles mount on the client and stay behind the content.
              </p>
            </div>
          </UiTsParticlesBackdrop>
        </UiCard>

        <UiCard>
          <template #header>Disabled</template>
          <UiTsParticlesBackdrop disabled :options="overviewParticlesOptions">
            <div style="display: grid; gap: var(--ui-space-3); padding: var(--ui-space-5);">
              <UiBadge>Disabled</UiBadge>
              <p style="margin: 0; color: var(--ui-text-secondary);">
                Consumers can keep the wrapper footprint while suppressing the vendor layer.
              </p>
            </div>
          </UiTsParticlesBackdrop>
        </UiCard>

        <UiCard>
          <template #header>Reduced-motion contract</template>
          <UiTsParticlesBackdrop :options="calmParticlesOptions">
            <div style="display: grid; gap: var(--ui-space-3); padding: var(--ui-space-5);">
              <UiBadge variant="warning">System motion sensitive</UiBadge>
              <p style="margin: 0; color: var(--ui-text-secondary);">
                The wrapper keeps a static decorative backdrop and disables particle movement when the system requests reduced motion.
              </p>
            </div>
          </UiTsParticlesBackdrop>
        </UiCard>
      </div>
    `,
  }),
};
