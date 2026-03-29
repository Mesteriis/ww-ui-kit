<script setup lang="ts">
import { computed, useSlots } from 'vue';
import { UiCheckbox } from '@ww/core';

import { getDataGridSortDirection } from '../model/sorting';
import { getDataGridColumnValue, renderDataGridCellValue } from '../model/columns';
import { resolveDataGridRowId } from '../internal/utils/row-id';
import type {
  DataGridColumn,
  DataGridQuery,
  DataGridRowId,
  DataGridRowIdAccessor,
  DataGridSelectionState
} from '../model/types';

defineOptions({ name: 'UiDataGridTable' });

const props = defineProps<{
  rows: readonly Record<string, unknown>[];
  columns: readonly DataGridColumn<Record<string, unknown>>[];
  query: DataGridQuery;
  rowId?: DataGridRowIdAccessor<Record<string, unknown>>;
  selectionEnabled: boolean;
  selectedRowIds: DataGridSelectionState;
  allPageRowsSelected: boolean;
  stickyHeader?: boolean;
}>();

const emit = defineEmits<{
  sort: [columnId: string];
  toggleRow: [rowId: DataGridRowId];
  toggleAllRows: [checked: boolean];
  rowClick: [row: Record<string, unknown>, rowId: DataGridRowId];
}>();

const slots = useSlots();
const hasRowActions = computed(() => Boolean(slots.rowActions));

const getRowId = (row: Record<string, unknown>, rowIndex: number) =>
  resolveDataGridRowId(row, rowIndex, props.rowId, 'UiDataGridTable');

const renderSortLabel = (columnId: string) => {
  const direction = getDataGridSortDirection(props.query, columnId);
  if (direction === 'asc') {
    return '↑';
  }

  if (direction === 'desc') {
    return '↓';
  }

  return '↕';
};

const renderAriaSort = (columnId: string) => {
  const direction = getDataGridSortDirection(props.query, columnId);
  if (direction === 'asc') {
    return 'ascending';
  }

  if (direction === 'desc') {
    return 'descending';
  }

  return 'none';
};
</script>

<template>
  <div class="ui-data-grid-table-wrap">
    <table class="ui-data-grid-table">
      <thead class="ui-data-grid-table__head" :class="{ 'is-sticky': stickyHeader }">
        <tr>
          <th v-if="selectionEnabled" scope="col" class="ui-data-grid-table__selection-column">
            <UiCheckbox
              :model-value="allPageRowsSelected"
              @update:model-value="emit('toggleAllRows', $event)"
            >
              <span class="ui-data-grid-table__sr-only">Select visible rows</span>
            </UiCheckbox>
          </th>
          <th
            v-for="column in columns"
            :key="column.id"
            scope="col"
            :aria-sort="renderAriaSort(column.id)"
            :data-align="column.align ?? 'start'"
            :style="column.width ? { width: column.width } : undefined"
          >
            <button
              v-if="column.sortable"
              class="ui-data-grid-table__sort"
              type="button"
              @click="emit('sort', column.id)"
            >
              <span>{{ column.header }}</span>
              <span class="ui-data-grid-table__sort-indicator" aria-hidden="true">
                {{ renderSortLabel(column.id) }}
              </span>
            </button>
            <span v-else>{{ column.header }}</span>
          </th>
          <th v-if="hasRowActions" scope="col" class="ui-data-grid-table__actions-column">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, rowIndex) in rows"
          :key="getRowId(row, rowIndex)"
          :data-selected="selectedRowIds.includes(getRowId(row, rowIndex)) || undefined"
          @click="emit('rowClick', row, getRowId(row, rowIndex))"
        >
          <td v-if="selectionEnabled" class="ui-data-grid-table__selection-column">
            <UiCheckbox
              :model-value="selectedRowIds.includes(getRowId(row, rowIndex))"
              @click.stop
              @update:model-value="emit('toggleRow', getRowId(row, rowIndex))"
            />
          </td>
          <td
            v-for="column in columns"
            :key="column.id"
            :data-align="column.align ?? 'start'"
          >
            <slot
              name="cell"
              :column="column"
              :row="row"
              :row-id="getRowId(row, rowIndex)"
              :row-index="rowIndex"
              :selected="selectedRowIds.includes(getRowId(row, rowIndex))"
              :value="getDataGridColumnValue(row, column)"
            >
              {{
                renderDataGridCellValue({
                  row,
                  rowId: getRowId(row, rowIndex),
                  rowIndex,
                  column,
                  value: getDataGridColumnValue(row, column),
                  selected: selectedRowIds.includes(getRowId(row, rowIndex))
                })
              }}
            </slot>
          </td>
          <td v-if="hasRowActions" class="ui-data-grid-table__actions-column" @click.stop>
            <slot name="rowActions" :row="row" :row-id="getRowId(row, rowIndex)" :row-index="rowIndex" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
