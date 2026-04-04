import { computed, defineComponent, ref } from 'vue';

import {
  UiDataGridBulkActions,
  UiDataGridColumnVisibility,
  UiDataGridFilters,
  UiDataGridPagination,
  UiDataGridSearch,
  UiDataGridTable,
  UiDataGridToolbar,
  normalizeDataGridQuery,
  type DataGridColumn,
  type DataGridQuery,
  type DataGridRowId,
} from '@ww/data-grid';
import { UiBadge, UiButton, UiCard } from '@ww/core';

import {
  applyDataGridQuery,
  createBaseQuery,
  dataGridColumns,
  dataGridFilterDefinitions,
  dataGridRows,
  dataGridUiColumns,
} from './data-grid-fixtures';

const toNextSort = (query: DataGridQuery, columnId: string): DataGridQuery['sort'] => {
  const current = query.sort[0];
  if (!current || current.id !== columnId) {
    return [{ id: columnId, direction: 'asc' }];
  }

  if (current.direction === 'asc') {
    return [{ id: columnId, direction: 'desc' }];
  }

  return [];
};

const getPageRowIds = (rows: readonly Record<string, unknown>[]) =>
  rows
    .map((row) => row.id)
    .filter((value): value is DataGridRowId => typeof value === 'string' || typeof value === 'number');

export default defineComponent({
  name: 'DataGridSubcomponentsStoryHarness',
  components: {
    UiBadge,
    UiButton,
    UiCard,
    UiDataGridBulkActions,
    UiDataGridColumnVisibility,
    UiDataGridFilters,
    UiDataGridPagination,
    UiDataGridSearch,
    UiDataGridTable,
    UiDataGridToolbar,
  },
  setup() {
    const query = ref(
      createBaseQuery({
        columnVisibility: {
          active: false,
        },
      })
    );
    const selectedRowIds = ref<readonly DataGridRowId[]>(['acc-002', 'acc-004']);
    const lastClickedRow = ref('none');

    const result = computed(() => applyDataGridQuery(dataGridRows, dataGridColumns, query.value));
    const visibleColumns = computed(() =>
      dataGridUiColumns.filter(
        (column) =>
          (query.value.columnVisibility as Record<string, boolean> | undefined)?.[column.id] !== false
      ) as readonly DataGridColumn<Record<string, unknown>>[]
    );
    const pageCount = computed(() =>
      Math.max(1, Math.ceil(result.value.totalRows / query.value.pagination.pageSize))
    );
    const summaryStart = computed(() =>
      result.value.totalRows === 0
        ? 0
        : (query.value.pagination.page - 1) * query.value.pagination.pageSize + 1
    );
    const summaryEnd = computed(() =>
      Math.min(result.value.totalRows, query.value.pagination.page * query.value.pagination.pageSize)
    );
    const pageRows = computed(() => result.value.pageRows as readonly Record<string, unknown>[]);
    const pageRowIds = computed(() => getPageRowIds(pageRows.value));
    const allPageRowsSelected = computed(
      () =>
        pageRowIds.value.length > 0 &&
        pageRowIds.value.every((rowId) => selectedRowIds.value.includes(rowId))
    );
    const hideableColumns = computed(() =>
      dataGridUiColumns.filter((column) => column.hideable !== false) as readonly DataGridColumn[]
    );

    const updateQuery = (nextQuery: Partial<DataGridQuery>) => {
      query.value = normalizeDataGridQuery({
        ...query.value,
        ...nextQuery,
      });
    };

    const updateSearch = (value: string) => {
      updateQuery({
        search: value,
        pagination: {
          ...query.value.pagination,
          page: 1,
        },
      });
    };

    const updateFilter = (filterId: string, value: DataGridQuery['filters'][string]) => {
      updateQuery({
        filters: {
          ...query.value.filters,
          [filterId]: value,
        },
        pagination: {
          ...query.value.pagination,
          page: 1,
        },
      });
    };

    const updateColumnVisibility = (columnId: string, visible: boolean) => {
      updateQuery({
        columnVisibility: {
          ...(query.value.columnVisibility ?? {}),
          [columnId]: visible,
        },
      });
    };

    const resetColumnVisibility = () => {
      updateQuery({
        columnVisibility: {},
      });
    };

    const toggleRow = (rowId: DataGridRowId) => {
      selectedRowIds.value = selectedRowIds.value.includes(rowId)
        ? selectedRowIds.value.filter((candidate) => candidate !== rowId)
        : [...selectedRowIds.value, rowId];
    };

    const toggleAllRows = (checked: boolean) => {
      selectedRowIds.value = checked ? pageRowIds.value : [];
    };

    const updatePage = (page: number) => {
      updateQuery({
        pagination: {
          ...query.value.pagination,
          page: Math.min(Math.max(page, 1), pageCount.value),
        },
      });
    };

    const updatePageSize = (pageSize: number) => {
      updateQuery({
        pagination: {
          page: 1,
          pageSize,
        },
      });
    };

    const handleRowClick = (_row: Record<string, unknown>, rowId: DataGridRowId) => {
      lastClickedRow.value = String(rowId);
    };

    return {
      allPageRowsSelected,
      dataGridFilterDefinitions,
      handleRowClick,
      hideableColumns,
      lastClickedRow,
      pageCount,
      pageRows,
      query,
      resetColumnVisibility,
      result,
      selectedRowIds,
      summaryEnd,
      summaryStart,
      updateColumnVisibility,
      updateFilter,
      updatePage,
      updatePageSize,
      updateQuery,
      updateSearch,
      visibleColumns,
      toNextSort,
      toggleAllRows,
      toggleRow,
    };
  },
  template: `
    <div class="ui-stack" style="display: grid; gap: var(--ui-space-5);">
      <UiCard>
        <template #header>Toolbar primitives</template>
        <div style="display: grid; gap: var(--ui-space-4);">
          <UiDataGridToolbar
            :search="query.search"
            search-placeholder="Search accounts"
            :filter-definitions="dataGridFilterDefinitions"
            :filters="query.filters"
            :hideable-columns="hideableColumns"
            :column-visibility="query.columnVisibility"
            @update-search="updateSearch"
            @update-filter="updateFilter"
            @update-column-visibility="updateColumnVisibility"
            @reset-column-visibility="resetColumnVisibility"
          >
            <template #toolbar-end>
              <UiBadge variant="brand">Toolbar assembly</UiBadge>
            </template>
          </UiDataGridToolbar>

          <div
            style="
              display: grid;
              gap: var(--ui-space-4);
              grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
            "
          >
            <UiDataGridSearch
              :model-value="query.search"
              placeholder="Search accounts"
              @update:model-value="updateSearch"
            />

            <UiDataGridFilters
              :definitions="dataGridFilterDefinitions"
              :filters="query.filters"
              @update-filter="updateFilter"
            />

            <UiDataGridColumnVisibility
              :columns="hideableColumns"
              :column-visibility="query.columnVisibility"
              @visibility-change="updateColumnVisibility"
              @reset="resetColumnVisibility"
            />
          </div>
        </div>
      </UiCard>

      <UiCard>
        <template #header>Table primitives</template>
        <div style="display: grid; gap: var(--ui-space-4);">
          <UiDataGridBulkActions
            :selected-count="selectedRowIds.length"
            @clear="selectedRowIds = []"
          >
            <UiButton size="sm" variant="secondary">Export selection</UiButton>
          </UiDataGridBulkActions>

          <UiDataGridTable
            :rows="pageRows"
            :columns="visibleColumns"
            :query="query"
            selection-enabled
            :selected-row-ids="selectedRowIds"
            :all-page-rows-selected="allPageRowsSelected"
            sticky-header
            @sort="updateQuery({ sort: toNextSort(query, $event) })"
            @toggle-row="toggleRow"
            @toggle-all-rows="toggleAllRows"
            @row-click="handleRowClick"
          >
            <template #cell="{ column, value }">
              <UiBadge
                v-if="column.id === 'status'"
                :variant="value === 'Healthy' ? 'success' : value === 'Watch' ? 'warning' : 'danger'"
              >
                {{ value }}
              </UiBadge>
              <template v-else>{{ value }}</template>
            </template>
          </UiDataGridTable>

          <UiDataGridPagination
            :page="query.pagination.page"
            :page-count="pageCount"
            :page-size="query.pagination.pageSize"
            :total-rows="result.totalRows"
            :page-size-options="[5, 10, 20]"
            :summary-start="summaryStart"
            :summary-end="summaryEnd"
            @page-change="updatePage"
            @page-size-change="updatePageSize"
          />

          <UiBadge>Last row click: {{ lastClickedRow }}</UiBadge>
        </div>
      </UiCard>
    </div>
  `,
});
