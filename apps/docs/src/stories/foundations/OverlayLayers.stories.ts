import type { Meta, StoryObj } from '@storybook/vue3';
import { computed, ref } from 'vue';

import { UiBadge, UiButton, UiCard, UiDialog, UiDrawer } from '@ww/core';
import { readOverlayLayerScale, resolveOverlayLayerSlots } from '@ww/primitives';

const meta = {
  title: 'Foundations/Overlay Layers',
  tags: ['autodocs']
} satisfies Meta;

export default meta;

export const LayerScaleAndNestedStack: StoryObj = {
  render: () => ({
    components: { UiBadge, UiButton, UiCard, UiDialog, UiDrawer },
    setup() {
      const drawerOpen = ref(false);
      const dialogOpen = ref(false);
      const scale = computed(() => readOverlayLayerScale());
      const firstModal = computed(() => resolveOverlayLayerSlots(0, 'modal'));
      const secondModal = computed(() => resolveOverlayLayerSlots(1, 'modal'));
      const floatingLayer = computed(() => resolveOverlayLayerSlots(0, 'floating'));
      const toastLayer = computed(() => resolveOverlayLayerSlots(0, 'toast'));

      return {
        dialogOpen,
        drawerOpen,
        firstModal,
        floatingLayer,
        scale,
        secondModal,
        toastLayer
      };
    },
    template: `
      <div class="ui-stack">
        <UiCard>
          <template #header>Layer scale</template>
          <div class="ui-cluster">
            <UiBadge>base {{ scale.base }}</UiBadge>
            <UiBadge variant="brand">step {{ scale.step }}</UiBadge>
            <UiBadge variant="success">surface {{ scale.surface }}</UiBadge>
            <UiBadge variant="warning">tooltip {{ scale.tooltip }}</UiBadge>
            <UiBadge variant="danger">toast {{ scale.toast }}</UiBadge>
          </div>
          <div
            style="
              position: relative;
              min-height: 14rem;
              margin-top: var(--ui-space-4);
              border: 1px dashed var(--ui-border-subtle);
              border-radius: var(--ui-radius-xl);
              background: var(--ui-surface-sunken);
            "
          >
            <div
              style="
                position: absolute;
                inset: auto auto 1rem 1rem;
                padding: var(--ui-space-4);
                border-radius: var(--ui-radius-lg);
                background: color-mix(in srgb, var(--ui-surface-default) 92%, transparent);
                z-index: 100;
              "
            >
              Header layer {{ scale.base - 3900 }}
            </div>
            <div
              :style="{
                position: 'absolute',
                inset: '1.5rem auto auto 1.5rem',
                padding: 'var(--ui-space-4)',
                borderRadius: 'var(--ui-radius-lg)',
                background: 'var(--ui-surface-default)',
                zIndex: String(firstModal.backdrop)
              }"
            >
              Modal backdrop slot {{ firstModal.backdrop }}
            </div>
            <div
              :style="{
                position: 'absolute',
                inset: '3.5rem auto auto 3.5rem',
                padding: 'var(--ui-space-4)',
                borderRadius: 'var(--ui-radius-lg)',
                background: 'var(--ui-surface-raised)',
                boxShadow: 'var(--ui-elevation-surface-raised)',
                zIndex: String(firstModal.content)
              }"
            >
              Modal surface slot {{ firstModal.content }}
            </div>
            <div
              :style="{
                position: 'absolute',
                inset: '2rem 1.5rem auto auto',
                padding: 'var(--ui-space-4)',
                borderRadius: 'var(--ui-radius-lg)',
                background: 'var(--ui-surface-brand-soft)',
                zIndex: String(floatingLayer.content)
              }"
            >
              Floating slot {{ floatingLayer.content }}
            </div>
            <div
              :style="{
                position: 'absolute',
                inset: 'auto 1.5rem 1.5rem auto',
                padding: 'var(--ui-space-4)',
                borderRadius: 'var(--ui-radius-lg)',
                background: 'var(--ui-surface-warning-soft)',
                zIndex: String(toastLayer.content)
              }"
            >
              Toast slot {{ toastLayer.content }}
            </div>
            <div
              :style="{
                position: 'absolute',
                inset: '5.5rem auto auto 5.5rem',
                padding: 'var(--ui-space-4)',
                borderRadius: 'var(--ui-radius-lg)',
                background: 'var(--ui-surface-danger-soft)',
                zIndex: String(secondModal.content)
              }"
            >
              Nested modal surface {{ secondModal.content }}
            </div>
          </div>
        </UiCard>

        <UiCard>
          <template #header>Nested overlay stack</template>
          <div class="ui-cluster">
            <UiButton @click="drawerOpen = true">Open drawer</UiButton>
          </div>
          <UiDrawer v-model:open="drawerOpen" title="Drawer layer">
            <div class="ui-stack">
              <p>Drawer content sits on the first modal surface layer.</p>
              <UiButton variant="secondary" @click="dialogOpen = true">Open nested dialog</UiButton>
            </div>
            <UiDialog v-model:open="dialogOpen" title="Nested dialog">
              <p>The nested dialog increments the stack and owns topmost dismiss behavior.</p>
              <template #footer>
                <UiButton variant="secondary" @click="dialogOpen = false">Close dialog</UiButton>
              </template>
            </UiDialog>
          </UiDrawer>
        </UiCard>
      </div>
    `
  })
};
