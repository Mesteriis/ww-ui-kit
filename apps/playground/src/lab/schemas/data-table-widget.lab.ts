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
import DataTableWidgetLabPreview from '../components/DataTableWidgetLabPreview.vue';
import {
  buildThemeScopeAttrs,
  markPreviewComponent,
  serializeByFormat,
  themeScopeOptions,
} from '../runtime/schema-helpers';

type DataTableWidgetLabState = {
  mode: 'default' | 'loading' | 'empty' | 'no-results' | 'error';
  surface: 'default' | 'subtle' | 'elevated';
  stickyHeader: boolean;
  showStatusBar: boolean;
  showToolbar: boolean;
  subtreeTheme: 'inherit' | 'belovodye' | 'dark';
  matrixPresets: readonly string[];
};

const defaultState: Readonly<DataTableWidgetLabState> = Object.freeze({
  mode: 'default',
  surface: 'default',
  stickyHeader: false,
  showStatusBar: true,
  showToolbar: true,
  subtreeTheme: 'inherit',
  matrixPresets: ['default', 'subtle', 'error', 'themed'],
});

function buildMatrixItems(
  state: DataTableWidgetLabState
): readonly LabMatrixItem<DataTableWidgetLabState>[] {
  return state.matrixPresets.map((preset) => {
    if (preset === 'subtle') {
      return {
        id: preset,
        title: 'Subtle surface',
        patch: {
          surface: 'subtle',
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

    if (preset === 'themed') {
      return {
        id: preset,
        title: 'Belovodye subtree',
        patch: {
          subtreeTheme: 'belovodye',
        },
      };
    }

    return {
      id: preset,
      title: 'Default widget',
      patch: {},
    };
  });
}

function buildWidgetModel(state: DataTableWidgetLabState) {
  const initialQuery = createBaseQuery(
    state.mode === 'no-results'
      ? {
          search: 'No matches',
        }
      : {}
  );
  const effectiveRows =
    state.mode === 'empty' || state.mode === 'loading' || state.mode === 'error'
      ? []
      : dataGridRows;
  const result = applyDataGridQuery(effectiveRows, dataGridColumns, initialQuery);

  return {
    initialQuery,
    initialSelection: ['row-001'],
    widgetProps: {
      title: 'Accounts',
      description: 'Widget-level framing above the controlled data-grid system package.',
      rows: result.pageRows as readonly Record<string, unknown>[],
      columns: dataGridUiColumns,
      totalRows: result.totalRows,
      filterDefinitions: dataGridFilterDefinitions,
      loading: state.mode === 'loading',
      error:
        state.mode === 'error'
          ? 'Apps remain responsible for backend retry and fetch orchestration.'
          : false,
      surface: state.surface,
      stickyHeader: state.stickyHeader,
      showStatusBar: state.showStatusBar,
      showToolbar: state.showToolbar,
      caption: 'Accounts table widget',
      ariaLabel: 'Accounts table widget',
      searchPlaceholder: 'Search accounts',
    },
  };
}

function serializeCopy(format: LabCopyFormat, state: DataTableWidgetLabState) {
  const payload = {
    ...(state.surface !== 'default' ? { surface: state.surface } : {}),
    ...(state.stickyHeader ? { stickyHeader: true } : {}),
    ...(state.showStatusBar === false ? { showStatusBar: false } : {}),
    ...(state.showToolbar === false ? { showToolbar: false } : {}),
    ...(state.mode === 'loading' ? { loading: true } : {}),
    ...(state.mode === 'error'
      ? { error: 'Apps remain responsible for backend retry and fetch orchestration.' }
      : {}),
  };

  return serializeByFormat(
    format,
    payload,
    () =>
      `<script setup lang="ts">\nimport { DataTableWidget } from '@ww/widgets';\n\nconst rows = sampleRows;\nconst columns = sampleColumns;\nconst query = sampleQuery;\n</script>\n\n<template>\n  <DataTableWidget\n    title="Accounts"\n    description="Widget-level framing above the data-grid system package."\n    :rows="rows"\n    :columns="columns"\n    :query="query"\n    :total-rows="rows.length"\n${state.surface !== 'default' ? `    surface="${state.surface}"\n` : ''}${state.stickyHeader ? '    sticky-header\n' : ''}${state.showStatusBar === false ? '    :show-status-bar="false"\n' : ''}${state.showToolbar === false ? '    :show-toolbar="false"\n' : ''}${state.mode === 'loading' ? '    loading\n' : ''}${state.mode === 'error' ? '    error="Apps remain responsible for backend retry and fetch orchestration."\n' : ''}  />\n</template>\n`
  );
}

const definition: LabSurfaceDefinition<DataTableWidgetLabState> = {
  id: 'data-table-widget',
  title: 'DataTableWidget',
  description: 'Black-box widget surface above @ww/data-grid with reusable status and framing.',
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
          id: 'surface',
          kind: 'segment',
          label: 'Shell surface',
          options: [
            { label: 'Default', value: 'default' },
            { label: 'Subtle', value: 'subtle' },
            { label: 'Elevated', value: 'elevated' },
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
        { id: 'showStatusBar', kind: 'boolean', label: 'Status bar' },
        { id: 'showToolbar', kind: 'boolean', label: 'Toolbar' },
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
            { label: 'Subtle', value: 'subtle' },
            { label: 'Error', value: 'error' },
            { label: 'Themed', value: 'themed' },
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
  previewComponent: markPreviewComponent(DataTableWidgetLabPreview),
  buildMatrixItems,
  serializeCopy,
  buildPreviewProps: (state, context) => {
    const model = buildWidgetModel(state);
    return {
      ...model,
      wrapperAttrs: buildThemeScopeAttrs(state, context),
      resetKey: JSON.stringify(state),
    };
  },
};

export default definition;
