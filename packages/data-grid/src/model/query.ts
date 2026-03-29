import type { DataGridFilterValue, DataGridQuery, DataGridSort } from './types';

const cloneSort = (sort: readonly DataGridSort[] | undefined): DataGridSort[] =>
  (sort ?? [])
    .filter((entry) => entry.id && (entry.direction === 'asc' || entry.direction === 'desc'))
    .map((entry) => ({
      id: entry.id,
      direction: entry.direction,
    }));

const cloneFilters = (
  filters: Record<string, DataGridFilterValue> | undefined
): Record<string, DataGridFilterValue> =>
  Object.fromEntries(
    Object.entries(filters ?? {}).map(([key, value]) => [
      key,
      Array.isArray(value) ? Array.from(value as readonly string[]) : value,
    ])
  );

const cloneColumnVisibility = (columnVisibility: Record<string, boolean> | undefined) =>
  columnVisibility ? { ...columnVisibility } : undefined;

export function normalizeDataGridQuery(
  query: Partial<DataGridQuery> | DataGridQuery
): DataGridQuery {
  const normalized: DataGridQuery = {
    search: String(query.search ?? ''),
    filters: cloneFilters(query.filters),
    sort: cloneSort(query.sort),
    pagination: {
      page: Math.max(1, Math.trunc(query.pagination?.page ?? 1)),
      pageSize: Math.max(1, Math.trunc(query.pagination?.pageSize ?? 10)),
    },
  };

  const columnVisibility = cloneColumnVisibility(query.columnVisibility);
  if (columnVisibility) {
    normalized.columnVisibility = columnVisibility;
  }

  return normalized;
}

export function hasActiveDataGridSearch(query: DataGridQuery): boolean {
  return query.search.trim().length > 0;
}

export function hasActiveDataGridFilters(query: DataGridQuery): boolean {
  return Object.keys(query.filters).length > 0;
}

export function getActiveDataGridFilterCount(query: DataGridQuery): number {
  return Object.keys(query.filters).length;
}

export function hasActiveDataGridQuery(query: DataGridQuery): boolean {
  return hasActiveDataGridSearch(query) || hasActiveDataGridFilters(query) || query.sort.length > 0;
}
