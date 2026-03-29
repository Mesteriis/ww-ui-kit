import { computed, type Ref } from 'vue';

import type { UiApexChartError, UiApexChartSeries } from '../types';

function isAxisSeriesEntry(value: unknown): value is { data: unknown[] } {
  return (
    value !== null &&
    typeof value === 'object' &&
    'data' in value &&
    Array.isArray((value as { data: unknown[] }).data)
  );
}

function hasSeriesContent(series: UiApexChartSeries): boolean {
  if (!Array.isArray(series) || series.length === 0) {
    return false;
  }

  if (isAxisSeriesEntry(series[0])) {
    return series.some((entry) => isAxisSeriesEntry(entry) && entry.data.length > 0);
  }

  return series.length > 0;
}

function resolveError(error: UiApexChartError): Error | null {
  if (error instanceof Error) {
    return error;
  }

  if (typeof error === 'string' && error.trim()) {
    return new Error(error);
  }

  if (error) {
    return new Error('Unable to render chart.');
  }

  return null;
}

interface UseApexEmptyStateParams {
  series: Ref<UiApexChartSeries>;
  empty: Ref<boolean | undefined>;
  error: Ref<UiApexChartError>;
  emptyText: Ref<string>;
  errorText: Ref<string>;
  noDataText: Ref<string>;
}

export function useApexEmptyState({
  series,
  empty,
  error,
  emptyText,
  errorText,
  noDataText,
}: UseApexEmptyStateParams) {
  const resolvedError = computed(() => resolveError(error.value));
  const showError = computed(() => Boolean(resolvedError.value));
  const autoEmpty = computed(() => !showError.value && !hasSeriesContent(series.value));
  const showEmpty = computed(() =>
    empty.value === true ? true : empty.value === false ? false : autoEmpty.value
  );
  const resolvedEmptyText = computed(() => emptyText.value || noDataText.value);
  const resolvedErrorText = computed(() => {
    if (resolvedError.value?.message) {
      return resolvedError.value.message;
    }

    return errorText.value;
  });

  return {
    resolvedEmptyText,
    resolvedError,
    resolvedErrorText,
    showEmpty,
    showError,
  };
}
