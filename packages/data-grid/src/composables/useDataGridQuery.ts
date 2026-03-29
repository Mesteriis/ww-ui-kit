import { computed, toValue, type MaybeRefOrGetter } from 'vue';

import { setDataGridFilter } from '../model/filters';
import { setDataGridPage, setDataGridPageSize } from '../model/pagination';
import { normalizeDataGridQuery } from '../model/query';
import { toggleDataGridSort } from '../model/sorting';
import { resetDataGridColumnVisibility, setDataGridColumnVisibility } from '../model/columns';
import type { DataGridFilterValue, DataGridQuery } from '../model/types';

interface DataGridQueryOptions {
  query: MaybeRefOrGetter<DataGridQuery>;
  onChange: (nextQuery: DataGridQuery) => void;
}

export function useDataGridQuery(options: DataGridQueryOptions) {
  const normalizedQuery = computed(() => normalizeDataGridQuery(toValue(options.query)));

  const updateQuery = (updater: (query: DataGridQuery) => DataGridQuery) => {
    options.onChange(updater(normalizedQuery.value));
  };

  return {
    normalizedQuery,
    updateSearch(search: string) {
      updateQuery((query) => ({
        ...query,
        search,
        pagination: {
          ...query.pagination,
          page: 1,
        },
      }));
    },
    updateFilter(filterId: string, value: DataGridFilterValue | undefined) {
      updateQuery((query) => setDataGridFilter(query, filterId, value));
    },
    toggleSort(columnId: string) {
      updateQuery((query) => toggleDataGridSort(query, columnId));
    },
    setPage(page: number) {
      updateQuery((query) => setDataGridPage(query, page));
    },
    setPageSize(pageSize: number) {
      updateQuery((query) => setDataGridPageSize(query, pageSize));
    },
    setColumnVisibility(columnId: string, visible: boolean) {
      updateQuery((query) => setDataGridColumnVisibility(query, columnId, visible));
    },
    resetColumnVisibility() {
      updateQuery((query) => resetDataGridColumnVisibility(query));
    },
  };
}
