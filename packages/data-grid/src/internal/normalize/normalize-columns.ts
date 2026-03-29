import type { DataGridColumn } from '../../model/types';

export function normalizeDataGridColumns<TRow>(
  columns: readonly DataGridColumn<TRow>[]
): DataGridColumn<TRow>[] {
  return columns.map((column) => ({
    sortable: false,
    hideable: true,
    align: 'start',
    ...column,
  }));
}
