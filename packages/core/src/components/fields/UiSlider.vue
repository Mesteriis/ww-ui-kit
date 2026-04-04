<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

import { useId } from '@ww/primitives';

import { mergeDescribedBy, useFieldContext } from './field-context';
import {
  ratioToSliderValue,
  resolveSliderBounds,
  resolveSliderMarks,
  resolveSliderRatio,
  resolveSliderValue,
  stepSliderValue,
  type UiSliderMark,
  type UiSliderOrientation,
} from './slider';
import UiNumberInput from './UiNumberInput.vue';

defineOptions({ name: 'UiSlider' });

const props = withDefaults(
  defineProps<{
    modelValue?: number | null;
    id?: string;
    name?: string;
    min?: number;
    max?: number;
    step?: number;
    precision?: number;
    disabled?: boolean;
    invalid?: boolean;
    orientation?: UiSliderOrientation;
    marks?: readonly UiSliderMark[];
    tooltip?: boolean | 'always';
    formatTooltip?: ((value: number) => string) | undefined;
    showInput?: boolean;
    inputAriaLabel?: string;
    ariaLabel?: string;
    ariaLabelledby?: string;
    ariaDescribedby?: string;
  }>(),
  {
    modelValue: null,
    min: 0,
    max: 100,
    step: 1,
    disabled: false,
    invalid: false,
    orientation: 'horizontal',
    tooltip: true,
    showInput: false,
    inputAriaLabel: 'Slider value',
  }
);

const emit = defineEmits<{
  'update:modelValue': [value: number];
}>();

const field = useFieldContext();
const fallbackId = useId('slider');
const sliderId = computed(() => props.id ?? field?.inputId.value ?? fallbackId.value);
const bounds = computed(() => resolveSliderBounds(props.min, props.max));
const resolvedValue = computed(() => resolveSliderValue(props.modelValue, props));
const describedBy = computed(() =>
  mergeDescribedBy(props.ariaDescribedby, field?.describedBy.value)
);
const labelId = computed(() => {
  if (props.ariaLabel) {
    return undefined;
  }

  return props.ariaLabelledby ?? field?.labelId.value;
});
const isInvalid = computed(() => props.invalid || field?.invalid.value || false);
const marks = computed(() => resolveSliderMarks(props.marks, props));
const valueRatio = computed(() =>
  resolveSliderRatio(resolvedValue.value, bounds.value.min, bounds.value.max)
);
const tooltipText = computed(() =>
  props.formatTooltip ? props.formatTooltip(resolvedValue.value) : String(resolvedValue.value)
);
const trackRef = ref<HTMLElement | null>(null);
const thumbRef = ref<HTMLButtonElement | null>(null);
const isDragging = ref(false);
const isFocused = ref(false);
const isHovered = ref(false);

const thumbStyle = computed(() =>
  props.orientation === 'vertical'
    ? { insetBlockEnd: `${valueRatio.value * 100}%` }
    : { insetInlineStart: `${valueRatio.value * 100}%` }
);
const rangeStyle = computed(() =>
  props.orientation === 'vertical'
    ? { blockSize: `${valueRatio.value * 100}%` }
    : { inlineSize: `${valueRatio.value * 100}%` }
);
const tooltipStyle = computed(() => thumbStyle.value);
const showTooltip = computed(
  () =>
    !props.disabled &&
    (props.tooltip === 'always' ||
      (props.tooltip !== false && (isDragging.value || isFocused.value || isHovered.value)))
);
const numberInputProps = computed(() => ({
  modelValue: resolvedValue.value,
  min: bounds.value.min,
  max: bounds.value.max,
  step: props.step,
  ...(props.precision !== undefined ? { precision: props.precision } : {}),
  disabled: props.disabled,
  invalid: isInvalid.value,
  ariaLabel: props.inputAriaLabel,
}));

function emitValue(nextValue: number) {
  emit('update:modelValue', resolveSliderValue(nextValue, props));
}

function onNumberInputUpdate(nextValue: number | null) {
  if (nextValue === null) {
    return;
  }

  emitValue(nextValue);
}

function resolveRatioFromPointer(event: PointerEvent) {
  const track = trackRef.value;
  if (!track) {
    return 0;
  }

  const rect = track.getBoundingClientRect();
  if (props.orientation === 'vertical') {
    return rect.height > 0 ? 1 - (event.clientY - rect.top) / rect.height : 0;
  }

  return rect.width > 0 ? (event.clientX - rect.left) / rect.width : 0;
}

function updateFromPointer(event: PointerEvent) {
  emitValue(ratioToSliderValue(resolveRatioFromPointer(event), props));
}

function onPointerDown(event: PointerEvent) {
  if (props.disabled || event.button !== 0) {
    return;
  }

  event.preventDefault();
  thumbRef.value?.focus({ preventScroll: true });
  isDragging.value = true;
  updateFromPointer(event);
}

function onWindowPointerMove(event: PointerEvent) {
  if (!isDragging.value || props.disabled) {
    return;
  }

  updateFromPointer(event);
}

function stopDragging() {
  isDragging.value = false;
}

function onKeydown(event: KeyboardEvent) {
  if (props.disabled) {
    return;
  }

  if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
    event.preventDefault();
    emitValue(stepSliderValue(resolvedValue.value, 1, props));
    return;
  }

  if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
    event.preventDefault();
    emitValue(stepSliderValue(resolvedValue.value, -1, props));
    return;
  }

  if (event.key === 'PageUp') {
    event.preventDefault();
    emitValue(stepSliderValue(resolvedValue.value, 1, { ...props, page: true }));
    return;
  }

  if (event.key === 'PageDown') {
    event.preventDefault();
    emitValue(stepSliderValue(resolvedValue.value, -1, { ...props, page: true }));
    return;
  }

  if (event.key === 'Home') {
    event.preventDefault();
    emitValue(bounds.value.min);
    return;
  }

  if (event.key === 'End') {
    event.preventDefault();
    emitValue(bounds.value.max);
  }
}

onMounted(() => {
  window.addEventListener('pointermove', onWindowPointerMove);
  window.addEventListener('pointerup', stopDragging);
  window.addEventListener('pointercancel', stopDragging);
});

onBeforeUnmount(() => {
  window.removeEventListener('pointermove', onWindowPointerMove);
  window.removeEventListener('pointerup', stopDragging);
  window.removeEventListener('pointercancel', stopDragging);
});
</script>

<template>
  <div
    class="ui-slider-field"
    :class="[
      `ui-slider-field--${props.orientation}`,
      {
        'is-disabled': props.disabled,
        'is-invalid': isInvalid,
      },
    ]"
  >
    <div
      :id="sliderId"
      ref="trackRef"
      class="ui-slider"
      :class="`ui-slider--${props.orientation}`"
      :data-ui-slider-orientation="props.orientation"
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
      @pointerdown="onPointerDown"
    >
      <div class="ui-slider__rail" />
      <div class="ui-slider__range" :style="rangeStyle" />

      <div
        v-for="mark in marks"
        :key="`mark-${mark.value}`"
        class="ui-slider__mark"
        :class="{ 'has-label': Boolean(mark.label) }"
        :style="
          props.orientation === 'vertical'
            ? { insetBlockEnd: `${mark.ratio * 100}%` }
            : { insetInlineStart: `${mark.ratio * 100}%` }
        "
      >
        <span class="ui-slider__mark-dot" aria-hidden="true" />
        <span v-if="mark.label" class="ui-slider__mark-label">{{ mark.label }}</span>
      </div>

      <button
        ref="thumbRef"
        type="button"
        class="ui-slider__thumb"
        :style="thumbStyle"
        :disabled="props.disabled"
        role="slider"
        :aria-label="props.ariaLabel"
        :aria-labelledby="labelId"
        :aria-describedby="describedBy"
        :aria-disabled="props.disabled || undefined"
        :aria-invalid="isInvalid || undefined"
        :aria-orientation="props.orientation"
        :aria-valuemin="bounds.min"
        :aria-valuemax="bounds.max"
        :aria-valuenow="resolvedValue"
        :aria-valuetext="tooltipText"
        data-ui-motion="ring-focus-soft"
        @focus="isFocused = true"
        @blur="isFocused = false"
        @keydown="onKeydown"
      >
        <span class="ui-slider__thumb-handle" aria-hidden="true" />
      </button>

      <div v-if="showTooltip" class="ui-slider__tooltip" :style="tooltipStyle" aria-hidden="true">
        {{ tooltipText }}
      </div>
    </div>

    <UiNumberInput
      v-if="props.showInput"
      class="ui-slider-field__input"
      v-bind="numberInputProps"
      @update:model-value="onNumberInputUpdate"
    />

    <input v-if="props.name" type="hidden" :name="props.name" :value="resolvedValue" />
  </div>
</template>
