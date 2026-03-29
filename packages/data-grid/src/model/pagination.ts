import { normalizeDataGridQuery } from './query';
import type { DataGridPagination, DataGridQuery } from './types';

export function getDataGridPageCount(totalRows: number, pageSize: number): number {
  return Math.max(1, Math.ceil(Math.max(0, totalRows) / Math.max(1, pageSize)));
}

export function setDataGridPage(query: DataGridQuery, page: number): DataGridQuery {
  const normalized = normalizeDataGridQuery(query);
  return {
    ...normalized,
    pagination: {
      ...normalized.pagination,
      page: Math.max(1, Math.trunc(page))
    }
  };
}

export function setDataGridPageSize(query: DataGridQuery, pageSize: number): DataGridQuery {
  const normalized = normalizeDataGridQuery(query);
  return {
    ...normalized,
    pagination: {
      page: 1,
      pageSize: Math.max(1, Math.trunc(pageSize))
    }
  };
}

export function getDataGridPaginationSummary(
  pagination: DataGridPagination,
  totalRows: number
): { start: number; end: number } {
  if (totalRows <= 0) {
    return { start: 0, end: 0 };
  }

  const start = (pagination.page - 1) * pagination.pageSize + 1;
  const end = Math.min(totalRows, start + pagination.pageSize - 1);

  return { start, end };
}
