<script setup lang="ts">
import { computed, type Component } from 'vue';

import {
  UiApexChart,
  type UiApexChartOptions,
  type UiApexChartSeries,
  type UiApexChartType,
} from '@ww/charts-apex';

import type { LabPreviewContext, LabSurfaceDefinition } from '../manifest/component-lab.types';

defineOptions({ name: 'ChartSurfaceLabPreview' });

const props = defineProps<{
  definition: LabSurfaceDefinition<Record<string, unknown>>;
  state: Record<string, unknown>;
  previewContext: LabPreviewContext;
}>();

type ChartPreviewProps = {
  type: UiApexChartType;
  series: UiApexChartSeries;
  options: UiApexChartOptions;
  title?: string;
  description?: string;
  loading?: boolean;
  empty?: boolean;
  error?: string | false;
  emptyText?: string;
};

const resolved = computed(
  () =>
    props.definition.buildPreviewProps?.(props.state, props.previewContext) as {
      chartProps: ChartPreviewProps;
      wrapperAttrs?: Record<string, unknown>;
    }
);

const chartComponent = UiApexChart as Component;
</script>

<template>
  <div class="lab-preview lab-preview--chart" data-lab-preview-canvas="chart">
    <section class="lab-preview__chart-surface" v-bind="resolved?.wrapperAttrs ?? {}">
      <component :is="chartComponent" v-bind="resolved?.chartProps ?? {}" />
    </section>
  </div>
</template>
