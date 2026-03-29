import { computed } from 'vue';

import { createDerivedDataGridState } from '../internal/state/derived-grid-state';
import { useDataGridA11y } from './useDataGridA11y';
import { useDataGridColumns } from './useDataGridColumns';
import { useDataGridQuery } from './useDataGridQuery';
import { useDataGridSelection } from './useDataGridSelection';
import type {
  DataGridColumn,
  DataGridDensity,
  DataGridFilterDefinition,
  DataGridQuery,
  DataGridRowId,
  DataGridRowIdAccessor
} from '../model/types';

export interface DataGridControllerProps<TRow extends Record<string, unknown>> {
  rows: readonly TRow[];
  columns: readonly DataGridColumn<TRow>[];
  query: DataGridQuery;
  totalRows: number;
  loading?: boolean;
  error?: boolean | string;
  selectedRowIds?: readonly DataGridRowId[];
  rowId?: DataGridRowIdAccessor<TRow>;
  filterDefinitions?: readonly DataGridFilterDefinition[];
  pageSizeOptions?: readonly number[];
  searchPlaceholder?: string;
  emptyText?: string;
  noResultsText?: string;
  errorText?: string;
  ariaLabel?: string;
  caption?: string;
  density?: DataGridDensity;
  stickyHeader?: boolean;
}

interface DataGridControllerEmit {
  (event: 'update:query', value: DataGridQuery): void;
  (event: 'update:selectedRowIds', value: readonly DataGridRowId[]): void;
}

export function useDataGridController<TRow extends Record<string, unknown>>(
  props: DataGridControllerProps<TRow>,
  emit: DataGridControllerEmit
) {
  const selectionEnabled = computed(() => props.selectedRowIds !== undefined);
  const pageSizeOptions = computed(() => props.pageSizeOptions?.length ? [...props.pageSizeOptions] : [10, 20, 50]);

  const a11y = useDataGridA11y({
    ariaLabel: computed(() => props.ariaLabel),
    caption: computed(() => props.caption)
  });

  const query = useDataGridQuery({
    query: computed(() => props.query),
    onChange: (nextQuery) => emit('update:query', nextQuery)
  });

  const columns = useDataGridColumns({
    columns: computed(() => props.columns)
  });

  const selection = useDataGridSelection({
    rows: computed(() => props.rows),
    rowId: computed(() => props.rowId),
    selectedRowIds: computed(() => props.selectedRowIds),
    selectionEnabled,
    onChange: (nextSelection) => emit('update:selectedRowIds', nextSelection)
  });

  const derivedState = computed(() =>
    createDerivedDataGridState({
      rows: props.rows,
      columns: columns.normalizedColumns.value,
      query: query.normalizedQuery.value,
      totalRows: props.totalRows,
      selectionEnabled: selectionEnabled.value,
      selectedRowIds: props.selectedRowIds,
      pageRowIds: selection.pageRowIds.value
    })
  );

  return {
    a11y,
    columns,
    derivedState,
    pageSizeOptions,
    query,
    selection,
    selectionEnabled,
    density: computed(() => props.density ?? 'comfortable'),
    stickyHeader: computed(() => props.stickyHeader ?? false),
    isError: computed(() => Boolean(props.error)),
    isLoading: computed(() => Boolean(props.loading)),
    errorMessage: computed(() =>
      typeof props.error === 'string' ? props.error : (props.errorText ?? 'This data grid surface is unavailable.')
    ),
    emptyText: computed(() => props.emptyText ?? 'No rows available yet.'),
    noResultsText: computed(() => props.noResultsText ?? 'No rows match the current search and filters.'),
    filterDefinitions: computed(() => props.filterDefinitions ?? []),
    searchPlaceholder: computed(() => props.searchPlaceholder ?? 'Search rows')
  };
}
