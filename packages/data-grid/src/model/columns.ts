import { normalizeDataGridQuery } from './query';
import type {
  DataGridCellContext,
  DataGridCellValue,
  DataGridColumn,
  DataGridQuery,
} from './types';

export function createDataGridColumn<TRow>(column: DataGridColumn<TRow>): DataGridColumn<TRow> {
  return column;
}

export function getDataGridColumnValue<TRow>(row: TRow, column: DataGridColumn<TRow>): unknown {
  if (column.accessor) {
    return column.accessor(row);
  }

  if (column.accessorKey) {
    return (row as Record<string, unknown>)[column.accessorKey];
  }

  return undefined;
}

export function renderDataGridCellValue<TRow>(
  context: DataGridCellContext<TRow>
): DataGridCellValue {
  if (context.column.cell) {
    return context.column.cell(context);
  }

  const { value } = context;
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (value === null || value === undefined || value === '') {
    return '—';
  }

  if (typeof value === 'string' || typeof value === 'number') {
    return value;
  }

  if (typeof value === 'bigint') {
    return value.toString();
  }

  if (typeof value === 'symbol') {
    return value.description ? `Symbol(${value.description})` : 'Symbol()';
  }

  try {
    return JSON.stringify(value) ?? Object.prototype.toString.call(value);
  } catch {
    return Object.prototype.toString.call(value);
  }
}

export function isDataGridColumnVisible<TRow>(
  column: DataGridColumn<TRow>,
  query: DataGridQuery
): boolean {
  if (!column.hideable) {
    return true;
  }

  return query.columnVisibility?.[column.id] !== false;
}

export function getVisibleDataGridColumns<TRow>(
  columns: readonly DataGridColumn<TRow>[],
  query: DataGridQuery
): DataGridColumn<TRow>[] {
  return columns.filter((column) => isDataGridColumnVisible(column, query));
}

export function getHideableDataGridColumns<TRow>(
  columns: readonly DataGridColumn<TRow>[]
): DataGridColumn<TRow>[] {
  return columns.filter((column) => column.hideable !== false);
}

export function setDataGridColumnVisibility(
  query: DataGridQuery,
  columnId: string,
  visible: boolean
): DataGridQuery {
  const normalized = normalizeDataGridQuery(query);
  const columnVisibility = { ...(normalized.columnVisibility ?? {}) };
  columnVisibility[columnId] = visible;

  return {
    ...normalized,
    columnVisibility,
  };
}

export function toggleDataGridColumnVisibility(
  query: DataGridQuery,
  columnId: string
): DataGridQuery {
  const normalized = normalizeDataGridQuery(query);
  const isVisible = normalized.columnVisibility?.[columnId] !== false;
  return setDataGridColumnVisibility(normalized, columnId, !isVisible);
}

export function resetDataGridColumnVisibility(query: DataGridQuery): DataGridQuery {
  const normalized = normalizeDataGridQuery(query);
  return {
    ...normalized,
    columnVisibility: {},
  };
}
