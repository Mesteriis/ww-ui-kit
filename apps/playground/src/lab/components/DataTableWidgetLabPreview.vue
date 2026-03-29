<script setup lang="ts">
import { computed, ref, watch, type Component } from 'vue';

import type { DataGridColumn, DataGridFilterDefinition, DataGridQuery } from '@ww/data-grid';
import { UiBadge, UiButton } from '@ww/core';
import { DataTableWidget } from '@ww/widgets';

import type { LabPreviewContext, LabSurfaceDefinition } from '../manifest/component-lab.types';
import { deepClone } from '../runtime/schema-helpers';

defineOptions({ name: 'DataTableWidgetLabPreview' });

const props = defineProps<{
  definition: LabSurfaceDefinition<Record<string, unknown>>;
  state: Record<string, unknown>;
  previewContext: LabPreviewContext;
}>();

type WidgetPreviewProps = {
  title: string;
  description: string;
  rows: readonly Record<string, unknown>[];
  columns: readonly DataGridColumn<Record<string, unknown>>[];
  totalRows: number;
  filterDefinitions: readonly DataGridFilterDefinition[];
  loading?: boolean;
  error?: string | false;
  surface: 'default' | 'subtle' | 'elevated';
  stickyHeader: boolean;
  showStatusBar: boolean;
  showToolbar: boolean;
  caption: string;
  ariaLabel: string;
  searchPlaceholder: string;
};

const resolved = computed(
  () =>
    props.definition.buildPreviewProps?.(props.state, props.previewContext) as {
      wrapperAttrs?: Record<string, unknown>;
      widgetProps: WidgetPreviewProps;
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

const widgetComponent = DataTableWidget as Component;
</script>

<template>
  <div
    class="lab-preview lab-preview--data-table-widget"
    data-lab-preview-canvas="data-table-widget"
  >
    <section class="lab-preview__widget-surface" v-bind="resolved?.wrapperAttrs ?? {}">
      <component
        :is="widgetComponent"
        v-bind="resolved?.widgetProps ?? {}"
        :query="query"
        :selected-row-ids="selectedRowIds"
        @update:query="query = $event"
        @update:selected-row-ids="selectedRowIds = $event"
      >
        <template #header-actions>
          <UiButton variant="secondary" size="sm">Refresh widget</UiButton>
        </template>
        <template #toolbar-end>
          <UiBadge>Rows: {{ resolved?.widgetProps?.totalRows }}</UiBadge>
        </template>
        <template #bulk-actions="{ selectedCount, clearSelection, selectedRowIds: activeIds }">
          <div class="ui-cluster">
            <UiBadge variant="brand">{{ selectedCount }} selected</UiBadge>
            <UiBadge v-if="activeIds.length">Ids: {{ activeIds.join(', ') }}</UiBadge>
            <UiButton size="sm" variant="secondary" @click="clearSelection">Clear</UiButton>
          </div>
        </template>
        <template #footer> Widget footer metadata stays above the system layer. </template>
      </component>
    </section>
  </div>
</template>
