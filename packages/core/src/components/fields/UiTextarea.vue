<script setup lang="ts">
import { computed } from 'vue';

import { useId } from '@ww/primitives';

import { mergeDescribedBy, useFieldContext } from './field-context';

defineOptions({ name: 'UiTextarea' });

const props = withDefaults(
  defineProps<{
    modelValue?: string;
    id?: string;
    name?: string;
    placeholder?: string;
    rows?: number;
    disabled?: boolean;
    readonly?: boolean;
    invalid?: boolean;
    ariaDescribedby?: string;
  }>(),
  {
    modelValue: '',
    rows: 4,
    disabled: false,
    readonly: false,
    invalid: false,
  }
);

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const field = useFieldContext();
const fallbackId = useId('textarea');
const textareaId = computed(() => props.id ?? field?.inputId.value ?? fallbackId.value);
const isInvalid = computed(() => props.invalid || field?.invalid.value || false);
const describedBy = computed(() =>
  mergeDescribedBy(props.ariaDescribedby, field?.describedBy.value)
);

const onInput = (event: Event) => {
  if (event.target instanceof HTMLTextAreaElement) {
    emit('update:modelValue', event.target.value);
  }
};
</script>

<template>
  <textarea
    :id="textareaId"
    class="ui-input ui-input--textarea"
    :class="{ 'is-invalid': isInvalid }"
    :name="props.name"
    :value="props.modelValue"
    :rows="props.rows"
    :placeholder="props.placeholder"
    :disabled="props.disabled"
    :readonly="props.readonly"
    :aria-invalid="isInvalid || undefined"
    :aria-describedby="describedBy"
    data-ui-motion="ring-focus-soft"
    @input="onInput"
  />
</template>
