import { normalizeDataGridQuery } from './query';
import type { DataGridQuery, DataGridSortDirection } from './types';

export function getDataGridSortDirection(
  query: DataGridQuery,
  columnId: string
): DataGridSortDirection | null {
  return query.sort.find((entry) => entry.id === columnId)?.direction ?? null;
}

export function toggleDataGridSort(query: DataGridQuery, columnId: string): DataGridQuery {
  const normalized = normalizeDataGridQuery(query);
  const currentDirection = getDataGridSortDirection(normalized, columnId);

  const nextSort =
    currentDirection === null
      ? [{ id: columnId, direction: 'asc' as const }]
      : currentDirection === 'asc'
        ? [{ id: columnId, direction: 'desc' as const }]
        : [];

  return {
    ...normalized,
    sort: nextSort,
    pagination: {
      ...normalized.pagination,
      page: 1,
    },
  };
}
