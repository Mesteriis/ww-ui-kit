import { getVisibleDataGridColumns } from '../../model/columns';
import { getDataGridPaginationSummary, getDataGridPageCount } from '../../model/pagination';
import { getActiveDataGridFilterCount, hasActiveDataGridQuery } from '../../model/query';
import { isDataGridRowSelected, normalizeDataGridSelection } from '../../model/selection';
import type { DataGridColumn, DataGridQuery, DataGridRowId, DataGridSelectionState } from '../../model/types';

interface DerivedDataGridStateOptions<TRow> {
  rows: readonly TRow[];
  columns: readonly DataGridColumn<TRow>[];
  query: DataGridQuery;
  totalRows: number;
  selectionEnabled: boolean;
  selectedRowIds: readonly DataGridRowId[] | undefined;
  pageRowIds: readonly DataGridRowId[];
}

export interface DerivedDataGridState<TRow> {
  activeFilterCount: number;
  allPageRowsSelected: boolean;
  hasActiveQuery: boolean;
  isEmpty: boolean;
  isNoResults: boolean;
  pageCount: number;
  paginationSummary: { start: number; end: number };
  selectedCount: number;
  selection: DataGridSelectionState;
  somePageRowsSelected: boolean;
  visibleColumns: DataGridColumn<TRow>[];
}

export function createDerivedDataGridState<TRow>(
  options: DerivedDataGridStateOptions<TRow>
): DerivedDataGridState<TRow> {
  const selection = normalizeDataGridSelection(options.selectionEnabled ? options.selectedRowIds : []);
  const selectedOnPage = options.pageRowIds.filter((rowId) => isDataGridRowSelected(selection, rowId)).length;
  const pageCount = getDataGridPageCount(options.totalRows, options.query.pagination.pageSize);

  return {
    activeFilterCount: getActiveDataGridFilterCount(options.query),
    allPageRowsSelected: options.pageRowIds.length > 0 && selectedOnPage === options.pageRowIds.length,
    hasActiveQuery: hasActiveDataGridQuery(options.query),
    isEmpty: options.rows.length === 0 && options.totalRows === 0 && !hasActiveDataGridQuery(options.query),
    isNoResults: options.rows.length === 0 && (options.totalRows > 0 || hasActiveDataGridQuery(options.query)),
    pageCount,
    paginationSummary: getDataGridPaginationSummary(options.query.pagination, options.totalRows),
    selectedCount: selection.length,
    selection,
    somePageRowsSelected: selectedOnPage > 0 && selectedOnPage < options.pageRowIds.length,
    visibleColumns: getVisibleDataGridColumns(options.columns, options.query)
  };
}
