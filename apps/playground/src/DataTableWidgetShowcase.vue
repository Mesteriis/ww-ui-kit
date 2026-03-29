<script setup lang="ts">
import { computed, ref } from 'vue';

import type { DataGridQuery } from '@ww/data-grid';
import { UiBadge, UiButton, UiCard } from '@ww/core';
import { UiPageSection, UiPageTemplate } from '@ww/page-templates';
import { getThemeMeta } from '@ww/themes';
import { DataTableWidget } from '@ww/widgets';

import {
  applyDataGridQuery,
  createBaseQuery,
  dataGridColumns,
  dataGridFilterDefinitions,
  dataGridRows,
  dataGridUiColumns
} from './data-grid/data-grid-demo';

const basicQuery = ref<DataGridQuery>(createBaseQuery());
const basicSelection = ref<readonly string[]>([]);
const themingQuery = ref<DataGridQuery>(createBaseQuery());
const compositionQuery = ref<DataGridQuery>(createBaseQuery());
const compositionSelection = ref<readonly string[]>([]);

const basicResult = computed(() => applyDataGridQuery(dataGridRows, dataGridColumns, basicQuery.value));
const themingResult = computed(() => applyDataGridQuery(dataGridRows, dataGridColumns, themingQuery.value));
const compositionResult = computed(() => applyDataGridQuery(dataGridRows, dataGridColumns, compositionQuery.value));
const scopedTheme = getThemeMeta('belovodye');
</script>

<template>
  <section class="ui-stack">
    <section
      id="testing-widgets-data-table-basic"
      class="playground__foundation-grid"
      data-playground-scenario="widget-data-table-basic"
    >
      <UiCard>
        <template #header>Data table widget basics</template>
        <DataTableWidget
          title="Accounts"
          description="Widget-level framing over the controlled data-grid system package."
          :rows="basicResult.pageRows"
          :columns="dataGridUiColumns"
          :query="basicQuery"
          :total-rows="basicResult.totalRows"
          :selected-row-ids="basicSelection"
          :filter-definitions="dataGridFilterDefinitions"
          caption="Accounts table widget"
          aria-label="Accounts table widget"
          search-placeholder="Search accounts"
          @update:query="basicQuery = $event"
          @update:selected-row-ids="basicSelection = $event"
        >
          <template #header-actions>
            <UiButton variant="secondary" size="sm">Refresh widget</UiButton>
          </template>
          <template #toolbar-end>
            <UiBadge>Rows: {{ basicResult.totalRows }}</UiBadge>
          </template>
          <template #bulk-actions="{ selectedCount, clearSelection }">
            <UiButton size="sm" variant="secondary" @click="clearSelection">Clear {{ selectedCount }}</UiButton>
          </template>
          <template #footer>
            Widget footer metadata stays shell-level and route-agnostic.
          </template>
        </DataTableWidget>
      </UiCard>
    </section>

    <section
      id="testing-widgets-data-table-states"
      class="playground__foundation-grid"
      data-playground-scenario="widget-data-table-states"
    >
      <UiCard>
        <template #header>Data table widget states</template>
        <div class="ui-stack">
          <DataTableWidget
            title="Loading accounts"
            :rows="[]"
            :columns="dataGridUiColumns"
            :query="createBaseQuery()"
            :total-rows="0"
            loading
            aria-label="Loading accounts table widget"
          />
          <DataTableWidget
            title="Empty accounts"
            :rows="[]"
            :columns="dataGridUiColumns"
            :query="createBaseQuery()"
            :total-rows="0"
            aria-label="Empty accounts table widget"
          />
          <DataTableWidget
            title="No result accounts"
            :rows="[]"
            :columns="dataGridUiColumns"
            :query="createBaseQuery({ search: 'No matches' })"
            :total-rows="0"
            aria-label="No result accounts table widget"
          />
          <DataTableWidget
            title="Errored accounts"
            :rows="[]"
            :columns="dataGridUiColumns"
            :query="createBaseQuery()"
            :total-rows="0"
            error="Apps remain responsible for backend retry and fetch orchestration."
            aria-label="Errored accounts table widget"
          />
        </div>
      </UiCard>
    </section>

    <section
      id="testing-widgets-data-table-theming"
      class="playground__foundation-grid"
      data-playground-scenario="widget-data-table-theming"
    >
      <UiCard>
        <template #header>Scoped theme data table widget</template>
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
          <DataTableWidget
            title="Scoped accounts"
            description="Widget shell and nested data-grid both inherit subtree theme variables."
            :rows="themingResult.pageRows"
            :columns="dataGridUiColumns"
            :query="themingQuery"
            :total-rows="themingResult.totalRows"
            :filter-definitions="dataGridFilterDefinitions"
            caption="Scoped accounts table widget"
            aria-label="Scoped accounts table widget"
            @update:query="themingQuery = $event"
          />
        </section>
      </UiCard>
    </section>

    <section
      id="testing-widgets-data-table-composition"
      class="playground__foundation-grid"
      data-playground-scenario="widget-data-table-composition"
    >
      <UiPageTemplate title="Operations workspace" description="Widget + page-template composition proof">
        <UiPageSection title="Accounts block" description="Apps can consume a widget instead of hand-wrapping the grid every time.">
          <DataTableWidget
            title="Accounts"
            description="Composed inside a reusable page shell."
            surface="subtle"
            :rows="compositionResult.pageRows"
            :columns="dataGridUiColumns"
            :query="compositionQuery"
            :total-rows="compositionResult.totalRows"
            :selected-row-ids="compositionSelection"
            :filter-definitions="dataGridFilterDefinitions"
            caption="Composed accounts table widget"
            aria-label="Composed accounts table widget"
            @update:query="compositionQuery = $event"
            @update:selected-row-ids="compositionSelection = $event"
          >
            <template #header-actions>
              <UiButton variant="secondary" size="sm">Export later</UiButton>
            </template>
            <template #footer>
              Page-template layout stays separate from the table engine and widget shell.
            </template>
          </DataTableWidget>
        </UiPageSection>
      </UiPageTemplate>
    </section>
  </section>
</template>
