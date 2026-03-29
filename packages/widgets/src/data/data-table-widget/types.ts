import type {
  DataGridColumn,
  DataGridDensity,
  DataGridFilterDefinition,
  DataGridQuery,
  DataGridRowId,
  DataGridRowIdAccessor,
  DataGridSelectionState,
} from '@ww/data-grid';

import type { WidgetErrorState, WidgetSurface } from '../../shared/types';

export interface DataTableWidgetStatusSummary {
  totalRows: number;
  selectedCount: number;
  activeFilterCount: number;
  hasSearch: boolean;
  hasActiveQuery: boolean;
  page: number;
  pageCount: number;
  pageSize: number;
}

export interface DataTableWidgetProps<
  TRow extends Record<string, unknown> = Record<string, unknown>,
> {
  title?: string;
  description?: string;
  rows: readonly TRow[];
  columns: readonly DataGridColumn<TRow>[];
  query: DataGridQuery;
  totalRows: number;
  loading?: boolean;
  error?: WidgetErrorState;
  selectedRowIds?: DataGridSelectionState;
  rowId?: DataGridRowIdAccessor<TRow>;
  filterDefinitions?: readonly DataGridFilterDefinition[];
  pageSizeOptions?: readonly number[];
  searchPlaceholder?: string;
  emptyText?: string;
  noResultsText?: string;
  errorText?: string;
  caption?: string;
  ariaLabel?: string;
  surface?: WidgetSurface;
  padded?: boolean;
  showHeader?: boolean;
  showToolbar?: boolean;
  showStatusBar?: boolean;
  showColumnVisibility?: boolean;
  showBulkActions?: boolean;
  stickyHeader?: boolean;
  density?: DataGridDensity;
}

export interface DataTableWidgetBulkActionsSlotProps {
  selectedCount: number;
  selectedRowIds: readonly DataGridRowId[];
  clearSelection: () => void;
}
