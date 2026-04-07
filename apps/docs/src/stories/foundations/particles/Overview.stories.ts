import type { Meta, StoryObj } from '@storybook/vue3-vite';

import { UiBadge, UiCard } from '@ww/core';
import {
  UiLayout,
  UiLayoutContent,
  UiLayoutFooter,
  UiLayoutHeader,
  UiVerticalLayout,
} from '@ww/page-templates';
import { UiTsParticlesBackdrop } from '@ww/tsparticles';

import { denseParticlesOptions, overviewParticlesOptions } from './particles-fixtures';

const meta = {
  title: 'Foundations/Particles/Overview',
  tags: ['autodocs', '!dev'],
} satisfies Meta<typeof UiTsParticlesBackdrop>;

export default meta;

export const Overview: StoryObj<typeof UiTsParticlesBackdrop> = {
  render: () => ({
    components: {
      UiBadge,
      UiCard,
      UiLayout,
      UiLayoutContent,
      UiLayoutFooter,
      UiLayoutHeader,
      UiTsParticlesBackdrop,
      UiVerticalLayout,
    },
    setup() {
      return {
        denseParticlesOptions,
        overviewParticlesOptions,
      };
    },
    template: `
      <div style="display: grid; gap: var(--ui-space-6); grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));">
        <UiCard>
          <template #header>Auto surface</template>
          <UiTsParticlesBackdrop :options="overviewParticlesOptions">
            <div style="display: grid; gap: var(--ui-space-4); padding: var(--ui-space-5);">
              <div class="ui-cluster">
                <UiBadge variant="brand">UiTsParticlesBackdrop</UiBadge>
                <UiBadge>size="auto"</UiBadge>
              </div>
              <div style="display: grid; gap: var(--ui-space-2);">
                <h3 style="margin: 0">Decorative token-driven backdrop</h3>
                <p style="margin: 0; color: var(--ui-text-secondary);">
                  The wrapper stays pointer-neutral and keeps the slot content in front.
                </p>
              </div>
            </div>
          </UiTsParticlesBackdrop>
        </UiCard>

        <UiCard>
          <template #header>Layout compatibility</template>
          <div
            style="
              min-block-size: 22rem;
              border: 1px dashed var(--ui-border-subtle);
              border-radius: var(--ui-radius-xl);
              overflow: hidden;
            "
          >
            <UiTsParticlesBackdrop size="fill" :options="denseParticlesOptions">
              <UiLayout width="full">
                <template #header>
                  <UiLayoutHeader>
                    <div style="display: grid; gap: var(--ui-space-2);">
                      <h3 style="margin: 0">Layout shell inside the wrapper</h3>
                      <p style="margin: 0; color: var(--ui-text-secondary);">
                        Particle rendering stays behind the existing layout family instead of mutating it.
                      </p>
                    </div>
                    <UiBadge variant="brand">size="fill"</UiBadge>
                  </UiLayoutHeader>
                </template>

                <UiLayoutContent :padded="false">
                  <div style="padding: var(--ui-space-5);">
                    <UiVerticalLayout gap="var(--ui-space-3)">
                      <UiBadge variant="brand">Neutral wrapper</UiBadge>
                      <UiBadge>Layout-safe</UiBadge>
                      <UiBadge>Theme-aware</UiBadge>
                    </UiVerticalLayout>
                  </div>
                </UiLayoutContent>

                <template #footer>
                  <UiLayoutFooter>Wrapper adds only the backdrop layer.</UiLayoutFooter>
                </template>
              </UiLayout>
            </UiTsParticlesBackdrop>
          </div>
        </UiCard>
      </div>
    `,
  }),
};
