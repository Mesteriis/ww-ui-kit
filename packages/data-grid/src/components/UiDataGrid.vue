<script setup lang="ts">
import { computed } from 'vue';
import { UiEmptyState, UiSpinner } from '@ww/core';

import {
  useDataGridController,
  type DataGridControllerProps,
} from '../composables/useDataGridController';
import UiDataGridBulkActions from './UiDataGridBulkActions.vue';
import UiDataGridPagination from './UiDataGridPagination.vue';
import UiDataGridTable from './UiDataGridTable.vue';
import UiDataGridToolbar from './UiDataGridToolbar.vue';
import type {
  DataGridColumn,
  DataGridDensity,
  DataGridFilterDefinition,
  DataGridQuery,
  DataGridRowId,
  DataGridRowIdAccessor,
} from '../model/types';

defineOptions({ name: 'UiDataGrid' });

const props = withDefaults(
  defineProps<{
    rows: readonly Record<string, unknown>[];
    columns: readonly DataGridColumn<Record<string, unknown>>[];
    query: DataGridQuery;
    totalRows: number;
    loading?: boolean;
    error?: boolean | string;
    selectedRowIds?: readonly DataGridRowId[];
    rowId?: DataGridRowIdAccessor<Record<string, unknown>>;
    filterDefinitions?: readonly DataGridFilterDefinition[];
    pageSizeOptions?: readonly number[];
    searchPlaceholder?: string;
    emptyText?: string;
    noResultsText?: string;
    errorText?: string;
    ariaLabel?: string;
    caption?: string;
    density?: DataGridDensity;
    stickyHeader?: boolean;
    showToolbar?: boolean;
    showBulkActions?: boolean;
    showColumnVisibility?: boolean;
  }>(),
  {
    loading: false,
    error: false,
    filterDefinitions: () => [],
    pageSizeOptions: () => [10, 20, 50],
    searchPlaceholder: 'Search rows',
    emptyText: 'No rows available yet.',
    noResultsText: 'No rows match the current search and filters.',
    errorText: 'This data grid surface is unavailable.',
    density: 'comfortable',
    stickyHeader: false,
    showToolbar: true,
    showBulkActions: true,
    showColumnVisibility: true,
  }
);

const emit = defineEmits<{
  'update:query': [value: DataGridQuery];
  'update:selectedRowIds': [value: readonly DataGridRowId[]];
  rowClick: [row: Record<string, unknown>, rowId: DataGridRowId];
}>();

const controller = useDataGridController(
  props as DataGridControllerProps<Record<string, unknown>>,
  emit
);
const tableRowIdBinding = computed(() => (props.rowId ? { rowId: props.rowId } : {}));

const onRowClick = (row: Record<string, unknown>, rowId: DataGridRowId) => {
  emit('rowClick', row, rowId);
};
</script>

<template>
  <figure
    class="ui-data-grid"
    :data-ui-density="controller.density.value"
    :aria-busy="controller.isLoading.value || undefined"
    :aria-labelledby="controller.a11y.labelledBy.value"
    :aria-label="controller.a11y.labelledBy.value ? undefined : controller.a11y.ariaLabel.value"
  >
    <figcaption
      v-if="controller.a11y.caption.value"
      :id="controller.a11y.captionId.value"
      class="ui-data-grid__caption"
    >
      {{ controller.a11y.caption.value }}
    </figcaption>

    <UiDataGridToolbar
      v-if="props.showToolbar"
      :search="controller.query.normalizedQuery.value.search"
      :search-placeholder="controller.searchPlaceholder.value"
      :filter-definitions="controller.filterDefinitions.value"
      :filters="controller.query.normalizedQuery.value.filters"
      :hideable-columns="controller.columns.hideableColumns.value"
      :column-visibility="controller.query.normalizedQuery.value.columnVisibility"
      :show-column-visibility="props.showColumnVisibility"
      :disabled="controller.isLoading.value"
      @update-search="controller.query.updateSearch"
      @update-filter="controller.query.updateFilter"
      @update-column-visibility="controller.query.setColumnVisibility"
      @reset-column-visibility="controller.query.resetColumnVisibility"
    >
      <template #toolbar-start>
        <slot name="toolbar-start" />
      </template>
      <template #toolbar-end>
        <slot name="toolbar-end" />
      </template>
    </UiDataGridToolbar>

    <UiDataGridBulkActions
      v-if="
        props.showBulkActions &&
        controller.selectionEnabled.value &&
        controller.derivedState.value.selectedCount > 0
      "
      :selected-count="controller.derivedState.value.selectedCount"
      @clear="controller.selection.clearSelection"
    >
      <slot
        name="bulk-actions"
        :selected-count="controller.derivedState.value.selectedCount"
        :selected-row-ids="controller.derivedState.value.selection"
        :clear-selection="controller.selection.clearSelection"
      />
    </UiDataGridBulkActions>

    <div v-if="controller.isError.value" class="ui-data-grid__state ui-data-grid__state--error">
      <slot name="error" :message="controller.errorMessage.value">
        <UiEmptyState title="Data grid unavailable" :description="controller.errorMessage.value" />
      </slot>
    </div>

    <div
      v-else-if="controller.isLoading.value && props.rows.length === 0"
      class="ui-data-grid__state ui-data-grid__state--loading"
    >
      <slot name="loading">
        <div class="ui-data-grid__loading">
          <UiSpinner />
          <span>Loading rows…</span>
        </div>
      </slot>
    </div>

    <div
      v-else-if="controller.derivedState.value.isEmpty"
      class="ui-data-grid__state ui-data-grid__state--empty"
    >
      <slot name="empty">
        <UiEmptyState title="Empty grid" :description="controller.emptyText.value" />
      </slot>
    </div>

    <div
      v-else-if="controller.derivedState.value.isNoResults"
      class="ui-data-grid__state ui-data-grid__state--no-results"
    >
      <UiEmptyState title="No matching rows" :description="controller.noResultsText.value" />
    </div>

    <template v-else>
      <div v-if="controller.isLoading.value" class="ui-data-grid__progress">
        <UiSpinner size="sm" />
        <span>Refreshing rows…</span>
      </div>

      <UiDataGridTable
        v-bind="tableRowIdBinding"
        :rows="rows"
        :columns="controller.derivedState.value.visibleColumns"
        :query="controller.query.normalizedQuery.value"
        :selection-enabled="controller.selectionEnabled.value"
        :selected-row-ids="controller.derivedState.value.selection"
        :all-page-rows-selected="controller.derivedState.value.allPageRowsSelected"
        :sticky-header="controller.stickyHeader.value"
        @sort="controller.query.toggleSort"
        @toggle-row="controller.selection.toggleRow"
        @toggle-all-rows="controller.selection.toggleAllPageRows"
        @row-click="onRowClick"
      >
        <template #cell="slotProps">
          <slot name="cell" v-bind="slotProps" />
        </template>
        <template #rowActions="slotProps">
          <slot name="rowActions" v-bind="slotProps" />
        </template>
      </UiDataGridTable>
    </template>

    <UiDataGridPagination
      v-if="!controller.isError.value"
      :page="controller.query.normalizedQuery.value.pagination.page"
      :page-count="controller.derivedState.value.pageCount"
      :page-size="controller.query.normalizedQuery.value.pagination.pageSize"
      :page-size-options="controller.pageSizeOptions.value"
      :total-rows="props.totalRows"
      :summary-start="controller.derivedState.value.paginationSummary.start"
      :summary-end="controller.derivedState.value.paginationSummary.end"
      :disabled="controller.isLoading.value"
      @page-change="controller.query.setPage"
      @page-size-change="controller.query.setPageSize"
    />
  </figure>
</template>
