import { normalizeDataGridQuery } from '../../model/query';
import type { DataGridQuery } from '../../model/types';

export function normalizeInternalDataGridQuery(
  query: Partial<DataGridQuery> | DataGridQuery
): DataGridQuery {
  return normalizeDataGridQuery(query);
}
