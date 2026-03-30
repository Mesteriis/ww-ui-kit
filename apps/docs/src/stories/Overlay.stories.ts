import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';

import { UiButton, UiDialog, UiDrawer, UiDropdown, UiPopover, UiToast, UiTooltip } from '@ww/core';

const meta = {
  title: 'Core/Overlay',
  component: UiDialog,
} satisfies Meta<typeof UiDialog>;

export default meta;

export const DialogAndDrawer: StoryObj<typeof UiDialog> = {
  render: () => ({
    components: {
      UiButton,
      UiDialog,
      UiDrawer,
      UiDropdown,
      UiPopover,
      UiToast,
      UiTooltip,
    },
    setup() {
      const dialogOpen = ref(false);
      const drawerOpen = ref(false);
      const popoverOpen = ref(false);
      const toastRef = ref<{
        push: (payload: {
          title: string;
          description?: string;
          type?: 'info' | 'success' | 'warning' | 'error';
        }) => string;
      } | null>(null);
      const lastDropdownAction = ref('Nothing selected yet.');
      const dropdownItems = [
        { label: 'Review queue', value: 'review' },
        { label: 'Escalate', value: 'escalate' },
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

      const pushToast = () => {
        toastRef.value?.push({
          title: 'Saved to the overlay proof queue',
          description: 'Toast stack stays on the shared overlay layer canon.',
          type: 'success',
        });
      };

      const onSelect = (payload: { label: string }) => {
        lastDropdownAction.value = payload.label;
      };

      return {
        dialogOpen,
        drawerOpen,
        dropdownItems,
        lastDropdownAction,
        onSelect,
        popoverOpen,
        pushToast,
        toastRef,
      };
    },
    template: `
      <div class="ui-stack">
        <div class="ui-cluster">
          <UiTooltip content="Tooltip stays on the sanctioned tooltip layer.">
            <UiButton variant="secondary">Hover for tooltip</UiButton>
          </UiTooltip>

          <UiPopover v-model:open="popoverOpen" width="trigger">
            <template #trigger>
              <UiButton>Open popover</UiButton>
            </template>
            <div class="ui-stack" style="max-width: 16rem;">
              <p style="margin: 0;">Escape closes the surface and returns focus to the trigger.</p>
              <UiButton size="sm" variant="secondary" @click="popoverOpen = false">
                Close popover
              </UiButton>
            </div>
          </UiPopover>

          <UiDropdown :items="dropdownItems" @select="onSelect">
            <template #trigger>
              <UiButton variant="secondary">Open action menu</UiButton>
            </template>
          </UiDropdown>

          <UiButton variant="ghost" @click="pushToast">Show toast</UiButton>
        </div>

        <p style="margin: 0;">Last dropdown action: {{ lastDropdownAction }}</p>

        <div class="ui-cluster">
          <UiButton @click="dialogOpen = true">Open dialog</UiButton>
          <UiButton variant="secondary" @click="drawerOpen = true">Open drawer</UiButton>
        </div>

        <UiDialog v-model:open="dialogOpen" title="Dialog">
          <p>Focus stays trapped until close.</p>
          <template #footer>
            <UiButton variant="secondary" @click="dialogOpen = false">Cancel</UiButton>
            <UiButton @click="dialogOpen = false">Confirm</UiButton>
          </template>
        </UiDialog>

        <UiDrawer v-model:open="drawerOpen" title="Drawer" side="right">
          <p>Drawer shares the same primitives.</p>
          <template #footer>
            <UiButton variant="secondary" @click="drawerOpen = false">Close</UiButton>
          </template>
        </UiDrawer>

        <UiToast ref="toastRef" />
      </div>
    `,
  }),
};
