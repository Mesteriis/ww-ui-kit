import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';

import { UiCheckbox, UiSwitch } from '@ww/core';

const meta = {
  title: 'Core/Selection',
  component: UiCheckbox
} satisfies Meta<typeof UiCheckbox>;

export default meta;

export const BooleanControls: StoryObj<typeof UiCheckbox> = {
  render: () => ({
    components: { UiCheckbox, UiSwitch },
    setup() {
      const checked = ref(true);
      const enabled = ref(false);
      return { checked, enabled };
    },
    template: `
      <div class="ui-stack">
        <UiCheckbox v-model="checked">Enable semantic layer</UiCheckbox>
        <UiSwitch v-model="enabled" ariaLabel="Enable runtime theming">Enable runtime theming</UiSwitch>
      </div>
    `
  })
};
