<script setup lang="ts">
import { UiInput } from '@ww/core';

defineOptions({ name: 'UiDataGridSearch' });

const props = withDefaults(
  defineProps<{
    modelValue: string;
    placeholder?: string;
    disabled?: boolean;
  }>(),
  {
    placeholder: '',
    disabled: false,
  }
);

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();
</script>

<template>
  <label class="ui-data-grid-search">
    <span class="ui-data-grid-search__label">Search</span>
    <UiInput
      type="search"
      :model-value="props.modelValue"
      :placeholder="props.placeholder"
      :disabled="props.disabled"
      @update:model-value="emit('update:modelValue', $event)"
    />
  </label>
</template>
