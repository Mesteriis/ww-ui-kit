<script setup lang="ts">
import { computed, ref, watch } from 'vue';

import { useId } from '@ww/primitives';

import {
  clampNumber,
  formatNumberish,
  parseNumberish,
  resolveNumberPrecision,
  roundNumber,
  stepNumberish,
} from '../shared/number';
import { mergeDescribedBy, useFieldContext } from './field-context';

defineOptions({ name: 'UiNumberInput' });

export type UiNumberInputSize = 'sm' | 'md' | 'lg';

const props = withDefaults(
  defineProps<{
    modelValue?: number | null;
    id?: string;
    name?: string;
    placeholder?: string;
    min?: number;
    max?: number;
    step?: number;
    precision?: number;
    allowEmpty?: boolean;
    clampOnBlur?: boolean;
    disabled?: boolean;
    readonly?: boolean;
    invalid?: boolean;
    size?: UiNumberInputSize;
    format?: 'decimal';
    ariaDescribedby?: string;
  }>(),
  {
    allowEmpty: false,
    clampOnBlur: true,
    disabled: false,
    format: 'decimal',
    invalid: false,
    modelValue: null,
    readonly: false,
    size: 'md',
    step: 1,
  }
);

const emit = defineEmits<{
  'update:modelValue': [value: number | null];
}>();

const field = useFieldContext();
const fallbackId = useId('number-input');
const inputId = computed(() => props.id ?? field?.inputId.value ?? fallbackId.value);
const describedBy = computed(() =>
  mergeDescribedBy(props.ariaDescribedby, field?.describedBy.value)
);
const isInvalid = computed(() => props.invalid || field?.invalid.value || false);
const resolvedPrecision = computed(() => resolveNumberPrecision(props.step, props.precision));
const draftValue = ref(formatNumberish(props.modelValue, resolvedPrecision.value));
const hasFocus = ref(false);

const syncDraftFromModel = () => {
  draftValue.value = formatNumberish(props.modelValue, resolvedPrecision.value);
};

watch(
  () => [props.modelValue, resolvedPrecision.value] as const,
  () => {
    if (!hasFocus.value) {
      syncDraftFromModel();
    }
  },
  { immediate: true }
);

const isInteractive = computed(() => !props.disabled && !props.readonly);

const commitValue = (value: number | null, clamp: boolean) => {
  if (value === null) {
    emit('update:modelValue', null);
    draftValue.value = '';
    return;
  }

  const roundedValue = roundNumber(value, resolvedPrecision.value);
  const nextValue = clamp ? clampNumber(roundedValue, props.min, props.max) : roundedValue;

  emit('update:modelValue', nextValue);
  draftValue.value = formatNumberish(nextValue, resolvedPrecision.value);
};

const commitDraft = (clamp: boolean) => {
  const parsedValue = parseNumberish(draftValue.value);
  if (parsedValue === null) {
    if (props.allowEmpty) {
      commitValue(null, clamp);
      return;
    }

    const fallbackValue =
      props.modelValue ?? (Number.isFinite(props.min) ? (props.min as number) : 0);
    commitValue(fallbackValue, true);
    return;
  }

  commitValue(parsedValue, clamp);
};

const stepValue = (direction: 1 | -1, page = false) => {
  const currentValue = parseNumberish(draftValue.value) ?? props.modelValue ?? null;
  const nextValue = stepNumberish({
    currentValue,
    direction,
    step: props.step,
    precision: props.precision,
    min: props.min,
    max: props.max,
    page,
  });

  commitValue(nextValue, true);
};

const onInput = (event: Event) => {
  draftValue.value = (event.target as HTMLInputElement).value;
};

const onBlur = () => {
  hasFocus.value = false;
  commitDraft(props.clampOnBlur);
};

const onFocus = () => {
  hasFocus.value = true;
};

const onKeydown = (event: KeyboardEvent) => {
  if (!isInteractive.value) {
    return;
  }

  if (event.key === 'ArrowUp') {
    event.preventDefault();
    stepValue(1);
    return;
  }

  if (event.key === 'ArrowDown') {
    event.preventDefault();
    stepValue(-1);
    return;
  }

  if (event.key === 'PageUp') {
    event.preventDefault();
    stepValue(1, true);
    return;
  }

  if (event.key === 'PageDown') {
    event.preventDefault();
    stepValue(-1, true);
    return;
  }

  if (event.key === 'Home' && Number.isFinite(props.min)) {
    event.preventDefault();
    commitValue(props.min as number, true);
    return;
  }

  if (event.key === 'End' && Number.isFinite(props.max)) {
    event.preventDefault();
    commitValue(props.max as number, true);
    return;
  }

  if (event.key === 'Enter') {
    event.preventDefault();
    commitDraft(true);
  }
};
</script>

<template>
  <div class="ui-number-input" :class="[`ui-number-input--${props.size}`]">
    <button
      type="button"
      class="ui-number-input__button"
      :disabled="props.disabled || props.readonly"
      aria-label="Decrease value"
      data-ui-motion="ring-focus-soft"
      @click="stepValue(-1)"
    >
      −
    </button>
    <input
      :id="inputId"
      class="ui-input ui-number-input__control"
      :class="{ 'is-invalid': isInvalid }"
      type="text"
      inputmode="numeric"
      autocomplete="off"
      :name="props.name"
      :value="draftValue"
      :placeholder="props.placeholder"
      :disabled="props.disabled"
      :readonly="props.readonly"
      :aria-invalid="isInvalid || undefined"
      :aria-describedby="describedBy"
      data-ui-motion="ring-focus-soft"
      @input="onInput"
      @focus="onFocus"
      @blur="onBlur"
      @keydown="onKeydown"
    />
    <button
      type="button"
      class="ui-number-input__button"
      :disabled="props.disabled || props.readonly"
      aria-label="Increase value"
      data-ui-motion="ring-focus-soft"
      @click="stepValue(1)"
    >
      +
    </button>
  </div>
</template>
