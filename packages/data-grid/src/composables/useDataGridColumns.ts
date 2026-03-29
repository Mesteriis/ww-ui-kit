import { computed, toValue, type MaybeRefOrGetter } from 'vue';

import { getHideableDataGridColumns } from '../model/columns';
import { normalizeDataGridColumns } from '../internal/normalize/normalize-columns';
import type { DataGridColumn } from '../model/types';

interface DataGridColumnsOptions<TRow> {
  columns: MaybeRefOrGetter<readonly DataGridColumn<TRow>[]>;
}

export function useDataGridColumns<TRow>(options: DataGridColumnsOptions<TRow>) {
  const normalizedColumns = computed(() => normalizeDataGridColumns(toValue(options.columns)));
  const hideableColumns = computed(() => getHideableDataGridColumns(normalizedColumns.value));

  return {
    normalizedColumns,
    hideableColumns
  };
}
