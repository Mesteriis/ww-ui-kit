export type DataGridRowId = string;

export type DataGridDensity = 'comfortable' | 'compact';
export type DataGridSortDirection = 'asc' | 'desc';
export type DataGridSelectionState = readonly DataGridRowId[];
export type DataGridFilterValue = string | boolean | readonly string[] | null;

export interface DataGridSort {
  id: string;
  direction: DataGridSortDirection;
}

export interface DataGridPagination {
  page: number;
  pageSize: number;
}

export interface DataGridQuery {
  search: string;
  filters: Record<string, DataGridFilterValue>;
  sort: DataGridSort[];
  pagination: DataGridPagination;
  columnVisibility?: Record<string, boolean>;
}

export interface DataGridFilterOption {
  label: string;
  value: string;
}

interface DataGridFilterBase {
  id: string;
  label: string;
}

export interface DataGridTextFilterDefinition extends DataGridFilterBase {
  type: 'text';
  placeholder?: string;
}

export interface DataGridSelectFilterDefinition extends DataGridFilterBase {
  type: 'select';
  options: readonly DataGridFilterOption[];
  placeholder?: string;
}

export interface DataGridMultiSelectFilterDefinition extends DataGridFilterBase {
  type: 'multi-select';
  options: readonly DataGridFilterOption[];
  placeholder?: string;
}

export interface DataGridBooleanFilterDefinition extends DataGridFilterBase {
  type: 'boolean';
  trueLabel?: string;
  falseLabel?: string;
}

export type DataGridFilterDefinition =
  | DataGridTextFilterDefinition
  | DataGridSelectFilterDefinition
  | DataGridMultiSelectFilterDefinition
  | DataGridBooleanFilterDefinition;

export type DataGridRowIdAccessor<TRow = Record<string, unknown>> =
  | Extract<keyof TRow, string>
  | ((row: TRow, rowIndex: number) => DataGridRowId);

export type DataGridColumnAlignment = 'start' | 'center' | 'end';
export type DataGridCellValue = string | number | boolean | null | undefined;

export interface DataGridColumn<TRow = Record<string, unknown>> {
  id: string;
  header: string;
  accessorKey?: Extract<keyof TRow, string>;
  accessor?: (row: TRow) => unknown;
  cell?: (context: DataGridCellContext<TRow>) => DataGridCellValue;
  sortable?: boolean;
  hideable?: boolean;
  align?: DataGridColumnAlignment;
  width?: string;
}

export interface DataGridCellContext<TRow = Record<string, unknown>> {
  row: TRow;
  rowId: DataGridRowId;
  rowIndex: number;
  column: DataGridColumn<TRow>;
  value: unknown;
  selected: boolean;
}
