import type { Meta, StoryObj } from '@storybook/vue3';
import { onMounted, ref } from 'vue';

import { UiBadge, UiButton, UiCard } from '@ww/core';
import { PrimitiveFocusTrap, PrimitivePortal, PrimitiveVisuallyHidden } from '@ww/primitives';

const meta = {
  title: 'Foundations/Primitives/Overview',
  tags: ['autodocs'],
} satisfies Meta;

export default meta;

export const Overview: StoryObj = {
  render: () => ({
    components: {
      PrimitiveFocusTrap,
      PrimitivePortal,
      PrimitiveVisuallyHidden,
      UiBadge,
      UiButton,
      UiCard,
    },
    setup() {
      const portalDisabled = ref(false);
      const portalReady = ref(false);
      const trapOpen = ref(false);

      onMounted(() => {
        portalReady.value = true;
      });

      const openTrap = () => {
        trapOpen.value = true;
      };

      const closeTrap = () => {
        trapOpen.value = false;
      };

      return {
        closeTrap,
        openTrap,
        portalDisabled,
        portalReady,
        trapOpen,
      };
    },
    template: `
      <div class="ui-stack">
        <UiCard>
          <template #header>PrimitivePortal</template>
          <div class="ui-stack">
            <p style="margin: 0; max-width: 42rem;">
              The portal mounts content into a chosen target after hydration and can be disabled to keep
              the subtree inline.
            </p>
            <div class="ui-cluster">
              <UiButton variant="secondary" @click="portalDisabled = !portalDisabled">
                {{ portalDisabled ? 'Enable portal target' : 'Disable portal target' }}
              </UiButton>
              <UiBadge :variant="portalDisabled ? 'warning' : 'success'">
                {{ portalDisabled ? 'inline fallback' : 'teleported to custom target' }}
              </UiBadge>
            </div>
            <div
              style="
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
                gap: var(--ui-space-4);
              "
            >
              <div
                id="primitive-portal-target"
                style="
                  display: grid;
                  gap: var(--ui-space-3);
                  min-height: 7rem;
                  padding: var(--ui-space-4);
                  border: 1px solid var(--ui-border-subtle);
                  border-radius: var(--ui-radius-lg);
                  background: var(--ui-surface-default);
                "
              >
                <strong>Custom portal target</strong>
                <p style="margin: 0; color: var(--ui-text-secondary);">
                  This region receives the teleported subtree when portal resolution is active.
                </p>
              </div>

              <div
                style="
                  display: grid;
                  gap: var(--ui-space-3);
                  padding: var(--ui-space-4);
                  border: 1px dashed var(--ui-border-subtle);
                  border-radius: var(--ui-radius-lg);
                  background: var(--ui-surface-sunken);
                "
              >
                <strong>Story tree</strong>
                <PrimitivePortal
                  v-if="portalReady"
                  to="#primitive-portal-target"
                  :disabled="portalDisabled"
                >
                  <div
                    style="
                      display: inline-flex;
                      align-items: center;
                      gap: var(--ui-space-2);
                      padding: var(--ui-space-2) var(--ui-space-3);
                      border-radius: var(--ui-radius-full);
                      background: var(--ui-surface-brand-soft);
                      color: var(--ui-text-primary);
                    "
                  >
                    Teleported proof
                  </div>
                </PrimitivePortal>
                <p style="margin: 0; color: var(--ui-text-secondary);">
                  When disabled, the badge stays inline inside this card.
                </p>
              </div>
            </div>
          </div>
        </UiCard>

        <UiCard>
          <template #header>PrimitiveFocusTrap</template>
          <div class="ui-stack">
            <p style="margin: 0; max-width: 42rem;">
              The trap focuses the first available control, loops <code>Tab</code> inside the active
              region, and restores focus to the launch button when the trap unmounts.
            </p>
            <div class="ui-cluster">
              <UiButton @click="openTrap">Open trapped region</UiButton>
              <UiBadge variant="brand">{{ trapOpen ? 'active' : 'idle' }}</UiBadge>
            </div>

            <PrimitiveFocusTrap v-if="trapOpen">
              <div
                style="
                  display: grid;
                  gap: var(--ui-space-3);
                  padding: var(--ui-space-4);
                  border: 1px solid var(--ui-border-subtle);
                  border-radius: var(--ui-radius-xl);
                  background: var(--ui-surface-raised);
                  box-shadow: var(--ui-elevation-surface-raised);
                "
              >
                <strong>Keyboard loop proof</strong>
                <p style="margin: 0; color: var(--ui-text-secondary);">
                  Press <code>Tab</code> to cycle through the actions. Closing the region restores focus
                  to the launcher.
                </p>
                <div class="ui-cluster">
                  <UiButton variant="secondary">Primary action</UiButton>
                  <UiButton variant="secondary">Secondary action</UiButton>
                  <UiButton @click="closeTrap">Close trap</UiButton>
                </div>
              </div>
            </PrimitiveFocusTrap>
          </div>
        </UiCard>

        <UiCard>
          <template #header>PrimitiveVisuallyHidden</template>
          <div class="ui-stack">
            <p style="margin: 0; max-width: 42rem;">
              Visually hidden content stays available to assistive technology without adding visible copy
              to compact controls.
            </p>
            <div class="ui-cluster">
              <button
                type="button"
                style="
                  display: inline-flex;
                  align-items: center;
                  justify-content: center;
                  width: 2.75rem;
                  height: 2.75rem;
                  border: 1px solid var(--ui-border-subtle);
                  border-radius: var(--ui-radius-full);
                  background: var(--ui-surface-default);
                  color: var(--ui-text-primary);
                  font-size: 1.125rem;
                "
              >
                ⟳
                <PrimitiveVisuallyHidden>Refresh deployment status</PrimitiveVisuallyHidden>
              </button>
              <UiBadge variant="success">Visible glyph only</UiBadge>
              <UiBadge>Accessible name: Refresh deployment status</UiBadge>
            </div>
          </div>
        </UiCard>
      </div>
    `,
  }),
};
