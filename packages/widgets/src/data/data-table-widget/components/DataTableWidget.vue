<script setup lang="ts">
import { computed, useSlots } from 'vue';

import {
  UiDataGrid,
  type DataGridQuery,
  type DataGridRowId,
  type DataGridSelectionState
} from '@ww/data-grid';
import { UiEmptyState, UiSpinner } from '@ww/core';

import { useDataTableWidgetState } from '../composables/useDataTableWidgetState';
import type {
  DataTableWidgetBulkActionsSlotProps,
  DataTableWidgetProps,
  DataTableWidgetStatusSummary
} from '../types';
import UiWidgetShell from '../../../shells/UiWidgetShell.vue';

import DataTableWidgetStatus from './DataTableWidgetStatus.vue';

defineOptions({ name: 'DataTableWidget' });

const props = withDefaults(defineProps<DataTableWidgetProps>(), {
  loading: false,
  error: false,
  filterDefinitions: () => [],
  pageSizeOptions: () => [10, 20, 50],
  searchPlaceholder: 'Search rows',
  emptyText: 'No rows available for this widget yet.',
  noResultsText: 'No rows match the current widget query.',
  errorText: 'This table widget surface is unavailable.',
  surface: 'default',
  padded: false,
  showHeader: true,
  showToolbar: true,
  showStatusBar: true,
  showColumnVisibility: true,
  showBulkActions: true,
  stickyHeader: false
});

const emit = defineEmits<{
  'update:query': [value: DataGridQuery];
  'update:selectedRowIds': [value: DataGridSelectionState];
  rowClick: [row: Record<string, unknown>, rowId: DataGridRowId];
}>();

defineSlots<{
  'header-actions'?: () => unknown;
  'toolbar-start'?: () => unknown;
  'toolbar-end'?: () => unknown;
  'bulk-actions'?: (props: DataTableWidgetBulkActionsSlotProps) => unknown;
  empty?: () => unknown;
  error?: (props: { message: string }) => unknown;
  loading?: () => unknown;
  footer?: () => unknown;
  status?: (props: DataTableWidgetStatusSummary) => unknown;
}>();

const slots = useSlots();
const widgetState = useDataTableWidgetState({
  query: computed(() => props.query),
  totalRows: computed(() => props.totalRows),
  selectedRowIds: computed(() => props.selectedRowIds)
});

const shouldShowHeader = computed(
  () => props.showHeader && Boolean(props.title || props.description || slots['header-actions'])
);
const shouldShowFooter = computed(
  () => props.showStatusBar || Boolean(slots.status) || Boolean(slots.footer)
);
const resolvedCaption = computed(() => props.caption ?? props.title);
const resolvedAriaLabel = computed(() =>
  props.ariaLabel ?? (resolvedCaption.value ? undefined : 'Data table widget')
);
const optionalGridProps = computed(() => ({
  ...(props.selectedRowIds ? { selectedRowIds: props.selectedRowIds } : {}),
  ...(props.rowId ? { rowId: props.rowId } : {}),
  ...(props.filterDefinitions ? { filterDefinitions: props.filterDefinitions } : {}),
  ...(props.pageSizeOptions ? { pageSizeOptions: props.pageSizeOptions } : {}),
  ...(resolvedCaption.value ? { caption: resolvedCaption.value } : {}),
  ...(resolvedAriaLabel.value ? { ariaLabel: resolvedAriaLabel.value } : {}),
  ...(props.density ? { density: props.density } : {})
}));

const onUpdateQuery = (value: DataGridQuery) => {
  emit('update:query', value);
};

const onUpdateSelection = (value: readonly DataGridRowId[]) => {
  emit('update:selectedRowIds', value);
};

const onRowClick = (row: Record<string, unknown>, rowId: DataGridRowId) => {
  emit('rowClick', row, rowId);
};
</script>

<template>
  <UiWidgetShell
    class="data-table-widget"
    :surface="props.surface"
    :padded="props.padded"
  >
    <template v-if="shouldShowHeader" #header>
      <div class="data-table-widget__header-copy">
        <h3 v-if="props.title" class="data-table-widget__title">{{ props.title }}</h3>
        <p v-if="props.description" class="data-table-widget__description">{{ props.description }}</p>
      </div>
    </template>

    <template v-if="props.showHeader && $slots['header-actions']" #actions>
      <slot name="header-actions" />
    </template>

    <div class="data-table-widget__content">
      <UiDataGrid
        v-bind="optionalGridProps"
        :rows="props.rows"
        :columns="props.columns"
        :query="props.query"
        :total-rows="props.totalRows"
        :loading="props.loading"
        :error="props.error"
        :search-placeholder="props.searchPlaceholder"
        :empty-text="props.emptyText"
        :no-results-text="props.noResultsText"
        :error-text="props.errorText"
        :sticky-header="props.stickyHeader"
        :show-toolbar="props.showToolbar"
        :show-bulk-actions="props.showBulkActions"
        :show-column-visibility="props.showColumnVisibility"
        @update:query="onUpdateQuery"
        @update:selected-row-ids="onUpdateSelection"
        @row-click="onRowClick"
      >
        <template #toolbar-start>
          <slot name="toolbar-start" />
        </template>

        <template #toolbar-end>
          <slot name="toolbar-end" />
        </template>

        <template #bulk-actions="slotProps">
          <slot name="bulk-actions" v-bind="slotProps" />
        </template>

        <template #loading>
          <slot name="loading">
            <div class="data-table-widget__state data-table-widget__state--loading">
              <UiSpinner size="sm" />
              <p class="data-table-widget__state-text">Loading table data.</p>
            </div>
          </slot>
        </template>

        <template #empty>
          <slot name="empty">
            <UiEmptyState title="No rows yet" :description="props.emptyText" />
          </slot>
        </template>

        <template #error="slotProps">
          <slot name="error" v-bind="slotProps">
            <UiEmptyState title="Table widget unavailable" :description="slotProps.message" />
          </slot>
        </template>
      </UiDataGrid>
    </div>

    <template v-if="shouldShowFooter" #footer>
      <div class="data-table-widget__footer">
        <slot name="status" v-bind="widgetState.statusSummary.value">
          <DataTableWidgetStatus v-if="props.showStatusBar" v-bind="widgetState.statusSummary.value" />
        </slot>
        <div v-if="$slots.footer" class="data-table-widget__footer-extra">
          <slot name="footer" />
        </div>
      </div>
    </template>
  </UiWidgetShell>
</template>
