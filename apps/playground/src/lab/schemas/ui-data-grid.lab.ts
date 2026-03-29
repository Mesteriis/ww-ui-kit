import {
  applyDataGridQuery,
  createBaseQuery,
  dataGridColumns,
  dataGridFilterDefinitions,
  dataGridRows,
  dataGridUiColumns,
} from '../../data-grid/data-grid-demo';

import type {
  LabCopyFormat,
  LabMatrixItem,
  LabSurfaceDefinition,
} from '../manifest/component-lab.types';
import DataGridLabPreview from '../components/DataGridLabPreview.vue';
import {
  buildThemeScopeAttrs,
  markPreviewComponent,
  serializeByFormat,
  themeScopeOptions,
} from '../runtime/schema-helpers';

type UiDataGridLabState = {
  mode: 'default' | 'loading' | 'empty' | 'no-results' | 'error';
  density: 'comfortable' | 'compact';
  stickyHeader: boolean;
  showToolbar: boolean;
  showBulkActions: boolean;
  showColumnVisibility: boolean;
  subtreeTheme: 'inherit' | 'belovodye' | 'dark';
  matrixPresets: readonly string[];
};

const defaultState: Readonly<UiDataGridLabState> = Object.freeze({
  mode: 'default',
  density: 'comfortable',
  stickyHeader: false,
  showToolbar: true,
  showBulkActions: true,
  showColumnVisibility: true,
  subtreeTheme: 'inherit',
  matrixPresets: ['default', 'compact', 'selection', 'error'],
});

function buildMatrixItems(state: UiDataGridLabState): readonly LabMatrixItem<UiDataGridLabState>[] {
  return state.matrixPresets.map((preset) => {
    if (preset === 'compact') {
      return {
        id: preset,
        title: 'Compact density',
        patch: {
          density: 'compact',
          stickyHeader: true,
        },
      };
    }

    if (preset === 'selection') {
      return {
        id: preset,
        title: 'Selection flow',
        patch: {
          showBulkActions: true,
        },
      };
    }

    if (preset === 'error') {
      return {
        id: preset,
        title: 'Error state',
        patch: {
          mode: 'error',
        },
      };
    }

    return {
      id: preset,
      title: 'Default grid',
      patch: {},
    };
  });
}

function buildGridModel(state: UiDataGridLabState) {
  const initialQuery = createBaseQuery(
    state.mode === 'no-results'
      ? {
          search: 'No matches',
        }
      : {
          pagination: {
            page: 1,
            pageSize: 5,
          },
        }
  );
  const effectiveRows =
    state.mode === 'empty' || state.mode === 'loading' || state.mode === 'error'
      ? []
      : dataGridRows;
  const result = applyDataGridQuery(effectiveRows, dataGridColumns, initialQuery);

  return {
    initialQuery,
    initialSelection: state.showBulkActions ? ['row-001'] : [],
    gridProps: {
      rows: result.pageRows as readonly Record<string, unknown>[],
      columns: dataGridUiColumns,
      totalRows: result.totalRows,
      filterDefinitions: dataGridFilterDefinitions,
      loading: state.mode === 'loading',
      error:
        state.mode === 'error'
          ? 'Consumer remains responsible for backend fetch orchestration.'
          : false,
      caption: 'Accounts grid',
      ariaLabel: 'Accounts data grid',
      density: state.density,
      stickyHeader: state.stickyHeader,
      showToolbar: state.showToolbar,
      showBulkActions: state.showBulkActions,
      showColumnVisibility: state.showColumnVisibility,
      searchPlaceholder: 'Search accounts',
    },
  };
}

function serializeCopy(format: LabCopyFormat, state: UiDataGridLabState) {
  const payload = {
    density: state.density,
    ...(state.stickyHeader ? { stickyHeader: true } : {}),
    ...(state.showToolbar === false ? { showToolbar: false } : {}),
    ...(state.showBulkActions === false ? { showBulkActions: false } : {}),
    ...(state.showColumnVisibility === false ? { showColumnVisibility: false } : {}),
    ...(state.mode === 'loading' ? { loading: true } : {}),
    ...(state.mode === 'error'
      ? { error: 'Consumer remains responsible for backend fetch orchestration.' }
      : {}),
  };

  return serializeByFormat(
    format,
    payload,
    () =>
      `<script setup lang="ts">\nimport { UiDataGrid } from '@ww/data-grid';\n\nconst rows = sampleRows;\nconst columns = sampleColumns;\nconst query = sampleQuery;\n</script>\n\n<template>\n  <UiDataGrid\n    :rows="rows"\n    :columns="columns"\n    :query="query"\n    :total-rows="rows.length"\n    caption="Accounts grid"\n    aria-label="Accounts data grid"\n${state.density !== 'comfortable' ? `    density="${state.density}"\n` : ''}${state.stickyHeader ? '    sticky-header\n' : ''}${state.showToolbar === false ? '    :show-toolbar="false"\n' : ''}${state.showBulkActions === false ? '    :show-bulk-actions="false"\n' : ''}${state.showColumnVisibility === false ? '    :show-column-visibility="false"\n' : ''}${state.mode === 'loading' ? '    loading\n' : ''}${state.mode === 'error' ? '    error="Consumer remains responsible for backend fetch orchestration."\n' : ''}  />\n</template>\n`
  );
}

const definition: LabSurfaceDefinition<UiDataGridLabState> = {
  id: 'ui-data-grid',
  title: 'UiDataGrid',
  description: 'Controlled data-grid system surface for dense admin and business tables.',
  defaultState,
  controlSections: [
    {
      id: 'surface',
      title: 'Surface',
      controls: [
        {
          id: 'mode',
          kind: 'segment',
          label: 'Mode',
          options: [
            { label: 'Default', value: 'default' },
            { label: 'Loading', value: 'loading' },
            { label: 'Empty', value: 'empty' },
            { label: 'No results', value: 'no-results' },
            { label: 'Error', value: 'error' },
          ],
        },
        {
          id: 'density',
          kind: 'segment',
          label: 'Density',
          options: [
            { label: 'Comfortable', value: 'comfortable' },
            { label: 'Compact', value: 'compact' },
          ],
        },
        { id: 'stickyHeader', kind: 'boolean', label: 'Sticky header' },
        { id: 'subtreeTheme', kind: 'select', label: 'Theme scope', options: themeScopeOptions },
      ],
    },
    {
      id: 'subsurfaces',
      title: 'Sub-surfaces',
      controls: [
        { id: 'showToolbar', kind: 'boolean', label: 'Toolbar' },
        { id: 'showBulkActions', kind: 'boolean', label: 'Bulk actions' },
        { id: 'showColumnVisibility', kind: 'boolean', label: 'Column visibility' },
      ],
    },
    {
      id: 'matrix',
      title: 'Matrix filters',
      controls: [
        {
          id: 'matrixPresets',
          kind: 'multi-toggle',
          label: 'Presets',
          options: [
            { label: 'Default', value: 'default' },
            { label: 'Compact', value: 'compact' },
            { label: 'Selection', value: 'selection' },
            { label: 'Error', value: 'error' },
          ],
          enableAllLabel: 'Enable all',
          disableAllLabel: 'Clear',
        },
      ],
    },
  ],
  previewModes: ['single', 'matrix'],
  defaultPreviewMode: 'single',
  copyFormats: ['json', 'ts-object', 'vue'],
  defaultCopyFormat: 'vue',
  previewComponent: markPreviewComponent(DataGridLabPreview),
  buildMatrixItems,
  serializeCopy,
  buildPreviewProps: (state, context) => {
    const model = buildGridModel(state);
    return {
      ...model,
      wrapperAttrs: buildThemeScopeAttrs(state, context),
      resetKey: JSON.stringify({
        mode: state.mode,
        density: state.density,
        stickyHeader: state.stickyHeader,
        showToolbar: state.showToolbar,
        showBulkActions: state.showBulkActions,
        showColumnVisibility: state.showColumnVisibility,
      }),
    };
  },
};

export default definition;
