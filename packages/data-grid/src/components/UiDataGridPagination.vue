<script setup lang="ts">
import { UiButton, UiSelectSimple } from '@ww/core';

defineOptions({ name: 'UiDataGridPagination' });

const props = withDefaults(
  defineProps<{
    page: number;
    pageCount: number;
    pageSize: number;
    totalRows: number;
    pageSizeOptions: readonly number[];
    summaryStart: number;
    summaryEnd: number;
    disabled?: boolean;
  }>(),
  {
    disabled: false,
  }
);

const emit = defineEmits<{
  pageChange: [page: number];
  pageSizeChange: [pageSize: number];
}>();
</script>

<template>
  <div class="ui-data-grid-pagination">
    <p class="ui-data-grid-pagination__summary">
      Showing {{ props.summaryStart }}–{{ props.summaryEnd }} of {{ props.totalRows }}
    </p>

    <div class="ui-data-grid-pagination__controls">
      <UiSelectSimple
        :model-value="String(props.pageSize)"
        aria-label="Rows per page"
        :options="
          props.pageSizeOptions.map((option) => ({
            label: `${option} / page`,
            value: String(option),
          }))
        "
        :disabled="props.disabled"
        @update:model-value="emit('pageSizeChange', Number($event))"
      />

      <UiButton
        variant="secondary"
        size="sm"
        :disabled="props.disabled || props.page <= 1"
        @click="emit('pageChange', props.page - 1)"
      >
        Previous
      </UiButton>

      <span class="ui-data-grid-pagination__page"
        >Page {{ props.page }} / {{ props.pageCount }}</span
      >

      <UiButton
        variant="secondary"
        size="sm"
        :disabled="props.disabled || props.page >= props.pageCount"
        @click="emit('pageChange', props.page + 1)"
      >
        Next
      </UiButton>
    </div>
  </div>
</template>
