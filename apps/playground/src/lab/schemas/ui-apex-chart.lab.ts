import type { UiApexChartOptions, UiApexChartSeries } from '@ww/charts-apex';

import type {
  LabCopyFormat,
  LabMatrixItem,
  LabSurfaceDefinition,
} from '../manifest/component-lab.types';
import ChartSurfaceLabPreview from '../components/ChartSurfaceLabPreview.vue';
import {
  buildThemeScopeAttrs,
  markPreviewComponent,
  serializeByFormat,
  themeScopeOptions,
} from '../runtime/schema-helpers';

type ChartType = 'line' | 'area' | 'bar' | 'donut';
type ChartMode = 'default' | 'loading' | 'empty' | 'error';

type UiApexChartLabState = {
  chartType: ChartType;
  mode: ChartMode;
  title: string;
  description: string;
  subtreeTheme: 'inherit' | 'belovodye' | 'dark';
  matrixTypes: readonly string[];
  matrixModes: readonly string[];
};

const chartFixtures: Record<
  ChartType,
  {
    series: UiApexChartSeries;
    options: UiApexChartOptions;
  }
> = {
  line: {
    series: [
      {
        name: 'Traffic',
        data: [128, 164, 152, 186, 210, 228],
      },
    ],
    options: {
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      },
    },
  },
  area: {
    series: [
      {
        name: 'Conversion',
        data: [22, 26, 28, 32, 35, 39],
      },
    ],
    options: {
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      },
    },
  },
  bar: {
    series: [
      {
        name: 'Pipeline',
        data: [38, 51, 47, 63],
      },
    ],
    options: {
      xaxis: {
        categories: ['North', 'South', 'East', 'West'],
      },
    },
  },
  donut: {
    series: [42, 28, 18, 12],
    options: {
      labels: ['Core', 'Docs', 'Playground', 'Adapters'],
    },
  },
};

const defaultState: Readonly<UiApexChartLabState> = Object.freeze({
  chartType: 'line',
  mode: 'default',
  title: 'Traffic trend',
  description: 'Theme-aware chart surface with honest Apex adapter boundaries.',
  subtreeTheme: 'inherit',
  matrixTypes: ['line', 'area', 'bar', 'donut'],
  matrixModes: ['default', 'loading', 'empty', 'error'],
});

function buildMatrixItems(
  state: UiApexChartLabState
): readonly LabMatrixItem<UiApexChartLabState>[] {
  const items: LabMatrixItem<UiApexChartLabState>[] = [];

  for (const chartType of state.matrixTypes) {
    for (const mode of state.matrixModes) {
      items.push({
        id: `${chartType}-${mode}`,
        title: `${chartType} / ${mode}`,
        patch: {
          chartType: chartType as ChartType,
          mode: mode as ChartMode,
        },
      });
    }
  }

  return items;
}

function buildChartProps(state: UiApexChartLabState) {
  const fixture = chartFixtures[state.chartType];

  return {
    type: state.chartType,
    series: state.mode === 'empty' ? [] : fixture.series,
    options: fixture.options,
    title: state.title,
    description: state.description,
    loading: state.mode === 'loading',
    empty: state.mode === 'empty',
    error: state.mode === 'error' ? 'Apex vendor mount failed.' : false,
    emptyText: 'No chart data available yet.',
  };
}

function serializeCopy(format: LabCopyFormat, state: UiApexChartLabState) {
  const payload = {
    type: state.chartType,
    ...(state.title ? { title: state.title } : {}),
    ...(state.description ? { description: state.description } : {}),
    ...(state.mode === 'loading' ? { loading: true } : {}),
    ...(state.mode === 'empty' ? { empty: true } : {}),
    ...(state.mode === 'error' ? { error: 'Apex vendor mount failed.' } : {}),
  };

  return serializeByFormat(format, payload, () => {
    const fixtureName = `${state.chartType}Fixture`;
    return `<script setup lang="ts">\nimport { UiApexChart } from '@ww/charts-apex';\n\nconst ${fixtureName} = {\n  series: ${JSON.stringify(chartFixtures[state.chartType].series, null, 2)},\n  options: ${JSON.stringify(chartFixtures[state.chartType].options, null, 2)}\n};\n</script>\n\n<template>\n  <UiApexChart\n    type="${state.chartType}"\n    :series="${fixtureName}.series"\n    :options="${fixtureName}.options"\n${payload.title ? `    title=${JSON.stringify(state.title)}\n` : ''}${payload.description ? `    description=${JSON.stringify(state.description)}\n` : ''}${state.mode === 'loading' ? '    loading\n' : ''}${state.mode === 'empty' ? '    empty\n' : ''}${state.mode === 'error' ? '    error="Apex vendor mount failed."\n' : ''}  />\n</template>\n`;
  });
}

const definition: LabSurfaceDefinition<UiApexChartLabState> = {
  id: 'ui-apex-chart',
  title: 'UiApexChart',
  description:
    'Vendor-backed chart adapter kept honest and theme-aware inside the platform runtime.',
  defaultState,
  controlSections: [
    {
      id: 'surface',
      title: 'Surface',
      controls: [
        {
          id: 'chartType',
          kind: 'segment',
          label: 'Chart type',
          options: [
            { label: 'Line', value: 'line' },
            { label: 'Area', value: 'area' },
            { label: 'Bar', value: 'bar' },
            { label: 'Donut', value: 'donut' },
          ],
        },
        {
          id: 'mode',
          kind: 'segment',
          label: 'State',
          options: [
            { label: 'Default', value: 'default' },
            { label: 'Loading', value: 'loading' },
            { label: 'Empty', value: 'empty' },
            { label: 'Error', value: 'error' },
          ],
        },
        { id: 'subtreeTheme', kind: 'select', label: 'Theme scope', options: themeScopeOptions },
      ],
    },
    {
      id: 'content',
      title: 'Copy',
      controls: [
        { id: 'title', kind: 'text', label: 'Title' },
        { id: 'description', kind: 'text', label: 'Description' },
      ],
    },
    {
      id: 'matrix',
      title: 'Matrix filters',
      controls: [
        {
          id: 'matrixTypes',
          kind: 'multi-toggle',
          label: 'Chart types',
          options: [
            { label: 'Line', value: 'line' },
            { label: 'Area', value: 'area' },
            { label: 'Bar', value: 'bar' },
            { label: 'Donut', value: 'donut' },
          ],
          enableAllLabel: 'Enable all',
          disableAllLabel: 'Clear',
        },
        {
          id: 'matrixModes',
          kind: 'multi-toggle',
          label: 'Modes',
          options: [
            { label: 'Default', value: 'default' },
            { label: 'Loading', value: 'loading' },
            { label: 'Empty', value: 'empty' },
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
  previewComponent: markPreviewComponent(ChartSurfaceLabPreview),
  buildMatrixItems,
  serializeCopy,
  buildPreviewProps: (state, context) => ({
    chartProps: buildChartProps(state),
    wrapperAttrs: buildThemeScopeAttrs(state, context),
  }),
};

export default definition;
