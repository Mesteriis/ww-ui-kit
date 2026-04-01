<script setup lang="ts">
import { UiBadge, UiButton, UiCard } from '@ww/core';
import {
  UiHorizontalLayout,
  UiLayout,
  UiLayoutContent,
  UiLayoutFooter,
  UiLayoutHeader,
  UiVerticalLayout,
} from '@ww/page-templates';
import { UiTsParticlesBackdrop, type UiTsParticlesBackdropOptions } from '@ww/tsparticles';

const overviewOptions: UiTsParticlesBackdropOptions = {
  particles: {
    links: {
      opacity: 0.16,
    },
    move: {
      speed: 0.22,
    },
    number: {
      value: 22,
    },
    opacity: {
      value: 0.24,
    },
    size: {
      value: {
        min: 1,
        max: 2,
      },
    },
  },
};

const layoutOptions: UiTsParticlesBackdropOptions = {
  particles: {
    links: {
      distance: 112,
      opacity: 0.18,
    },
    move: {
      speed: 0.16,
    },
    number: {
      value: 40,
    },
    opacity: {
      value: 0.28,
    },
    size: {
      value: {
        min: 1,
        max: 3,
      },
    },
  },
};

const flowItems = ['Neutral wrapper', 'Layout-safe', 'Token-driven', 'Client-only'] as const;
const quickActions = ['Review lane', 'Approve', 'Ship'] as const;
</script>

<template>
  <section
    id="testing-particles"
    class="playground__layer-stack"
    data-playground-scenario="particles"
  >
    <UiCard>
      <template #header>tsParticles backdrop overview</template>
      <div
        style="
          display: grid;
          gap: var(--ui-space-6);
          grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));
        "
      >
        <UiTsParticlesBackdrop :options="overviewOptions">
          <div style="display: grid; gap: var(--ui-space-4); padding: var(--ui-space-5)">
            <div class="ui-cluster">
              <UiBadge variant="brand">UiTsParticlesBackdrop</UiBadge>
              <UiBadge>size="auto"</UiBadge>
            </div>
            <div style="display: grid; gap: var(--ui-space-2)">
              <h2 style="margin: 0">Decorative backdrop wrapper</h2>
              <p style="margin: 0; color: var(--ui-text-secondary)">
                The vendor canvas sits behind content, keeps pointer events clear, and resolves
                colors from the current token scope.
              </p>
            </div>
            <UiHorizontalLayout gap="var(--ui-space-3)">
              <UiBadge v-for="item in flowItems" :key="item" variant="brand">
                {{ item }}
              </UiBadge>
            </UiHorizontalLayout>
          </div>
        </UiTsParticlesBackdrop>

        <div data-ui-theme="belovodye" data-ui-theme-type="dark">
          <UiTsParticlesBackdrop
            :options="overviewOptions"
            particle-color-var="--ui-text-primary"
            link-color-var="--ui-border-strong"
          >
            <div style="display: grid; gap: var(--ui-space-4); padding: var(--ui-space-5)">
              <div class="ui-cluster">
                <UiBadge variant="brand">Scoped theme</UiBadge>
                <UiBadge>Belovodye</UiBadge>
              </div>
              <p style="margin: 0; color: var(--ui-text-secondary)">
                Scoped theme containers drive the backdrop without a second vendor-specific theming
                API.
              </p>
            </div>
          </UiTsParticlesBackdrop>
        </div>
      </div>
    </UiCard>

    <UiCard>
      <template #header>Layout compatibility proof</template>
      <div
        style="
          min-block-size: 24rem;
          border: 1px dashed var(--ui-border-subtle);
          border-radius: var(--ui-radius-xl);
          overflow: hidden;
        "
      >
        <UiTsParticlesBackdrop size="fill" :options="layoutOptions">
          <UiLayout width="full">
            <template #header>
              <UiLayoutHeader>
                <div style="display: grid; gap: var(--ui-space-2)">
                  <h2 style="margin: 0">Existing layout shells stay intact</h2>
                  <p style="margin: 0; color: var(--ui-text-secondary)">
                    The wrapper adds only a backdrop layer around layout composition. It does not
                    mutate shell spacing, routing, or scroll behavior.
                  </p>
                </div>
                <UiBadge variant="brand">size="fill"</UiBadge>
              </UiLayoutHeader>
            </template>

            <UiLayoutContent :padded="false">
              <div style="padding: var(--ui-space-5); display: grid; gap: var(--ui-space-5)">
                <UiVerticalLayout gap="var(--ui-space-3)">
                  <UiBadge v-for="item in flowItems" :key="item">
                    {{ item }}
                  </UiBadge>
                </UiVerticalLayout>

                <UiHorizontalLayout gap="var(--ui-space-3)">
                  <UiButton
                    v-for="action in quickActions"
                    :key="action"
                    size="sm"
                    variant="secondary"
                  >
                    {{ action }}
                  </UiButton>
                </UiHorizontalLayout>
              </div>
            </UiLayoutContent>

            <template #footer>
              <UiLayoutFooter
                >Proof path: Storybook, testing harness, and maintainer lab.</UiLayoutFooter
              >
            </template>
          </UiLayout>
        </UiTsParticlesBackdrop>
      </div>
    </UiCard>
  </section>
</template>
