import { normalizeDataGridQuery } from './query';
import type { DataGridFilterValue, DataGridQuery } from './types';

function isEmptyFilterValue(value: DataGridFilterValue | undefined): boolean {
  if (value === null || value === undefined) {
    return true;
  }

  if (Array.isArray(value)) {
    return value.length === 0;
  }

  if (typeof value === 'string') {
    return value.trim().length === 0;
  }

  return false;
}

export function setDataGridFilter(
  query: DataGridQuery,
  filterId: string,
  value: DataGridFilterValue | undefined
): DataGridQuery {
  const normalized = normalizeDataGridQuery(query);
  const nextFilters: Record<string, DataGridFilterValue> = { ...normalized.filters };

  if (isEmptyFilterValue(value)) {
    delete nextFilters[filterId];
  } else {
    const nextValue = Array.isArray(value) ? Array.from(value as readonly string[]) : value;
    nextFilters[filterId] = nextValue as DataGridFilterValue;
  }

  return {
    ...normalized,
    filters: nextFilters,
    pagination: {
      ...normalized.pagination,
      page: 1,
    },
  };
}

export function clearDataGridFilters(query: DataGridQuery): DataGridQuery {
  const normalized = normalizeDataGridQuery(query);
  return {
    ...normalized,
    filters: {},
    pagination: {
      ...normalized.pagination,
      page: 1,
    },
  };
}
