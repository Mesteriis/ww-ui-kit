import { computed, type ComputedRef } from 'vue';

import {
  normalizeDataGridQuery,
  type DataGridQuery,
  type DataGridSelectionState,
} from '@ww/data-grid';

export function useDataTableWidgetState(options: {
  query: ComputedRef<DataGridQuery>;
  totalRows: ComputedRef<number>;
  selectedRowIds: ComputedRef<DataGridSelectionState | undefined>;
}) {
  const normalizedQuery = computed(() => normalizeDataGridQuery(options.query.value));
  const selectedCount = computed(() => options.selectedRowIds.value?.length ?? 0);
  const activeFilterCount = computed(() => Object.keys(normalizedQuery.value.filters).length);
  const hasSearch = computed(() => normalizedQuery.value.search.trim().length > 0);
  const hasActiveQuery = computed(
    () => hasSearch.value || activeFilterCount.value > 0 || normalizedQuery.value.sort.length > 0
  );
  const pageCount = computed(() =>
    Math.max(1, Math.ceil(options.totalRows.value / normalizedQuery.value.pagination.pageSize))
  );

  const statusSummary = computed(() => ({
    totalRows: options.totalRows.value,
    selectedCount: selectedCount.value,
    activeFilterCount: activeFilterCount.value,
    hasSearch: hasSearch.value,
    hasActiveQuery: hasActiveQuery.value,
    page: normalizedQuery.value.pagination.page,
    pageCount: pageCount.value,
    pageSize: normalizedQuery.value.pagination.pageSize,
  }));

  return {
    normalizedQuery,
    selectedCount,
    activeFilterCount,
    hasSearch,
    hasActiveQuery,
    pageCount,
    statusSummary,
  };
}
