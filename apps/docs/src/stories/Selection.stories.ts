import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';

import { UiCheckbox, UiField, UiRadio, UiRadioGroup, UiSwitch } from '@ww/core';

const meta = {
  title: 'Core/Scenarios/Selection',
  component: UiCheckbox,
  tags: ['autodocs', '!dev'],
} satisfies Meta<typeof UiCheckbox>;

export default meta;

export const BooleanControls: StoryObj<typeof UiCheckbox> = {
  render: () => ({
    components: { UiCheckbox, UiField, UiRadio, UiRadioGroup, UiSwitch },
    setup() {
      const checked = ref(true);
      const enabled = ref(false);
      const stage = ref('design');
      return { checked, enabled, stage };
    },
    template: `
      <div class="ui-stack">
        <div class="ui-cluster">
          <UiCheckbox v-model="checked">Enable semantic layer</UiCheckbox>
          <UiSwitch v-model="enabled" ariaLabel="Enable runtime theming">
            Enable runtime theming
          </UiSwitch>
        </div>

        <UiField label="Release stage" hint="Arrow keys move the active radio">
          <UiRadioGroup v-model="stage" orientation="horizontal">
            <UiRadio value="design">Design</UiRadio>
            <UiRadio value="review">Review</UiRadio>
            <UiRadio value="ship">Ship</UiRadio>
          </UiRadioGroup>
        </UiField>

        <p style="margin: 0;">Selected stage: {{ stage }}</p>
      </div>
    `,
  }),
};
