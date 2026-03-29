import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';

import { UiField, UiInput, UiSelectSimple, UiTextarea } from '@ww/core';

const meta = {
  title: 'Core/Fields',
  component: UiField
} satisfies Meta<typeof UiField>;

export default meta;

export const Inputs: StoryObj<typeof UiField> = {
  render: () => ({
    components: { UiField, UiInput, UiTextarea, UiSelectSimple },
    setup() {
      const name = ref('Belovodye UiKit foundation');
      const description = ref('Source of truth lives in stories.');
      const selected = ref('tokens');

      return {
        description,
        name,
        options: [
          { label: 'Tokens', value: 'tokens' },
          { label: 'Themes', value: 'themes' },
          { label: 'Core', value: 'core' }
        ],
        selected
      };
    },
    template: `
      <div class="ui-stack" style="max-width: 28rem;">
        <UiField label="Name" hint="Associated with the control through context">
          <UiInput v-model="name" />
        </UiField>
        <UiField label="Description" error="Shows hint and error wiring">
          <UiTextarea v-model="description" />
        </UiField>
        <UiField label="Area">
          <UiSelectSimple v-model="selected" :options="options" />
        </UiField>
      </div>
    `
  })
};
