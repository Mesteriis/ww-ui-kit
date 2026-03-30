<script setup lang="ts">
import { computed } from 'vue';

defineOptions({ name: 'UiProgress' });

export type UiProgressStatus = 'neutral' | 'success' | 'warning' | 'danger';
export type UiProgressVariant = 'linear' | 'circular';

const props = withDefaults(
  defineProps<{
    value?: number;
    max?: number;
    variant?: UiProgressVariant;
    indeterminate?: boolean;
    status?: UiProgressStatus;
    showValue?: boolean;
    ariaLabel?: string;
    formatValue?: (payload: { percent: number; value: number; max: number }) => string;
  }>(),
  {
    indeterminate: false,
    max: 100,
    showValue: false,
    status: 'neutral',
    value: 0,
    variant: 'linear',
  }
);

const normalizedMax = computed(() => Math.max(1, props.max));
const clampedValue = computed(() => Math.min(Math.max(0, props.value), normalizedMax.value));
const percent = computed(() => (clampedValue.value / normalizedMax.value) * 100);
const circularCircumference = 2 * Math.PI * 18;
const circularOffset = computed(
  () => circularCircumference - (percent.value / 100) * circularCircumference
);
const accessibleLabel = computed(() => props.ariaLabel ?? 'Progress');
const valueLabel = computed(() =>
  props.formatValue
    ? props.formatValue({
        percent: Math.round(percent.value),
        value: clampedValue.value,
        max: normalizedMax.value,
      })
    : `${Math.round(percent.value)}%`
);
</script>

<template>
  <div
    class="ui-progress"
    :class="[
      `ui-progress--${props.variant}`,
      `ui-progress--${props.status}`,
      {
        'is-indeterminate': props.indeterminate,
      },
    ]"
  >
    <div
      v-if="props.variant === 'linear'"
      class="ui-progress__linear"
      role="progressbar"
      :aria-label="accessibleLabel"
      :aria-valuemin="props.indeterminate ? undefined : 0"
      :aria-valuemax="props.indeterminate ? undefined : normalizedMax"
      :aria-valuenow="props.indeterminate ? undefined : clampedValue"
      :aria-valuetext="props.indeterminate ? 'Loading' : valueLabel"
    >
      <span
        class="ui-progress__linear-indicator"
        :style="props.indeterminate ? undefined : { width: `${percent}%` }"
      />
    </div>

    <div
      v-else
      class="ui-progress__circular"
      role="progressbar"
      :aria-label="accessibleLabel"
      :aria-valuemin="props.indeterminate ? undefined : 0"
      :aria-valuemax="props.indeterminate ? undefined : normalizedMax"
      :aria-valuenow="props.indeterminate ? undefined : clampedValue"
      :aria-valuetext="props.indeterminate ? 'Loading' : valueLabel"
    >
      <svg viewBox="0 0 40 40" class="ui-progress__circular-svg" aria-hidden="true">
        <circle class="ui-progress__circular-track" cx="20" cy="20" r="18" />
        <circle
          class="ui-progress__circular-indicator"
          cx="20"
          cy="20"
          r="18"
          :style="
            props.indeterminate
              ? undefined
              : {
                  strokeDasharray: `${circularCircumference}px`,
                  strokeDashoffset: `${circularOffset}px`,
                }
          "
        />
      </svg>
      <span v-if="props.showValue" class="ui-progress__value">
        {{ valueLabel }}
      </span>
    </div>

    <span v-if="props.variant === 'linear' && props.showValue" class="ui-progress__value">
      {{ valueLabel }}
    </span>
  </div>
</template>
