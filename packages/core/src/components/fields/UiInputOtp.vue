<script setup lang="ts">
import { computed, ref } from 'vue';
import type { ComponentPublicInstance } from 'vue';

import { useId } from '@ww/primitives';

import { mergeDescribedBy, useFieldContext } from './field-context';

defineOptions({ name: 'UiInputOtp' });

type UiInputOtpMode = 'numeric' | 'alphanumeric' | 'text';

const props = withDefaults(
  defineProps<{
    modelValue?: string;
    id?: string;
    name?: string;
    length?: number;
    disabled?: boolean;
    readonly?: boolean;
    invalid?: boolean;
    mask?: boolean;
    mode?: UiInputOtpMode;
    placeholder?: string;
    autocomplete?: string;
    ariaLabel?: string;
    ariaDescribedby?: string;
  }>(),
  {
    autocomplete: 'one-time-code',
    disabled: false,
    invalid: false,
    length: 6,
    mask: false,
    mode: 'numeric',
    modelValue: '',
    placeholder: '•',
    readonly: false,
  }
);

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const field = useFieldContext();
const fallbackId = useId('input-otp');
const inputId = computed(() => props.id ?? field?.inputId.value ?? fallbackId.value);
const labelId = computed(() => (props.ariaLabel ? undefined : field?.labelId.value));
const describedBy = computed(() =>
  mergeDescribedBy(props.ariaDescribedby, field?.describedBy.value)
);
const isInvalid = computed(() => props.invalid || field?.invalid.value || false);
const normalizedLength = computed(() => Math.max(1, Math.floor(props.length)));
const segmentRefs = ref<Array<HTMLInputElement | null>>([]);

function normalizeCharacters(value: string) {
  if (props.mode === 'numeric') {
    return value.replace(/\D+/g, '');
  }

  if (props.mode === 'alphanumeric') {
    return value.replace(/[^a-z0-9]+/gi, '');
  }

  return value.replace(/\s+/g, '');
}

const normalizedValue = computed(() =>
  normalizeCharacters(props.modelValue).slice(0, normalizedLength.value)
);
const segments = computed(() =>
  Array.from({ length: normalizedLength.value }, (_, index) => normalizedValue.value[index] ?? '')
);
const inputMode = computed(() => (props.mode === 'numeric' ? 'numeric' : 'text'));

const focusSegment = (index: number) => {
  segmentRefs.value[index]?.focus();
  segmentRefs.value[index]?.select();
};

const setSegmentRef = (index: number) => (element: Element | ComponentPublicInstance | null) => {
  segmentRefs.value[index] = element instanceof HTMLInputElement ? element : null;
};

const commitSegments = (nextSegments: readonly string[]) => {
  emit('update:modelValue', nextSegments.join(''));
};

const writeFromIndex = (index: number, value: string) => {
  const nextSegments = segments.value.slice();
  const characters = Array.from(normalizeCharacters(value));
  let targetIndex = index;

  for (const character of characters) {
    if (targetIndex >= normalizedLength.value) {
      break;
    }

    nextSegments[targetIndex] = character;
    targetIndex += 1;
  }

  commitSegments(nextSegments);
  if (targetIndex >= normalizedLength.value) {
    focusSegment(normalizedLength.value - 1);
    return;
  }

  focusSegment(targetIndex);
};

const clearAtIndex = (index: number) => {
  const nextSegments = segments.value.slice();
  nextSegments[index] = '';
  commitSegments(nextSegments);
};

const onInput = (index: number, event: Event) => {
  if (!(event.target instanceof HTMLInputElement)) {
    return;
  }

  const value = event.target.value;
  if (value.length === 0) {
    clearAtIndex(index);
    return;
  }

  writeFromIndex(index, value);
};

const onPaste = (index: number, event: ClipboardEvent) => {
  const text = event.clipboardData?.getData('text/plain') ?? '';
  if (!text) {
    return;
  }

  event.preventDefault();
  writeFromIndex(index, text);
};

const onKeydown = (index: number, event: KeyboardEvent) => {
  if (event.key === 'ArrowLeft' && index > 0) {
    event.preventDefault();
    focusSegment(index - 1);
    return;
  }

  if (event.key === 'ArrowRight' && index < normalizedLength.value - 1) {
    event.preventDefault();
    focusSegment(index + 1);
    return;
  }

  if (event.key === 'Home') {
    event.preventDefault();
    focusSegment(0);
    return;
  }

  if (event.key === 'End') {
    event.preventDefault();
    focusSegment(normalizedLength.value - 1);
    return;
  }

  if (event.key === 'Backspace') {
    event.preventDefault();
    if (segments.value[index]) {
      clearAtIndex(index);
      return;
    }

    if (index > 0) {
      clearAtIndex(index - 1);
      focusSegment(index - 1);
    }
    return;
  }

  if (event.key === 'Delete') {
    event.preventDefault();
    clearAtIndex(index);
  }
};

const onFocus = (event: FocusEvent) => {
  if (event.target instanceof HTMLInputElement) {
    event.target.select();
  }
};

const onContainerClick = () => {
  if (props.disabled || props.readonly) {
    return;
  }

  const firstEmptyIndex = segments.value.findIndex((segment) => segment.length === 0);
  focusSegment(firstEmptyIndex >= 0 ? firstEmptyIndex : normalizedLength.value - 1);
};

const segmentAriaLabel = (index: number) =>
  `${props.ariaLabel ?? 'One-time code digit'} ${index + 1} of ${normalizedLength.value}`;
</script>

<template>
  <div class="ui-input-otp">
    <div
      class="ui-input-otp__group"
      :class="{ 'is-invalid': isInvalid, 'is-disabled': props.disabled }"
      role="group"
      :aria-label="props.ariaLabel"
      :aria-labelledby="labelId"
      :aria-describedby="describedBy"
      @click="onContainerClick"
    >
      <input
        v-for="(segment, index) in segments"
        :id="index === 0 ? inputId : `${inputId}-${index + 1}`"
        :key="`${inputId}-${index}`"
        :ref="setSegmentRef(index)"
        class="ui-input ui-input-otp__segment"
        :class="{ 'is-invalid': isInvalid }"
        :type="props.mask ? 'password' : 'text'"
        :value="segment"
        :disabled="props.disabled"
        :readonly="props.readonly"
        :inputmode="inputMode"
        :autocomplete="index === 0 ? props.autocomplete : 'off'"
        :placeholder="props.placeholder"
        :aria-label="segmentAriaLabel(index)"
        :aria-describedby="describedBy"
        :aria-invalid="isInvalid || undefined"
        maxlength="1"
        data-ui-motion="ring-focus-soft"
        @input="onInput(index, $event)"
        @paste="onPaste(index, $event)"
        @keydown="onKeydown(index, $event)"
        @focus="onFocus"
      />
    </div>
    <input v-if="props.name" type="hidden" :name="props.name" :value="normalizedValue" />
  </div>
</template>
