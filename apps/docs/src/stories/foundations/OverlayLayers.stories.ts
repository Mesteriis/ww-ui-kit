import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { computed, ref } from 'vue';

import {
  UiBadge,
  UiButton,
  UiCard,
  UiContextMenu,
  UiDialog,
  UiDrawer,
  UiDropdown,
  UiPopconfirm,
  UiPopover,
  UiToast,
  UiTooltip,
} from '@ww/core';
import { readOverlayLayerScale, resolveOverlayLayerSlots } from '@ww/primitives';

const meta = {
  title: 'Foundations/Overlay Layers',
  tags: ['autodocs'],
} satisfies Meta;

export default meta;

export const LayerScaleAndNestedStack: StoryObj = {
  render: () => ({
    components: {
      UiBadge,
      UiButton,
      UiCard,
      UiContextMenu,
      UiDialog,
      UiDrawer,
      UiDropdown,
      UiPopconfirm,
      UiPopover,
      UiToast,
      UiTooltip,
    },
    setup() {
      const drawerOpen = ref(false);
      const dialogOpen = ref(false);
      const popoverOpen = ref(false);
      const lastContextAction = ref('none');
      const lastPopconfirmOutcome = ref('waiting');
      const toastRef = ref<{
        push: (payload: {
          title: string;
          description?: string;
          type?: 'info' | 'success' | 'warning' | 'error';
        }) => string;
      } | null>(null);
      const lastAction = ref('review');
      const scale = computed(() => readOverlayLayerScale());
      const firstModal = computed(() => resolveOverlayLayerSlots(0, 'modal'));
      const secondModal = computed(() => resolveOverlayLayerSlots(1, 'modal'));
      const floatingLayer = computed(() => resolveOverlayLayerSlots(0, 'floating'));
      const toastLayer = computed(() => resolveOverlayLayerSlots(0, 'toast'));
      const dropdownItems = [
        { label: 'Review queue', value: 'review' },
        { label: 'Promote release', value: 'promote' },
        { type: 'divider' as const },
        {
          type: 'group' as const,
          label: 'Deploy',
          items: [
            { label: 'Bravo', value: 'bravo' },
            { label: 'Charlie', value: 'charlie' },
          ],
        },
      ];
      const contextMenuItems = [
        { label: 'Inspect release', value: 'inspect' },
        { label: 'Archive release', value: 'archive' },
      ];

      const onSelect = (payload: { label: string }) => {
        lastAction.value = payload.label;
      };

      const onContextSelect = (payload: { label: string }) => {
        lastContextAction.value = payload.label;
      };

      const onPopconfirmCancel = () => {
        lastPopconfirmOutcome.value = 'canceled';
      };

      const onPopconfirmConfirm = () => {
        lastPopconfirmOutcome.value = 'confirmed';
      };

      const pushToast = () => {
        toastRef.value?.push({
          title: 'Toast layer proof',
          description: 'Toast surfaces stay above floating layers without raw z-index overrides.',
          type: 'info',
        });
      };

      return {
        contextMenuItems,
        dialogOpen,
        drawerOpen,
        dropdownItems,
        firstModal,
        floatingLayer,
        lastContextAction,
        lastAction,
        lastPopconfirmOutcome,
        onContextSelect,
        onPopconfirmCancel,
        onPopconfirmConfirm,
        onSelect,
        popoverOpen,
        pushToast,
        scale,
        secondModal,
        toastRef,
        toastLayer,
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
          <template #header>Floating and toast proofs</template>
          <div class="ui-stack">
            <div class="ui-cluster">
              <UiTooltip content="Tooltip surfaces occupy the dedicated tooltip layer.">
                <UiButton variant="secondary">Hover for tooltip</UiButton>
              </UiTooltip>
              <UiPopover v-model:open="popoverOpen" width="trigger">
                <template #trigger>
                  <UiButton variant="secondary">Open floating popover</UiButton>
                </template>
                <p style="margin: 0; max-width: 16rem;">
                  Floating surfaces resolve above modal backdrops but below toast stacks.
                </p>
              </UiPopover>
              <UiDropdown :items="dropdownItems" @select="onSelect">
                <template #trigger>
                  <UiButton variant="secondary">Open action dropdown</UiButton>
                </template>
              </UiDropdown>
              <UiPopconfirm
                title="Delete release?"
                description="Popconfirm stays on the floating layer."
                confirm-text="Delete"
                cancel-text="Keep"
                confirm-variant="danger"
                @cancel="onPopconfirmCancel"
                @confirm="onPopconfirmConfirm"
              >
                <template #trigger>
                  <UiButton variant="danger">Delete release</UiButton>
                </template>
              </UiPopconfirm>
              <UiContextMenu :items="contextMenuItems" @select="onContextSelect">
                <template #trigger>
                  <UiButton variant="secondary">Right-click release tools</UiButton>
                </template>
              </UiContextMenu>
              <UiButton @click="pushToast">Fire toast</UiButton>
            </div>
            <p style="margin: 0;">Last floating action: {{ lastAction }}</p>
            <p style="margin: 0;">Popconfirm outcome: {{ lastPopconfirmOutcome }}</p>
            <p style="margin: 0;">Context menu action: {{ lastContextAction }}</p>
          </div>
          <UiToast ref="toastRef" />
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
    `,
  }),
};
