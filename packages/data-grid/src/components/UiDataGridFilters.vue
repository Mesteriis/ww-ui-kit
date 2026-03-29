<script setup lang="ts">
import { UiSelectSimple } from '@ww/core';

import type { DataGridFilterDefinition, DataGridFilterValue } from '../model/types';

defineOptions({ name: 'UiDataGridFilters' });

const props = withDefaults(
  defineProps<{
    definitions: readonly DataGridFilterDefinition[];
    filters: Record<string, DataGridFilterValue>;
    disabled?: boolean;
  }>(),
  {
    disabled: false
  }
);

const emit = defineEmits<{
  updateFilter: [filterId: string, value: DataGridFilterValue | undefined];
}>();

const toSelectOptions = (definition: DataGridFilterDefinition): Array<{ label: string; value: string }> => {
  if (definition.type === 'boolean') {
    return [
      { label: definition.trueLabel ?? 'Yes', value: 'true' },
      { label: definition.falseLabel ?? 'No', value: 'false' }
    ];
  }

  if (definition.type === 'select' || definition.type === 'multi-select') {
    return definition.options.map((option) => ({
      label: option.label,
      value: option.value
    }));
  }

  return [];
};

const toSelectValue = (value: DataGridFilterValue | undefined): string => {
  if (value === true) {
    return 'true';
  }

  if (value === false) {
    return 'false';
  }

  return typeof value === 'string' ? value : '';
};

const toMultiSelectValue = (value: DataGridFilterValue | undefined): string[] => {
  return Array.isArray(value) ? Array.from(value as readonly string[]) : [];
};

const onMultiSelect = (definitionId: string, event: Event) => {
  if (!(event.target instanceof HTMLSelectElement)) {
    return;
  }

  emit(
    'updateFilter',
    definitionId,
    Array.from(event.target.selectedOptions, (option) => option.value)
  );
};

const onSelect = (definition: DataGridFilterDefinition, value: string) => {
  if (definition.type === 'boolean') {
    emit('updateFilter', definition.id, value === '' ? undefined : value === 'true');
    return;
  }

  emit('updateFilter', definition.id, value || undefined);
};

const onTextInput = (definitionId: string, event: Event) => {
  if (!(event.target instanceof HTMLInputElement)) {
    emit('updateFilter', definitionId, undefined);
    return;
  }

  emit('updateFilter', definitionId, event.target.value);
};
</script>

<template>
  <div v-if="props.definitions.length > 0" class="ui-data-grid-filters">
    <label
      v-for="definition in props.definitions"
      :key="definition.id"
      class="ui-data-grid-filters__field"
    >
      <span class="ui-data-grid-filters__label">{{ definition.label }}</span>

      <input
        v-if="definition.type === 'text'"
        class="ui-input ui-data-grid-filters__control"
        type="text"
        :value="typeof props.filters[definition.id] === 'string' ? props.filters[definition.id] : ''"
        :placeholder="definition.placeholder"
        :disabled="props.disabled"
        @input="onTextInput(definition.id, $event)"
      />

      <UiSelectSimple
        v-else-if="definition.type === 'select' || definition.type === 'boolean'"
        :model-value="toSelectValue(props.filters[definition.id])"
        :options="toSelectOptions(definition)"
        :placeholder="definition.type === 'boolean' ? 'All' : definition.placeholder ?? 'All'"
        :disabled="props.disabled"
        @update:model-value="onSelect(definition, $event)"
      />

      <select
        v-else
        class="ui-input ui-data-grid-filters__control ui-data-grid-filters__control--multi"
        multiple
        :disabled="props.disabled"
        @change="onMultiSelect(definition.id, $event)"
      >
        <option
          v-for="option in toSelectOptions(definition)"
          :key="option.value"
          :value="option.value"
          :selected="toMultiSelectValue(props.filters[definition.id]).includes(option.value)"
        >
          {{ option.label }}
        </option>
      </select>
    </label>
  </div>
</template>
