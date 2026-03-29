<script setup lang="ts">
import { computed } from 'vue';

import { useId } from '@ww/primitives';

import { mergeDescribedBy, useFieldContext } from './field-context';

defineOptions({ name: 'UiInput' });

const props = withDefaults(
  defineProps<{
    modelValue?: string;
    id?: string;
    type?: 'email' | 'number' | 'password' | 'search' | 'tel' | 'text' | 'url';
    name?: string;
    placeholder?: string;
    disabled?: boolean;
    readonly?: boolean;
    invalid?: boolean;
    autocomplete?: string;
    ariaDescribedby?: string;
  }>(),
  {
    modelValue: '',
    type: 'text',
    disabled: false,
    readonly: false,
    invalid: false,
  }
);

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const field = useFieldContext();
const fallbackId = useId('input');
const inputId = computed(() => props.id ?? field?.inputId.value ?? fallbackId.value);
const isInvalid = computed(() => props.invalid || field?.invalid.value || false);
const describedBy = computed(() =>
  mergeDescribedBy(props.ariaDescribedby, field?.describedBy.value)
);

const onInput = (event: Event) => {
  if (event.target instanceof HTMLInputElement) {
    emit('update:modelValue', event.target.value);
  }
};
</script>

<template>
  <input
    :id="inputId"
    class="ui-input"
    :class="{ 'is-invalid': isInvalid }"
    :type="props.type"
    :name="props.name"
    :value="props.modelValue"
    :placeholder="props.placeholder"
    :disabled="props.disabled"
    :readonly="props.readonly"
    :aria-invalid="isInvalid || undefined"
    :aria-describedby="describedBy"
    :autocomplete="props.autocomplete"
    data-ui-motion="ring-focus-soft"
    @input="onInput"
  />
</template>
