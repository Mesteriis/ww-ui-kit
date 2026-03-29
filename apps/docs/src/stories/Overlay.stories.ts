import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';

import { UiButton, UiDialog, UiDrawer } from '@ww/core';

const meta = {
  title: 'Core/Overlay',
  component: UiDialog,
} satisfies Meta<typeof UiDialog>;

export default meta;

export const DialogAndDrawer: StoryObj<typeof UiDialog> = {
  render: () => ({
    components: { UiButton, UiDialog, UiDrawer },
    setup() {
      const dialogOpen = ref(false);
      const drawerOpen = ref(false);
      return { dialogOpen, drawerOpen };
    },
    template: `
      <div class="ui-cluster">
        <UiButton @click="dialogOpen = true">Open dialog</UiButton>
        <UiButton variant="secondary" @click="drawerOpen = true">Open drawer</UiButton>
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
      </div>
    `,
  }),
};
