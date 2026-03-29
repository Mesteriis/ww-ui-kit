<script setup lang="ts">
import { UiCheckbox } from '@ww/core';

import type { DataGridColumn } from '../model/types';

defineOptions({ name: 'UiDataGridColumnVisibility' });

const props = withDefaults(
  defineProps<{
    columns: readonly DataGridColumn[];
    columnVisibility: Record<string, boolean> | undefined;
    disabled?: boolean;
  }>(),
  {
    disabled: false,
  }
);

const emit = defineEmits<{
  visibilityChange: [columnId: string, visible: boolean];
  reset: [];
}>();
</script>

<template>
  <details v-if="props.columns.length > 0" class="ui-data-grid-visibility">
    <summary class="ui-data-grid-visibility__summary">Columns</summary>
    <div class="ui-data-grid-visibility__panel">
      <div class="ui-data-grid-visibility__list">
        <UiCheckbox
          v-for="column in props.columns"
          :key="column.id"
          :model-value="props.columnVisibility?.[column.id] !== false"
          :disabled="props.disabled"
          @update:model-value="emit('visibilityChange', column.id, $event)"
        >
          {{ column.header }}
        </UiCheckbox>
      </div>
      <button
        class="ui-data-grid-visibility__reset"
        type="button"
        :disabled="props.disabled"
        @click="emit('reset')"
      >
        Reset columns
      </button>
    </div>
  </details>
</template>
