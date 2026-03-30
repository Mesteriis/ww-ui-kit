import type { Meta, StoryObj } from '@storybook/vue3';
import { computed, ref } from 'vue';

import {
  UiAutocomplete,
  UiField,
  UiInput,
  UiNumberInput,
  UiSelect,
  UiSelectSimple,
  UiTextarea,
} from '@ww/core';

const meta = {
  title: 'Core/Fields',
  component: UiField,
} satisfies Meta<typeof UiField>;

export default meta;

export const Inputs: StoryObj<typeof UiField> = {
  render: () => ({
    components: {
      UiAutocomplete,
      UiField,
      UiInput,
      UiNumberInput,
      UiSelect,
      UiSelectSimple,
      UiTextarea,
    },
    setup() {
      const name = ref('Belovodye UiKit foundation');
      const description = ref('Source of truth lives in stories.');
      const simpleSelected = ref('tokens');
      const budget = ref<number | null>(12.5);
      const richSelected = ref<string | null>('bravo');
      const multiSelected = ref<Array<string | number>>(['tokens']);
      const autocompleteValue = ref('');

      const simpleOptions = [
        { label: 'Tokens', value: 'tokens' },
        { label: 'Themes', value: 'themes' },
        { label: 'Core', value: 'core' },
      ];

      const richOptions = [
        { label: 'Overview queue', value: 'overview', icon: '⌘', keywords: ['queue'] },
        {
          type: 'group' as const,
          label: 'Deploy lanes',
          options: [
            { label: 'Bravo lane', value: 'bravo', icon: 'B', keywords: ['deploy', 'blue'] },
            { label: 'Charlie lane', value: 'charlie', disabled: true, icon: 'C' },
          ],
        },
      ];

      const multiOptions = [
        { label: 'Tokens', value: 'tokens' },
        { label: 'Themes', value: 'themes' },
        { label: 'Core', value: 'core' },
        { label: 'Docs', value: 'docs' },
      ];

      const autocompleteItems = [
        {
          label: 'Belovodye control room',
          value: 'Belovodye control room',
          description: 'Scoped theme release surface',
          keywords: ['belovodye', 'theme'],
        },
        {
          label: 'Core wave verify',
          value: 'Core wave verify',
          description: 'Manifest, stories, playground, and tests',
          keywords: ['verify', 'core'],
        },
        {
          label: 'Bravo deploy lane',
          value: 'Bravo deploy lane',
          description: 'Menu and select collection flows',
          keywords: ['deploy', 'bravo'],
        },
      ];

      const multiSummary = computed(() =>
        multiSelected.value.length > 0 ? multiSelected.value.join(', ') : 'none'
      );

      return {
        autocompleteItems,
        autocompleteValue,
        budget,
        description,
        multiOptions,
        multiSelected,
        multiSummary,
        name,
        richOptions,
        richSelected,
        simpleOptions,
        simpleSelected,
      };
    },
    template: `
      <div class="ui-stack" style="max-width: 72rem;">
        <div
          style="
            display: grid;
            gap: var(--ui-space-4);
            grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));
          "
        >
          <UiField label="Name" hint="Associated with the control through context">
            <UiInput v-model="name" />
          </UiField>

          <UiField label="Description" error="Shows hint and error wiring">
            <UiTextarea v-model="description" />
          </UiField>

          <UiField label="Area">
            <UiSelectSimple v-model="simpleSelected" :options="simpleOptions" />
          </UiField>

          <UiField label="Budget" hint="Arrow keys, PageUp/PageDown, Home/End, clamp, and empty state">
            <UiNumberInput
              v-model="budget"
              :min="0"
              :max="40"
              :step="0.5"
              :precision="1"
              allow-empty
            />
          </UiField>

          <UiField label="Deploy lane" hint="Searchable single select on the shared floating path">
            <UiSelect
              v-model="richSelected"
              searchable
              clearable
              placeholder="Pick a lane"
              :options="richOptions"
            >
              <template #option="{ option, selected }">
                <span style="display: inline-flex; gap: var(--ui-space-2); align-items: center;">
                  <span aria-hidden="true">{{ option.icon ?? '•' }}</span>
                  <span>{{ option.label }}</span>
                  <strong v-if="selected" style="margin-inline-start: auto;">Selected</strong>
                </span>
              </template>
            </UiSelect>
          </UiField>

          <UiField label="Coverage tags" hint="Multiple selection stays beside UiSelectSimple">
            <UiSelect
              v-model="multiSelected"
              multiple
              searchable
              clearable
              placeholder="Choose tags"
              :options="multiOptions"
            />
          </UiField>

          <UiField label="Suggestion search" hint="Combobox keeps local suggestion control and Enter select">
            <UiAutocomplete v-model="autocompleteValue" :items="autocompleteItems">
              <template #item="{ item }">
                <span style="display: grid; gap: var(--ui-space-1);">
                  <strong>{{ item.label }}</strong>
                  <span style="color: var(--ui-text-secondary);">{{ item.description }}</span>
                </span>
              </template>
            </UiAutocomplete>
          </UiField>
        </div>

        <div class="ui-cluster">
          <span>Budget value: {{ budget ?? 'empty' }}</span>
          <span>Rich select: {{ richSelected ?? 'none' }}</span>
          <span>Selected tags: {{ multiSummary }}</span>
          <span>Autocomplete value: {{ autocompleteValue || 'none' }}</span>
        </div>
      </div>
    `,
  }),
};
