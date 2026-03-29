<script setup lang="ts">
import { computed, ref } from 'vue';

import { UiDataGrid, type DataGridQuery } from '@ww/data-grid';
import { UiBadge, UiButton, UiCard } from '@ww/core';
import { UiPageSection, UiPageTemplate } from '@ww/page-templates';
import { getThemeMeta } from '@ww/themes';
import { UiWidgetShell } from '@ww/widgets';

import {
  applyDataGridQuery,
  createBaseQuery,
  dataGridColumns,
  dataGridFilterDefinitions,
  dataGridRows,
  dataGridUiColumns,
  denseAdminUiColumns,
  denseAdminColumns
} from './data-grid/data-grid-demo';

const query = ref<DataGridQuery>(createBaseQuery());
const selection = ref<readonly string[]>([]);
const selectionQuery = ref<DataGridQuery>(createBaseQuery());
const selectionState = ref<readonly string[]>([]);
const themingQuery = ref<DataGridQuery>(createBaseQuery());
const compositionQuery = ref<DataGridQuery>(createBaseQuery());
const compositionSelection = ref<readonly string[]>([]);

const basicResult = computed(() => applyDataGridQuery(dataGridRows, dataGridColumns, query.value));
const selectionResult = computed(() => applyDataGridQuery(dataGridRows, dataGridColumns, selectionQuery.value));
const themingResult = computed(() => applyDataGridQuery(dataGridRows, dataGridColumns, themingQuery.value));
const compositionResult = computed(() => applyDataGridQuery(dataGridRows, dataGridColumns, compositionQuery.value));
const denseResult = computed(() => applyDataGridQuery(dataGridRows, denseAdminColumns, createBaseQuery({
  pagination: {
    page: 1,
    pageSize: 6
  }
})));
const basicUiRows = computed(() => basicResult.value.pageRows as readonly Record<string, unknown>[]);
const denseUiRows = computed(() => denseResult.value.pageRows as readonly Record<string, unknown>[]);
const themingUiRows = computed(() => themingResult.value.pageRows as readonly Record<string, unknown>[]);
const selectionUiRows = computed(() => selectionResult.value.pageRows as readonly Record<string, unknown>[]);
const compositionUiRows = computed(() => compositionResult.value.pageRows as readonly Record<string, unknown>[]);
const scopedTheme = getThemeMeta('belovodye');
</script>

<template>
  <section class="ui-stack">
    <section
      id="testing-data-grid-basic"
      class="playground__foundation-grid"
      data-playground-scenario="data-grid-basic"
    >
      <UiCard>
        <template #header>Data grid basics</template>
        <UiDataGrid
          :rows="basicUiRows"
          :columns="dataGridUiColumns"
          :query="query"
          :total-rows="basicResult.totalRows"
          :selected-row-ids="selection"
          :filter-definitions="dataGridFilterDefinitions"
          caption="Accounts grid"
          aria-label="Basic accounts data grid"
          search-placeholder="Search accounts"
          @update:query="query = $event"
          @update:selected-row-ids="selection = $event"
        >
          <template #toolbar-end>
            <UiBadge>Rows: {{ basicResult.totalRows }}</UiBadge>
          </template>
          <template #bulk-actions="{ selectedCount, clearSelection }">
            <UiButton size="sm" variant="secondary" @click="clearSelection">Clear {{ selectedCount }}</UiButton>
          </template>
        </UiDataGrid>
      </UiCard>

      <UiCard>
        <template #header>Dense admin surface</template>
        <UiDataGrid
          :rows="denseUiRows"
          :columns="denseAdminUiColumns"
          :query="createBaseQuery({ pagination: { page: 1, pageSize: 6 } })"
          :total-rows="denseResult.totalRows"
          density="compact"
          sticky-header
          caption="Dense admin accounts grid"
          aria-label="Dense admin accounts data grid"
        />
      </UiCard>
    </section>

    <section
      id="testing-data-grid-states"
      class="playground__foundation-grid"
      data-playground-scenario="data-grid-states"
    >
      <UiCard>
        <template #header>Loading and empty states</template>
        <div class="ui-stack">
          <UiDataGrid
            :rows="[]"
            :columns="dataGridUiColumns"
            :query="createBaseQuery()"
            :total-rows="0"
            loading
            caption="Loading grid"
            aria-label="Loading accounts data grid"
          />
          <UiDataGrid
            :rows="[]"
            :columns="dataGridUiColumns"
            :query="createBaseQuery()"
            :total-rows="0"
            caption="Empty grid"
            aria-label="Empty accounts data grid"
          />
        </div>
      </UiCard>

      <UiCard>
        <template #header>No results and error states</template>
        <div class="ui-stack">
          <UiDataGrid
            :rows="[]"
            :columns="dataGridUiColumns"
            :query="createBaseQuery({ search: 'No matches' })"
            :total-rows="0"
            caption="No results grid"
            aria-label="No results accounts data grid"
          />
          <UiDataGrid
            :rows="[]"
            :columns="dataGridUiColumns"
            :query="createBaseQuery()"
            :total-rows="0"
            error="Consumer remains responsible for backend fetch orchestration."
            caption="Error grid"
            aria-label="Error accounts data grid"
          />
        </div>
      </UiCard>
    </section>

    <section
      id="testing-data-grid-theming"
      class="playground__foundation-grid"
      data-playground-scenario="data-grid-theming"
    >
      <UiCard>
        <template #header>Scoped theme data grid</template>
        <section
          class="playground__scoped-surface"
          :data-ui-theme="scopedTheme.name"
          :data-ui-theme-type="scopedTheme.type"
        >
          <div class="ui-cluster">
            <UiBadge variant="brand">{{ scopedTheme.label }}</UiBadge>
            <UiBadge>ThemeName: {{ scopedTheme.name }}</UiBadge>
            <UiBadge>ThemeType: {{ scopedTheme.type }}</UiBadge>
          </div>
          <UiDataGrid
            :rows="themingUiRows"
            :columns="dataGridUiColumns"
            :query="themingQuery"
            :total-rows="themingResult.totalRows"
            :filter-definitions="dataGridFilterDefinitions"
            caption="Scoped Belovodye grid"
            aria-label="Scoped Belovodye data grid"
            @update:query="themingQuery = $event"
          />
        </section>
      </UiCard>
    </section>

    <section
      id="testing-data-grid-selection"
      class="playground__foundation-grid"
      data-playground-scenario="data-grid-selection"
    >
      <UiCard>
        <template #header>Selection and bulk actions</template>
        <UiDataGrid
          :rows="selectionUiRows"
          :columns="dataGridUiColumns"
          :query="selectionQuery"
          :total-rows="selectionResult.totalRows"
          :selected-row-ids="selectionState"
          :filter-definitions="dataGridFilterDefinitions"
          caption="Selection grid"
          aria-label="Selection accounts data grid"
          @update:query="selectionQuery = $event"
          @update:selected-row-ids="selectionState = $event"
        >
          <template #bulk-actions="{ selectedCount, clearSelection, selectedRowIds }">
            <UiBadge>{{ selectedCount }} selected</UiBadge>
            <UiBadge>Ids: {{ selectedRowIds.join(', ') }}</UiBadge>
            <UiButton size="sm" variant="secondary" @click="clearSelection">Reset selection</UiButton>
          </template>
        </UiDataGrid>
      </UiCard>
    </section>

    <section
      id="testing-data-grid-composition"
      class="playground__foundation-grid"
      data-playground-scenario="data-grid-composition"
    >
      <UiPageTemplate title="Workspace shell" description="Page-template + widget + data-grid composition proof">
        <UiPageSection title="Accounts workspace" description="System package stays controlled while the composition layer remains route-agnostic.">
          <UiWidgetShell title="Accounts table widget shell" description="Raw shell composition remains possible, but DataTableWidget now owns the reusable widget layer." surface="subtle">
            <UiDataGrid
              :rows="compositionUiRows"
              :columns="dataGridUiColumns"
              :query="compositionQuery"
              :total-rows="compositionResult.totalRows"
              :selected-row-ids="compositionSelection"
              :filter-definitions="dataGridFilterDefinitions"
              caption="Composed accounts grid"
              aria-label="Composed accounts data grid"
              @update:query="compositionQuery = $event"
              @update:selected-row-ids="compositionSelection = $event"
            >
              <template #toolbar-end>
                <UiBadge>Composable system package</UiBadge>
              </template>
            </UiDataGrid>
          </UiWidgetShell>
        </UiPageSection>
      </UiPageTemplate>
    </section>
  </section>
</template>
