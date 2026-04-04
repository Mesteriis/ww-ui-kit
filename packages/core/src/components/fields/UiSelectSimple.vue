<script setup lang="ts">
import { computed } from 'vue';

import { useId } from '@ww/primitives';

import { mergeDescribedBy, useFieldContext } from './field-context';
import UiIcon from '../display/UiIcon.vue';

defineOptions({ name: 'UiSelectSimple' });

export interface UiSelectSimpleOption {
  label: string;
  value: string;
  disabled?: boolean;
}

const props = withDefaults(
  defineProps<{
    modelValue?: string;
    id?: string;
    name?: string;
    ariaLabel?: string;
    options: UiSelectSimpleOption[];
    placeholder?: string;
    disabled?: boolean;
    invalid?: boolean;
    ariaDescribedby?: string;
  }>(),
  {
    modelValue: '',
    disabled: false,
    invalid: false,
  }
);

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const field = useFieldContext();
const fallbackId = useId('select');
const selectId = computed(() => props.id ?? field?.inputId.value ?? fallbackId.value);
const isInvalid = computed(() => props.invalid || field?.invalid.value || false);
const describedBy = computed(() =>
  mergeDescribedBy(props.ariaDescribedby, field?.describedBy.value)
);

const onChange = (event: Event) => {
  if (event.target instanceof HTMLSelectElement) {
    emit('update:modelValue', event.target.value);
  }
};
</script>

<template>
  <div class="ui-select">
    <select
      :id="selectId"
      class="ui-input ui-select__control"
      :class="{ 'is-invalid': isInvalid }"
      :name="props.name"
      :value="props.modelValue"
      :disabled="props.disabled"
      :aria-label="props.ariaLabel"
      :aria-invalid="isInvalid || undefined"
      :aria-describedby="describedBy"
      data-ui-motion="ring-focus-soft"
      @change="onChange"
    >
      <option v-if="props.placeholder" disabled value="">
        {{ props.placeholder }}
      </option>
      <option
        v-for="option in props.options"
        :key="option.value"
        :value="option.value"
        :disabled="option.disabled"
      >
        {{ option.label }}
      </option>
    </select>
    <UiIcon class="ui-select__icon" name="chevronDown" decorative />
  </div>
</template>
