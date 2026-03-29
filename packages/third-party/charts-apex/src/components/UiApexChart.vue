<script setup lang="ts">
import { computed, onErrorCaptured, ref, toRef } from 'vue';

import { useId } from '@ww/primitives';

import { useApexClientOnly } from '../composables/useApexClientOnly';
import { useApexEmptyState } from '../composables/useApexEmptyState';
import { useApexThemeOptions } from '../composables/useApexThemeOptions';
import type { UiApexChartProps } from '../types';

defineOptions({ name: 'UiApexChart' });

const props = withDefaults(defineProps<UiApexChartProps>(), {
  width: '100%',
  height: 320,
  loading: false,
  emptyText: 'No data available.',
  errorText: 'Unable to render chart.',
  noDataText: 'No data available.'
});

const hostRef = ref<HTMLElement | null>(null);
const captionId = useId('apex-chart-caption');
const generatedChartId = useId('apex-chart');
const runtimeError = ref<Error | null>(null);
const { apexComponent, clientReady, vendorError } = useApexClientOnly();
const resolvedExternalError = computed(() =>
  props.error === true || typeof props.error === 'string' || props.error instanceof Error
    ? props.error
    : undefined
);
const {
  resolvedEmptyText,
  resolvedErrorText,
  showEmpty,
  showError
} = useApexEmptyState({
  series: toRef(props, 'series'),
  empty: toRef(props, 'empty'),
  error: computed(() => resolvedExternalError.value ?? vendorError.value ?? runtimeError.value),
  emptyText: toRef(props, 'emptyText'),
  errorText: toRef(props, 'errorText'),
  noDataText: toRef(props, 'noDataText')
});

const chartId = computed(() => props.options?.chart?.id ?? generatedChartId.value);
const { resolvedOptions, themeScope } = useApexThemeOptions({
  hostRef,
  chartId,
  type: toRef(props, 'type'),
  options: toRef(props, 'options'),
  noDataText: toRef(props, 'noDataText')
});

const hasCaption = computed(() => Boolean(props.title || props.description));
const accessibleLabel = computed(() => props.ariaLabel || props.title || 'Data chart');
const renderKey = computed(() => `${chartId.value}:${themeScope.value.revision}:${props.type}`);
const showLoadingState = computed(
  () => props.loading && !showError.value && (showEmpty.value || !apexComponent.value)
);
const showLoadingOverlay = computed(
  () => props.loading && !showError.value && !showEmpty.value && Boolean(apexComponent.value)
);

onErrorCaptured((error) => {
  runtimeError.value = error instanceof Error ? error : new Error(String(error));
  return false;
});
</script>

<template>
  <figure
    ref="hostRef"
    class="ui-apex-chart"
    :class="{
      'ui-apex-chart--loading': loading,
      'ui-apex-chart--empty': showEmpty,
      'ui-apex-chart--error': showError
    }"
    :aria-busy="loading ? 'true' : undefined"
    :aria-labelledby="hasCaption ? captionId : undefined"
    :aria-label="!hasCaption ? accessibleLabel : undefined"
  >
    <figcaption v-if="hasCaption" :id="captionId" class="ui-apex-chart__caption">
      <strong v-if="title" class="ui-apex-chart__title">{{ title }}</strong>
      <p v-if="description" class="ui-apex-chart__description">{{ description }}</p>
    </figcaption>

    <div class="ui-apex-chart__frame">
      <div
        v-if="showError"
        class="ui-apex-chart__state ui-apex-chart__state--error"
        role="status"
        aria-live="polite"
      >
        <slot name="error" :message="resolvedErrorText">
          <strong class="ui-apex-chart__state-title">Chart error</strong>
          <p class="ui-apex-chart__state-text">{{ resolvedErrorText }}</p>
        </slot>
      </div>

      <div
        v-else-if="showLoadingState"
        class="ui-apex-chart__state ui-apex-chart__state--loading"
        role="status"
        aria-live="polite"
      >
        <slot name="loading">
          <div class="ui-apex-chart__loading-bar" />
          <div class="ui-apex-chart__loading-bar ui-apex-chart__loading-bar--short" />
        </slot>
      </div>

      <div
        v-else-if="showEmpty"
        class="ui-apex-chart__state ui-apex-chart__state--empty"
        role="status"
        aria-live="polite"
      >
        <slot name="empty" :message="resolvedEmptyText">
          <strong class="ui-apex-chart__state-title">No chart data</strong>
          <p class="ui-apex-chart__state-text">{{ resolvedEmptyText }}</p>
        </slot>
      </div>

      <template v-else>
        <div v-if="showLoadingOverlay" class="ui-apex-chart__overlay" aria-hidden="true">
          <div class="ui-apex-chart__loading-bar" />
        </div>

        <component
          :is="apexComponent"
          v-if="apexComponent && clientReady"
          :key="renderKey"
          class="ui-apex-chart__vendor"
          :type="props.type"
          :series="props.series"
          :options="resolvedOptions"
          :width="props.width"
          :height="props.height"
        />

        <div v-else class="ui-apex-chart__shell" role="presentation" />
      </template>
    </div>
  </figure>
</template>
