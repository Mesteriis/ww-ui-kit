<script setup lang="ts">
import { computed, ref, watch, type Component } from 'vue';

import {
  UiDataGrid,
  type DataGridColumn,
  type DataGridFilterDefinition,
  type DataGridQuery,
} from '@ww/data-grid';
import { UiBadge, UiButton } from '@ww/core';

import type { LabPreviewContext, LabSurfaceDefinition } from '../manifest/component-lab.types';
import { deepClone } from '../runtime/schema-helpers';

defineOptions({ name: 'DataGridLabPreview' });

const props = defineProps<{
  definition: LabSurfaceDefinition<Record<string, unknown>>;
  state: Record<string, unknown>;
  previewContext: LabPreviewContext;
}>();

type GridPreviewProps = {
  rows: readonly Record<string, unknown>[];
  columns: readonly DataGridColumn<Record<string, unknown>>[];
  totalRows: number;
  filterDefinitions: readonly DataGridFilterDefinition[];
  loading?: boolean;
  error?: string | false;
  caption: string;
  ariaLabel: string;
  density: 'comfortable' | 'compact';
  stickyHeader: boolean;
  showToolbar: boolean;
  showBulkActions: boolean;
  showColumnVisibility: boolean;
  searchPlaceholder: string;
};

const resolved = computed(
  () =>
    props.definition.buildPreviewProps?.(props.state, props.previewContext) as {
      wrapperAttrs?: Record<string, unknown>;
      gridProps: GridPreviewProps;
      initialQuery: DataGridQuery;
      initialSelection: readonly string[];
      resetKey: string;
    }
);

const query = ref<DataGridQuery>(deepClone(resolved.value?.initialQuery ?? ({} as DataGridQuery)));
const selectedRowIds = ref<readonly string[]>(resolved.value?.initialSelection ?? []);

watch(
  () => resolved.value?.resetKey,
  () => {
    query.value = deepClone(resolved.value?.initialQuery ?? ({} as DataGridQuery));
    selectedRowIds.value = [...(resolved.value?.initialSelection ?? [])];
  },
  { immediate: true }
);

const gridComponent = UiDataGrid as Component;
</script>

<template>
  <div class="lab-preview lab-preview--data-grid" data-lab-preview-canvas="data-grid">
    <section class="lab-preview__data-grid-surface" v-bind="resolved?.wrapperAttrs ?? {}">
      <component
        :is="gridComponent"
        v-bind="resolved?.gridProps ?? {}"
        :query="query"
        :selected-row-ids="selectedRowIds"
        @update:query="query = $event"
        @update:selected-row-ids="selectedRowIds = $event"
      >
        <template #toolbar-end>
          <UiBadge>Rows: {{ resolved?.gridProps?.totalRows }}</UiBadge>
        </template>
        <template #bulk-actions="{ selectedCount, clearSelection, selectedRowIds: activeIds }">
          <div class="ui-cluster">
            <UiBadge variant="brand">{{ selectedCount }} selected</UiBadge>
            <UiBadge v-if="activeIds.length">Ids: {{ activeIds.join(', ') }}</UiBadge>
            <UiButton size="sm" variant="secondary" @click="clearSelection">Clear</UiButton>
          </div>
        </template>
      </component>
    </section>
  </div>
</template>
