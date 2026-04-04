<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

import { PrimitiveVisuallyHidden, useId } from '@ww/primitives';

import { mergeDescribedBy, useFieldContext } from './field-context';
import {
  normalizeRangeValue,
  ratioToSliderValue,
  resolveRangeGap,
  resolveSliderBounds,
  resolveSliderMarks,
  resolveSliderRatio,
  stepSliderValue,
  updateRangeThumb,
  type UiSliderMark,
  type UiSliderOrientation,
} from './slider';
import UiNumberInput from './UiNumberInput.vue';

defineOptions({ name: 'UiRangeSlider' });

const props = withDefaults(
  defineProps<{
    modelValue?: [number, number] | null;
    id?: string;
    min?: number;
    max?: number;
    step?: number;
    precision?: number;
    minRange?: number;
    disabled?: boolean;
    invalid?: boolean;
    orientation?: UiSliderOrientation;
    marks?: readonly UiSliderMark[];
    tooltip?: boolean | 'always';
    formatTooltip?: ((value: number) => string) | undefined;
    showInput?: boolean;
    nameStart?: string;
    nameEnd?: string;
    startInputAriaLabel?: string;
    endInputAriaLabel?: string;
    startAriaLabel?: string;
    endAriaLabel?: string;
    ariaLabelledby?: string;
    ariaDescribedby?: string;
  }>(),
  {
    modelValue: null,
    min: 0,
    max: 100,
    step: 1,
    minRange: 0,
    disabled: false,
    invalid: false,
    orientation: 'horizontal',
    tooltip: true,
    showInput: false,
    startInputAriaLabel: 'Minimum value',
    endInputAriaLabel: 'Maximum value',
  }
);

const emit = defineEmits<{
  'update:modelValue': [value: [number, number]];
}>();

const field = useFieldContext();
const fallbackId = useId('range-slider');
const startLabelId = useId('range-slider-start-label');
const endLabelId = useId('range-slider-end-label');
const rootId = computed(() => props.id ?? field?.inputId.value ?? fallbackId.value);
const describedBy = computed(() =>
  mergeDescribedBy(props.ariaDescribedby, field?.describedBy.value)
);
const groupLabelId = computed(() => props.ariaLabelledby ?? field?.labelId.value);
const startLabelledBy = computed(() => {
  if (props.startAriaLabel) {
    return undefined;
  }

  return [groupLabelId.value, startLabelId.value].filter(Boolean).join(' ') || undefined;
});
const endLabelledBy = computed(() => {
  if (props.endAriaLabel) {
    return undefined;
  }

  return [groupLabelId.value, endLabelId.value].filter(Boolean).join(' ') || undefined;
});
const isInvalid = computed(() => props.invalid || field?.invalid.value || false);
const bounds = computed(() => resolveSliderBounds(props.min, props.max));
const rangeGap = computed(() => resolveRangeGap(props));
const resolvedValue = computed(() => normalizeRangeValue(props.modelValue, props));
const marks = computed(() => resolveSliderMarks(props.marks, props));
const startRatio = computed(() =>
  resolveSliderRatio(resolvedValue.value[0], bounds.value.min, bounds.value.max)
);
const endRatio = computed(() =>
  resolveSliderRatio(resolvedValue.value[1], bounds.value.min, bounds.value.max)
);
const trackRef = ref<HTMLElement | null>(null);
const startThumbRef = ref<HTMLButtonElement | null>(null);
const endThumbRef = ref<HTMLButtonElement | null>(null);
const dragThumb = ref<'start' | 'end' | null>(null);
const focusedThumb = ref<'start' | 'end' | null>(null);
const tooltipThumb = ref<'start' | 'end' | null>(null);

const startTooltipText = computed(() =>
  props.formatTooltip ? props.formatTooltip(resolvedValue.value[0]) : String(resolvedValue.value[0])
);
const endTooltipText = computed(() =>
  props.formatTooltip ? props.formatTooltip(resolvedValue.value[1]) : String(resolvedValue.value[1])
);

const startThumbStyle = computed(() =>
  props.orientation === 'vertical'
    ? { insetBlockEnd: `${startRatio.value * 100}%` }
    : { insetInlineStart: `${startRatio.value * 100}%` }
);
const endThumbStyle = computed(() =>
  props.orientation === 'vertical'
    ? { insetBlockEnd: `${endRatio.value * 100}%` }
    : { insetInlineStart: `${endRatio.value * 100}%` }
);
const rangeStyle = computed(() =>
  props.orientation === 'vertical'
    ? {
        insetBlockEnd: `${startRatio.value * 100}%`,
        blockSize: `${(endRatio.value - startRatio.value) * 100}%`,
      }
    : {
        insetInlineStart: `${startRatio.value * 100}%`,
        inlineSize: `${(endRatio.value - startRatio.value) * 100}%`,
      }
);

const showStartTooltip = computed(
  () =>
    !props.disabled &&
    (props.tooltip === 'always' ||
      (props.tooltip !== false &&
        (dragThumb.value === 'start' ||
          focusedThumb.value === 'start' ||
          tooltipThumb.value === 'start')))
);
const showEndTooltip = computed(
  () =>
    !props.disabled &&
    (props.tooltip === 'always' ||
      (props.tooltip !== false &&
        (dragThumb.value === 'end' ||
          focusedThumb.value === 'end' ||
          tooltipThumb.value === 'end')))
);
const startNumberInputProps = computed(() => ({
  modelValue: resolvedValue.value[0],
  min: bounds.value.min,
  max: resolvedValue.value[1] - rangeGap.value,
  step: props.step,
  ...(props.precision !== undefined ? { precision: props.precision } : {}),
  disabled: props.disabled,
  invalid: isInvalid.value,
  ariaLabel: props.startInputAriaLabel,
}));
const endNumberInputProps = computed(() => ({
  modelValue: resolvedValue.value[1],
  min: resolvedValue.value[0] + rangeGap.value,
  max: bounds.value.max,
  step: props.step,
  ...(props.precision !== undefined ? { precision: props.precision } : {}),
  disabled: props.disabled,
  invalid: isInvalid.value,
  ariaLabel: props.endInputAriaLabel,
}));

function emitValue(nextValue: readonly [number, number]) {
  emit('update:modelValue', [...normalizeRangeValue([nextValue[0], nextValue[1]], props)] as [
    number,
    number,
  ]);
}

function onStartInputUpdate(nextValue: number | null) {
  if (nextValue === null) {
    return;
  }

  emitValue(updateRangeThumb(resolvedValue.value, 'start', nextValue, props));
}

function onEndInputUpdate(nextValue: number | null) {
  if (nextValue === null) {
    return;
  }

  emitValue(updateRangeThumb(resolvedValue.value, 'end', nextValue, props));
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

function resolveThumbFromPointer(event: PointerEvent) {
  const pointerValue = ratioToSliderValue(resolveRatioFromPointer(event), props);
  const [start, end] = resolvedValue.value;

  return Math.abs(pointerValue - start) <= Math.abs(pointerValue - end) ? 'start' : 'end';
}

function updateThumbFromPointer(thumb: 'start' | 'end', event: PointerEvent) {
  const pointerValue = ratioToSliderValue(resolveRatioFromPointer(event), props);
  emitValue(updateRangeThumb(resolvedValue.value, thumb, pointerValue, props));
}

function onPointerDown(event: PointerEvent) {
  if (props.disabled || event.button !== 0) {
    return;
  }

  event.preventDefault();
  const thumb = resolveThumbFromPointer(event);
  dragThumb.value = thumb;
  tooltipThumb.value = thumb;
  if (thumb === 'start') {
    startThumbRef.value?.focus({ preventScroll: true });
  } else {
    endThumbRef.value?.focus({ preventScroll: true });
  }
  updateThumbFromPointer(thumb, event);
}

function onWindowPointerMove(event: PointerEvent) {
  if (!dragThumb.value || props.disabled) {
    return;
  }

  updateThumbFromPointer(dragThumb.value, event);
}

function stopDragging() {
  dragThumb.value = null;
}

function stepThumb(thumb: 'start' | 'end', direction: 1 | -1, page = false) {
  const [start, end] = resolvedValue.value;
  const precision = props.precision;
  if (thumb === 'start') {
    emitValue(
      updateRangeThumb(
        resolvedValue.value,
        'start',
        stepSliderValue(start, direction, {
          ...props,
          page,
          maxOverride: end - rangeGap.value,
        }),
        { ...props, precision }
      )
    );
    return;
  }

  emitValue(
    updateRangeThumb(
      resolvedValue.value,
      'end',
      stepSliderValue(end, direction, {
        ...props,
        page,
        minOverride: start + rangeGap.value,
      }),
      { ...props, precision }
    )
  );
}

function onKeydown(thumb: 'start' | 'end', event: KeyboardEvent) {
  if (props.disabled) {
    return;
  }

  if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
    event.preventDefault();
    stepThumb(thumb, 1);
    return;
  }

  if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
    event.preventDefault();
    stepThumb(thumb, -1);
    return;
  }

  if (event.key === 'PageUp') {
    event.preventDefault();
    stepThumb(thumb, 1, true);
    return;
  }

  if (event.key === 'PageDown') {
    event.preventDefault();
    stepThumb(thumb, -1, true);
    return;
  }

  if (event.key === 'Home') {
    event.preventDefault();
    if (thumb === 'start') {
      emitValue([bounds.value.min, resolvedValue.value[1]]);
      return;
    }

    emitValue([resolvedValue.value[0], resolvedValue.value[0] + rangeGap.value]);
    return;
  }

  if (event.key === 'End') {
    event.preventDefault();
    if (thumb === 'end') {
      emitValue([resolvedValue.value[0], bounds.value.max]);
      return;
    }

    emitValue([resolvedValue.value[1] - rangeGap.value, resolvedValue.value[1]]);
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
      'ui-slider-field--range',
      {
        'is-disabled': props.disabled,
        'is-invalid': isInvalid,
      },
    ]"
  >
    <div
      :id="rootId"
      ref="trackRef"
      class="ui-slider ui-slider--range"
      :class="`ui-slider--${props.orientation}`"
      :data-ui-slider-orientation="props.orientation"
      role="group"
      :aria-labelledby="groupLabelId"
      :aria-describedby="describedBy"
      :aria-disabled="props.disabled || undefined"
      @mouseenter="tooltipThumb = props.disabled ? null : (focusedThumb ?? 'start')"
      @mouseleave="tooltipThumb = null"
      @pointerdown="onPointerDown"
    >
      <PrimitiveVisuallyHidden :id="startLabelId">Minimum value</PrimitiveVisuallyHidden>
      <PrimitiveVisuallyHidden :id="endLabelId">Maximum value</PrimitiveVisuallyHidden>

      <div class="ui-slider__rail" />
      <div class="ui-slider__range ui-slider__range--window" :style="rangeStyle" />

      <div
        v-for="mark in marks"
        :key="`range-mark-${mark.value}`"
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
        ref="startThumbRef"
        type="button"
        class="ui-slider__thumb"
        :style="startThumbStyle"
        :disabled="props.disabled"
        role="slider"
        :aria-label="props.startAriaLabel"
        :aria-labelledby="startLabelledBy"
        :aria-describedby="describedBy"
        :aria-disabled="props.disabled || undefined"
        :aria-invalid="isInvalid || undefined"
        :aria-orientation="props.orientation"
        :aria-valuemin="bounds.min"
        :aria-valuemax="resolvedValue[1] - rangeGap"
        :aria-valuenow="resolvedValue[0]"
        :aria-valuetext="startTooltipText"
        data-ui-motion="ring-focus-soft"
        @focus="
          focusedThumb = 'start';
          tooltipThumb = 'start';
        "
        @blur="
          if (focusedThumb === 'start') focusedThumb = null;
          if (dragThumb !== 'start') tooltipThumb = null;
        "
        @keydown="onKeydown('start', $event)"
      >
        <span class="ui-slider__thumb-handle" aria-hidden="true" />
      </button>

      <button
        ref="endThumbRef"
        type="button"
        class="ui-slider__thumb"
        :style="endThumbStyle"
        :disabled="props.disabled"
        role="slider"
        :aria-label="props.endAriaLabel"
        :aria-labelledby="endLabelledBy"
        :aria-describedby="describedBy"
        :aria-disabled="props.disabled || undefined"
        :aria-invalid="isInvalid || undefined"
        :aria-orientation="props.orientation"
        :aria-valuemin="resolvedValue[0] + rangeGap"
        :aria-valuemax="bounds.max"
        :aria-valuenow="resolvedValue[1]"
        :aria-valuetext="endTooltipText"
        data-ui-motion="ring-focus-soft"
        @focus="
          focusedThumb = 'end';
          tooltipThumb = 'end';
        "
        @blur="
          if (focusedThumb === 'end') focusedThumb = null;
          if (dragThumb !== 'end') tooltipThumb = null;
        "
        @keydown="onKeydown('end', $event)"
      >
        <span class="ui-slider__thumb-handle" aria-hidden="true" />
      </button>

      <div
        v-if="showStartTooltip"
        class="ui-slider__tooltip"
        :style="startThumbStyle"
        aria-hidden="true"
      >
        {{ startTooltipText }}
      </div>

      <div
        v-if="showEndTooltip"
        class="ui-slider__tooltip"
        :style="endThumbStyle"
        aria-hidden="true"
      >
        {{ endTooltipText }}
      </div>
    </div>

    <div v-if="props.showInput" class="ui-slider-field__range-inputs">
      <UiNumberInput
        class="ui-slider-field__input"
        v-bind="startNumberInputProps"
        @update:model-value="onStartInputUpdate"
      />
      <UiNumberInput
        class="ui-slider-field__input"
        v-bind="endNumberInputProps"
        @update:model-value="onEndInputUpdate"
      />
    </div>

    <input v-if="props.nameStart" type="hidden" :name="props.nameStart" :value="resolvedValue[0]" />
    <input v-if="props.nameEnd" type="hidden" :name="props.nameEnd" :value="resolvedValue[1]" />
  </div>
</template>
