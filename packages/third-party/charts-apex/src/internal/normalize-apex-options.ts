import type { ApexOptions } from 'apexcharts';

import { mergeApexOptions } from './merge-apex-options';
import type { UiApexChartType } from '../types';

interface NormalizeApexOptionsParams {
  chartId: string;
  type: UiApexChartType;
  noDataText: string;
  reducedMotion: boolean;
  themeOptions: ApexOptions;
  userOptions?: ApexOptions | undefined;
}

const warnedTypeConflicts = new Set<string>();

function warnTypeConflict(requestedType: UiApexChartType, optionType: string): void {
  const key = `${requestedType}:${optionType}`;
  if (warnedTypeConflicts.has(key) || typeof console === 'undefined') {
    return;
  }

  warnedTypeConflicts.add(key);
  console.warn(
    `[ui-apex-chart] Prop "type" is canonical. Ignoring options.chart.type="${optionType}" in favor of "${requestedType}".`
  );
}

export function normalizeApexOptions({
  chartId,
  type,
  noDataText,
  reducedMotion,
  themeOptions,
  userOptions,
}: NormalizeApexOptionsParams): ApexOptions {
  if (userOptions?.chart?.type && userOptions.chart.type !== type) {
    warnTypeConflict(type, String(userOptions.chart.type));
  }

  const defaultAnimations = reducedMotion
    ? {
        enabled: false,
        speed: 1,
        animateGradually: {
          enabled: false,
          delay: 0,
        },
        dynamicAnimation: {
          enabled: false,
          speed: 1,
        },
      }
    : {
        enabled: true,
        speed: 200,
        animateGradually: {
          enabled: true,
          delay: 32,
        },
        dynamicAnimation: {
          enabled: true,
          speed: 160,
        },
      };

  const internalDefaults: ApexOptions = {
    chart: {
      id: chartId,
      type,
      background: 'transparent',
      redrawOnParentResize: true,
      redrawOnWindowResize: true,
      animations: defaultAnimations,
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'left',
    },
    noData: {
      text: noDataText,
    },
  };

  const merged = mergeApexOptions<ApexOptions>(internalDefaults, themeOptions, userOptions);
  const mergedChart = merged.chart as NonNullable<ApexOptions['chart']>;
  const normalizedChart: NonNullable<ApexOptions['chart']> = {
    ...mergedChart,
    id: userOptions?.chart?.id ?? chartId,
    type,
    redrawOnParentResize: true,
    redrawOnWindowResize: true,
  };

  if (reducedMotion) {
    normalizedChart.animations = {
      ...mergedChart.animations,
      enabled: false,
      speed: 1,
      animateGradually: {
        ...mergedChart.animations?.animateGradually,
        enabled: false,
        delay: 0,
      },
      dynamicAnimation: {
        ...mergedChart.animations?.dynamicAnimation,
        enabled: false,
        speed: 1,
      },
    };
  } else {
    // Internal defaults always seed chart animations, so the merged chart keeps a concrete animation object.
    normalizedChart.animations = mergedChart.animations as NonNullable<
      NonNullable<ApexOptions['chart']>['animations']
    >;
  }

  const mergedNoData = merged.noData as NonNullable<ApexOptions['noData']>;
  const normalizedNoData: NonNullable<ApexOptions['noData']> = {
    ...mergedNoData,
    // Internal defaults always seed noData.text, so merged no-data config remains concrete.
    text: mergedNoData.text as string,
  };

  return {
    ...merged,
    chart: normalizedChart,
    noData: normalizedNoData,
  };
}
