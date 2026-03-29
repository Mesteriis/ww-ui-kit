<script setup lang="ts">
import type { DataGridColumn, DataGridFilterDefinition, DataGridFilterValue } from '../model/types';

import UiDataGridColumnVisibility from './UiDataGridColumnVisibility.vue';
import UiDataGridFilters from './UiDataGridFilters.vue';
import UiDataGridSearch from './UiDataGridSearch.vue';

defineOptions({ name: 'UiDataGridToolbar' });

const props = withDefaults(
  defineProps<{
    search: string;
    searchPlaceholder?: string;
    filterDefinitions: readonly DataGridFilterDefinition[];
    filters: Record<string, DataGridFilterValue>;
    hideableColumns: readonly DataGridColumn[];
    columnVisibility: Record<string, boolean> | undefined;
    showColumnVisibility?: boolean;
    disabled?: boolean;
  }>(),
  {
    searchPlaceholder: '',
    showColumnVisibility: true,
    disabled: false,
  }
);

const emit = defineEmits<{
  updateSearch: [value: string];
  updateFilter: [filterId: string, value: DataGridFilterValue | undefined];
  updateColumnVisibility: [columnId: string, visible: boolean];
  resetColumnVisibility: [];
}>();

const onUpdateFilter = (filterId: string, value: DataGridFilterValue | undefined) => {
  emit('updateFilter', filterId, value);
};

const onUpdateColumnVisibility = (columnId: string, visible: boolean) => {
  emit('updateColumnVisibility', columnId, visible);
};
</script>

<template>
  <div class="ui-data-grid-toolbar">
    <div class="ui-data-grid-toolbar__start">
      <slot name="toolbar-start" />
      <UiDataGridSearch
        :model-value="props.search"
        :placeholder="props.searchPlaceholder"
        :disabled="props.disabled"
        @update:model-value="emit('updateSearch', $event)"
      />
      <UiDataGridFilters
        :definitions="props.filterDefinitions"
        :filters="props.filters"
        :disabled="props.disabled"
        @update-filter="onUpdateFilter"
      />
    </div>
    <div class="ui-data-grid-toolbar__end">
      <UiDataGridColumnVisibility
        v-if="props.showColumnVisibility"
        :columns="props.hideableColumns"
        :column-visibility="props.columnVisibility"
        :disabled="props.disabled"
        @visibility-change="onUpdateColumnVisibility"
        @reset="emit('resetColumnVisibility')"
      />
      <slot name="toolbar-end" />
    </div>
  </div>
</template>
