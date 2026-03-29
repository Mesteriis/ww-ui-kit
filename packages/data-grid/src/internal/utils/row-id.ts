import type { DataGridRowId, DataGridRowIdAccessor } from '../../model/types';

const warnedScopes = new Set<string>();

function warnFallback(scope: string) {
  if (warnedScopes.has(scope) || typeof console === 'undefined') {
    return;
  }

  warnedScopes.add(scope);
  console.warn(
    `[ui-data-grid] Falling back to row index ids for "${scope}". Provide rowId or stable row.id values for selection persistence.`
  );
}

export function resolveDataGridRowId<TRow extends Record<string, unknown>>(
  row: TRow,
  rowIndex: number,
  rowIdAccessor: DataGridRowIdAccessor<TRow> | undefined,
  scope = 'ui-data-grid'
): DataGridRowId {
  if (typeof rowIdAccessor === 'function') {
    return String(rowIdAccessor(row, rowIndex));
  }

  if (typeof rowIdAccessor === 'string') {
    return String(row[rowIdAccessor]);
  }

  if (typeof row.id === 'string' || typeof row.id === 'number') {
    return String(row.id);
  }

  warnFallback(scope);
  return String(rowIndex);
}

export function __resetDataGridRowIdWarnings() {
  warnedScopes.clear();
}
