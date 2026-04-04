<script setup lang="ts">
import { computed } from 'vue';

import { useId } from '@ww/primitives';

import { mergeDescribedBy, useFieldContext } from '../fields/field-context';
import UiIcon from '../display/UiIcon.vue';

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
      <UiIcon class="ui-checkbox__icon" name="check" decorative />
    </span>
    <span v-if="$slots.default" class="ui-checkbox__label">
      <slot />
    </span>
  </label>
</template>
