import type { Meta, StoryObj } from '@storybook/vue3';

import { UiBadge, UiCard } from '@ww/core';
import { UiTsParticlesBackdrop } from '@ww/tsparticles';

import { overviewParticlesOptions } from './particles-fixtures';

const meta = {
  title: 'Foundations/Particles/Theming',
  tags: ['autodocs'],
} satisfies Meta<typeof UiTsParticlesBackdrop>;

export default meta;

export const Theming: StoryObj<typeof UiTsParticlesBackdrop> = {
  render: () => ({
    components: { UiBadge, UiCard, UiTsParticlesBackdrop },
    setup() {
      return {
        overviewParticlesOptions,
      };
    },
    template: `
      <div style="display: grid; gap: var(--ui-space-6); grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));">
        <UiCard>
          <template #header>Inherited theme</template>
          <UiTsParticlesBackdrop :options="overviewParticlesOptions">
            <div style="display: grid; gap: var(--ui-space-3); padding: var(--ui-space-5);">
              <UiBadge variant="brand">Default scope</UiBadge>
              <p style="margin: 0; color: var(--ui-text-secondary);">
                Particle colors resolve from the nearest active token scope.
              </p>
            </div>
          </UiTsParticlesBackdrop>
        </UiCard>

        <UiCard>
          <template #header>Belovodye subtree</template>
          <div data-ui-theme="belovodye" data-ui-theme-type="dark">
            <UiTsParticlesBackdrop :options="overviewParticlesOptions">
              <div style="display: grid; gap: var(--ui-space-3); padding: var(--ui-space-5);">
                <UiBadge variant="brand">Scoped theme</UiBadge>
                <p style="margin: 0; color: var(--ui-text-secondary);">
                  The wrapper follows scoped theme containers without any vendor-specific theming API.
                </p>
              </div>
            </UiTsParticlesBackdrop>
          </div>
        </UiCard>

        <UiCard>
          <template #header>Dark subtree</template>
          <div data-ui-theme="dark" data-ui-theme-type="dark">
            <UiTsParticlesBackdrop
              :options="overviewParticlesOptions"
              particle-color-var="--ui-text-primary"
              link-color-var="--ui-border-strong"
            >
              <div style="display: grid; gap: var(--ui-space-3); padding: var(--ui-space-5);">
                <UiBadge variant="warning">Scoped token override</UiBadge>
                <p style="margin: 0; color: var(--ui-text-secondary);">
                  Color props stay inside sanctioned --ui-* token variables.
                </p>
              </div>
            </UiTsParticlesBackdrop>
          </div>
        </UiCard>
      </div>
    `,
  }),
};
