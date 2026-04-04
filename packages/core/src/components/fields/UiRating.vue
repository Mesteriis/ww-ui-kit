<script setup lang="ts">
import { computed, ref } from 'vue';

import { useControllable, useId } from '@ww/primitives';

import { mergeDescribedBy, useFieldContext } from './field-context';

defineOptions({ name: 'UiRating' });

type UiRatingSize = 'sm' | 'md' | 'lg';
type UiRatingTone = 'neutral' | 'brand' | 'success' | 'warning' | 'danger';

const props = withDefaults(
  defineProps<{
    modelValue?: number;
    defaultValue?: number;
    id?: string;
    name?: string;
    max?: number;
    allowHalf?: boolean;
    allowClear?: boolean;
    disabled?: boolean;
    readonly?: boolean;
    invalid?: boolean;
    size?: UiRatingSize;
    tone?: UiRatingTone;
    icon?: string;
    emptyIcon?: string;
    ariaLabel?: string;
    ariaLabelledby?: string;
    ariaDescribedby?: string;
  }>(),
  {
    allowClear: false,
    allowHalf: false,
    defaultValue: 0,
    disabled: false,
    emptyIcon: '★',
    icon: '★',
    invalid: false,
    max: 5,
    readonly: false,
    size: 'md',
    tone: 'warning',
  }
);

const emit = defineEmits<{
  change: [value: number];
  'update:modelValue': [value: number];
}>();

interface UiRatingSegment {
  id: string;
  index: number;
  star: number;
  value: number;
}

interface UiRatingStar {
  fillPercent: number;
  index: number;
}

const field = useFieldContext();
const fallbackId = useId('rating');
const hoverValue = ref<number | null>(null);
const focusIndex = ref(0);
const segmentRefs = ref<HTMLButtonElement[]>([]);

const maxValue = computed(() => Math.max(1, Math.floor(props.max)));
const step = computed(() => (props.allowHalf ? 0.5 : 1));

const normalizeRatingValue = (value: number | undefined) => {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return 0;
  }

  const scaledValue = Math.round(value / step.value) * step.value;
  return Math.min(maxValue.value, Math.max(0, scaledValue));
};

const state = useControllable({
  defaultValue: normalizeRatingValue(props.defaultValue),
  onChange: (value) => {
    emit('update:modelValue', value);
    emit('change', value);
  },
  value: computed(() =>
    props.modelValue === undefined ? undefined : normalizeRatingValue(props.modelValue)
  ),
});

const ratingId = computed(() => props.id ?? field?.inputId.value ?? fallbackId.value);
const isInvalid = computed(() => Boolean(props.invalid || field?.invalid.value));
const describedBy = computed(() =>
  mergeDescribedBy(props.ariaDescribedby, field?.describedBy.value)
);
const labelId = computed(() => {
  if (props.ariaLabel) {
    return undefined;
  }

  return props.ariaLabelledby ?? field?.labelId.value;
});
const currentValue = computed(() => normalizeRatingValue(state.currentValue.value));
const previewValue = computed(() => hoverValue.value ?? currentValue.value);
const segments = computed<UiRatingSegment[]>(() => {
  const nextSegments: UiRatingSegment[] = [];
  let nextIndex = 0;

  for (let starIndex = 1; starIndex <= maxValue.value; starIndex += 1) {
    if (props.allowHalf) {
      nextSegments.push({
        id: `${ratingId.value}-segment-${starIndex}-half`,
        index: nextIndex,
        star: starIndex,
        value: starIndex - 0.5,
      });
      nextIndex += 1;
    }

    nextSegments.push({
      id: `${ratingId.value}-segment-${starIndex}-full`,
      index: nextIndex,
      star: starIndex,
      value: starIndex,
    });
    nextIndex += 1;
  }

  return nextSegments;
});
const stars = computed<UiRatingStar[]>(() =>
  Array.from({ length: maxValue.value }, (_, index) => {
    const starValue = index + 1;
    const fill = Math.max(0, Math.min(1, previewValue.value - index));
    const fillPercent = fill >= 1 ? 100 : fill >= 0.5 ? 50 : 0;

    return {
      fillPercent,
      index: starValue,
    };
  })
);
const activeIndex = computed(() => {
  const selectedIndex = segments.value.findIndex((segment) => segment.value === currentValue.value);
  if (focusIndex.value >= 0 && focusIndex.value < segments.value.length) {
    return focusIndex.value;
  }

  return selectedIndex >= 0 ? selectedIndex : 0;
});
const activeSegment = computed(
  () => segments.value[activeIndex.value] ?? segments.value[0] ?? null
);
const isInteractive = computed(() => !props.disabled && !props.readonly);

const setSegmentRef = (index: number, element: HTMLButtonElement | null) => {
  if (element) {
    segmentRefs.value[index] = element;
    return;
  }

  segmentRefs.value.splice(index, 1);
};

const focusSegment = (index: number) => {
  const nextIndex = Math.min(Math.max(0, index), segments.value.length - 1);
  const target = segmentRefs.value[nextIndex];
  if (!target) {
    return;
  }

  focusIndex.value = nextIndex;
  target.focus();
};

const setValue = (nextValue: number) => {
  const normalizedValue = normalizeRatingValue(nextValue);
  if (!isInteractive.value) {
    return;
  }

  if (props.allowClear && normalizedValue === currentValue.value) {
    state.setValue(0);
    return;
  }

  state.setValue(normalizedValue);
};

const onGroupKeydown = (event: KeyboardEvent) => {
  if (!isInteractive.value || segments.value.length === 0) {
    return;
  }

  const currentIndex = activeIndex.value;
  const lastIndex = segments.value.length - 1;

  if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
    event.preventDefault();
    const nextIndex = currentIndex >= lastIndex ? 0 : currentIndex + 1;
    focusSegment(nextIndex);
    setValue(segments.value[nextIndex]!.value);
    return;
  }

  if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
    event.preventDefault();
    const nextIndex = currentIndex <= 0 ? lastIndex : currentIndex - 1;
    focusSegment(nextIndex);
    setValue(segments.value[nextIndex]!.value);
    return;
  }

  if (event.key === 'Home') {
    event.preventDefault();
    focusSegment(0);
    setValue(segments.value[0]!.value);
    return;
  }

  if (event.key === 'End') {
    event.preventDefault();
    focusSegment(lastIndex);
    setValue(segments.value[lastIndex]!.value);
    return;
  }

  if (event.key === ' ' || event.key === 'Enter') {
    event.preventDefault();
    const segment = segments.value[currentIndex];
    if (segment) {
      setValue(segment.value);
    }
  }
};

const formatValueLabel = (value: number) =>
  Number.isInteger(value) ? String(value) : value.toFixed(1).replace(/\.0$/, '');
</script>

<template>
  <div
    :id="ratingId"
    class="ui-rating"
    :class="[
      `ui-rating--${props.size}`,
      `ui-rating--${props.tone}`,
      {
        'ui-rating--disabled': props.disabled,
        'ui-rating--invalid': isInvalid,
        'ui-rating--readonly': props.readonly,
      },
    ]"
    role="radiogroup"
    :aria-label="props.ariaLabel"
    :aria-labelledby="labelId"
    :aria-describedby="describedBy"
    :aria-invalid="isInvalid || undefined"
    :aria-disabled="props.disabled || undefined"
    :aria-readonly="props.readonly || undefined"
    @keydown="onGroupKeydown"
    @mouseleave="hoverValue = null"
  >
    <input v-if="props.name" type="hidden" :name="props.name" :value="String(currentValue)" />

    <div
      v-for="star in stars"
      :key="star.index"
      class="ui-rating__star"
      :class="{ 'is-focused': activeSegment?.star === star.index }"
    >
      <span class="ui-rating__icon" aria-hidden="true">
        <span class="ui-rating__icon-empty">{{ props.emptyIcon }}</span>
        <span class="ui-rating__icon-fill" :style="{ inlineSize: `${star.fillPercent}%` }">
          {{ props.icon }}
        </span>
      </span>

      <button
        v-for="segment in segments.filter((candidate) => candidate.star === star.index)"
        :key="segment.id"
        :ref="(element) => setSegmentRef(segment.index, element as HTMLButtonElement | null)"
        type="button"
        class="ui-rating__segment"
        :class="{
          'ui-rating__segment--half': props.allowHalf && segment.value % 1 !== 0,
          'ui-rating__segment--full': !props.allowHalf || segment.value % 1 === 0,
          'ui-rating__segment--whole': !props.allowHalf,
        }"
        :tabindex="segment.index === activeIndex ? 0 : -1"
        :role="'radio'"
        :aria-checked="currentValue === segment.value"
        :aria-label="`${formatValueLabel(segment.value)} of ${maxValue}`"
        :disabled="props.disabled"
        @click="setValue(segment.value)"
        @focus="focusIndex = segment.index"
        @mouseenter="hoverValue = segment.value"
      />
    </div>
  </div>
</template>
