import { ref } from 'vue';
import { describe, expect, it } from 'vitest';

import { useApexEmptyState } from './useApexEmptyState';

describe('useApexEmptyState', () => {
  it('derives empty state and text for axis and non-axis series without treating zeroes as empty', () => {
    const axisState = useApexEmptyState({
      series: ref([{ name: 'Traffic', data: [] }]),
      empty: ref(undefined),
      error: ref(undefined),
      emptyText: ref(''),
      errorText: ref('Fallback error'),
      noDataText: ref('No chart data'),
    });

    expect(axisState.showError.value).toBe(false);
    expect(axisState.showEmpty.value).toBe(true);
    expect(axisState.resolvedEmptyText.value).toBe('No chart data');
    expect(axisState.resolvedErrorText.value).toBe('Fallback error');

    const seriesWithZeroes = useApexEmptyState({
      series: ref([0, 0, 0]),
      empty: ref(undefined),
      error: ref(undefined),
      emptyText: ref('Empty'),
      errorText: ref('Fallback error'),
      noDataText: ref('No chart data'),
    });

    expect(seriesWithZeroes.showEmpty.value).toBe(false);
    expect(seriesWithZeroes.resolvedEmptyText.value).toBe('Empty');
  });

  it('honors explicit empty overrides and resolves error values predictably', () => {
    const explicitState = useApexEmptyState({
      series: ref([{ name: 'Revenue', data: [10] }]),
      empty: ref(true),
      error: ref('Vendor failed'),
      emptyText: ref('Nothing yet'),
      errorText: ref('Fallback error'),
      noDataText: ref('No chart data'),
    });

    expect(explicitState.showError.value).toBe(true);
    expect(explicitState.showEmpty.value).toBe(true);
    expect(explicitState.resolvedErrorText.value).toBe('Vendor failed');

    const booleanErrorState = useApexEmptyState({
      series: ref([]),
      empty: ref(false),
      error: ref(true),
      emptyText: ref('Nothing yet'),
      errorText: ref('Fallback error'),
      noDataText: ref('No chart data'),
    });

    expect(booleanErrorState.showError.value).toBe(true);
    expect(booleanErrorState.resolvedErrorText.value).toBe('Unable to render chart.');
    expect(booleanErrorState.showEmpty.value).toBe(false);

    const errorObjectState = useApexEmptyState({
      series: ref([]),
      empty: ref(undefined),
      error: ref(new Error('Real error')),
      emptyText: ref('Nothing yet'),
      errorText: ref('Fallback error'),
      noDataText: ref('No chart data'),
    });

    expect(errorObjectState.resolvedErrorText.value).toBe('Real error');
  });

  it('treats non-array input as empty and falls back to the configured error text', () => {
    const state = useApexEmptyState({
      series: ref({} as unknown as []),
      empty: ref(undefined),
      error: ref(false),
      emptyText: ref(''),
      errorText: ref('Fallback error'),
      noDataText: ref('No chart data'),
    });

    expect(state.showEmpty.value).toBe(true);
    expect(state.resolvedErrorText.value).toBe('Fallback error');
  });
});
