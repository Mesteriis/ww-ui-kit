<script setup lang="ts">
import { computed } from 'vue';

import { useId } from '@ww/primitives';

import { mergeDescribedBy, useFieldContext } from '../fields/field-context';

defineOptions({ name: 'UiCheckbox' });

const props = withDefaults(
  defineProps<{
    modelValue?: boolean;
    id?: string;
    name?: string;
    ariaLabel?: string;
    disabled?: boolean;
    invalid?: boolean;
    ariaDescribedby?: string;
  }>(),
  {
    modelValue: false,
    disabled: false,
    invalid: false,
  }
);

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
}>();

const field = useFieldContext();
const fallbackId = useId('checkbox');
const checkboxId = computed(() => props.id ?? field?.inputId.value ?? fallbackId.value);
const isInvalid = computed(() => props.invalid || field?.invalid.value || false);
const describedBy = computed(() =>
  mergeDescribedBy(props.ariaDescribedby, field?.describedBy.value)
);

const onChange = (event: Event) => {
  if (event.target instanceof HTMLInputElement) {
    emit('update:modelValue', event.target.checked);
  }
};
</script>

<template>
  <label class="ui-checkbox" :data-disabled="props.disabled || undefined">
    <input
      :id="checkboxId"
      class="ui-checkbox__input"
      type="checkbox"
      :name="props.name"
      :checked="props.modelValue"
      :disabled="props.disabled"
      :aria-label="props.ariaLabel"
      :aria-invalid="isInvalid || undefined"
      :aria-describedby="describedBy"
      @change="onChange"
    />
    <span class="ui-checkbox__control" aria-hidden="true">
      <svg class="ui-checkbox__icon" viewBox="0 0 16 16" focusable="false">
        <path d="M3.5 8.5 6.5 11.5 12.5 4.5" />
      </svg>
    </span>
    <span v-if="$slots.default" class="ui-checkbox__label">
      <slot />
    </span>
  </label>
</template>
