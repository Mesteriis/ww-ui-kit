import { computed, type Ref } from 'vue';
import type { ApexOptions } from 'apexcharts';

import { prefersReducedMotion } from '@ww/primitives';
import type { ThemeType } from '@ww/themes';

import { normalizeApexOptions } from '../internal/normalize-apex-options';
import { useApexThemeSync } from './useApexThemeSync';
import type { UiApexChartOptions, UiApexChartType } from '../types';

interface UseApexThemeOptionsParams {
  hostRef: Ref<HTMLElement | null>;
  chartId: Ref<string>;
  type: Ref<UiApexChartType>;
  options: Ref<UiApexChartOptions | undefined>;
  noDataText: Ref<string>;
}

const seriesPaletteFallback = [
  'var(--ui-chart-series-1, currentColor)',
  'var(--ui-chart-series-2, currentColor)',
  'var(--ui-chart-series-3, currentColor)',
  'var(--ui-chart-series-4, currentColor)',
  'var(--ui-chart-series-5, currentColor)',
  'var(--ui-chart-series-6, currentColor)',
  'var(--ui-chart-series-7, currentColor)',
  'var(--ui-chart-series-8, currentColor)'
] as const;

function readCssVariable(styles: CSSStyleDeclaration | null, name: string, fallback: string): string {
  const value = styles?.getPropertyValue(name).trim();
  return value || fallback;
}

function createThemeDrivenOptions(
  themeRoot: HTMLElement | null,
  themeType: ThemeType,
  chartType: UiApexChartType,
  noDataText: string
): ApexOptions {
  const styles =
    typeof window === 'undefined'
      ? null
      : window.getComputedStyle(themeRoot ?? window.document.documentElement);
  const seriesPalette = seriesPaletteFallback.map((fallback, index) =>
    readCssVariable(styles, `--ui-chart-series-${index + 1}`, fallback)
  );
  const primarySeriesColor = seriesPalette[0]!;
  const background = readCssVariable(styles, '--ui-surface-default', 'var(--ui-surface-default, Canvas)');
  const textSecondary = readCssVariable(styles, '--ui-text-secondary', 'var(--ui-text-secondary, CanvasText)');
  const fontFamily = readCssVariable(styles, '--ui-text-font-family', 'inherit');
  const gridLine = readCssVariable(
    styles,
    '--ui-chart-grid-line',
    'var(--ui-chart-grid-line, color-mix(in srgb, CanvasText 16%, Canvas))'
  );
  const axisLabel = readCssVariable(styles, '--ui-chart-axis-label', textSecondary);
  const axisBorder = readCssVariable(styles, '--ui-chart-axis-border', gridLine);
  const axisTick = readCssVariable(styles, '--ui-chart-axis-tick', axisBorder);
  const legendText = readCssVariable(styles, '--ui-chart-legend-text', textSecondary);
  const crosshair = readCssVariable(styles, '--ui-chart-crosshair', axisBorder);
  const selectionFill = readCssVariable(
    styles,
    '--ui-chart-selection-fill',
    'color-mix(in srgb, var(--ui-chart-series-1) 16%, transparent)'
  );
  const selectionBorder = readCssVariable(
    styles,
    '--ui-chart-selection-border',
    readCssVariable(styles, '--ui-border-focus', primarySeriesColor)
  );
  const markerStroke = readCssVariable(styles, '--ui-chart-marker-stroke', background);
  const noDataColor = readCssVariable(styles, '--ui-chart-no-data-text', textSecondary);

  return {
    chart: {
      background: 'transparent',
      foreColor: textSecondary,
      fontFamily,
      selection: {
        enabled: true,
        fill: {
          color: selectionFill,
          opacity: 1
        },
        stroke: {
          color: selectionBorder,
          width: 1
        }
      },
      toolbar: {
        show: true
      }
    },
    colors: seriesPalette,
    theme: {
      mode: themeType
    },
    grid: {
      borderColor: gridLine,
      strokeDashArray: 4
    },
    xaxis: {
      axisBorder: {
        show: true,
        color: axisBorder
      },
      axisTicks: {
        show: true,
        color: axisTick
      },
      labels: {
        style: {
          colors: axisLabel,
          fontFamily
        }
      },
      crosshairs: {
        stroke: {
          color: crosshair
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: axisLabel,
          fontFamily
        }
      }
    },
    legend: {
      labels: {
        colors: legendText
      }
    },
    stroke: {
      width:
        chartType === 'bar' || chartType === 'heatmap' || chartType === 'treemap' || chartType === 'donut' || chartType === 'pie'
          ? 0
          : chartType === 'radialBar'
            ? 2
            : 3,
      curve: chartType === 'line' || chartType === 'area' ? 'smooth' : 'straight'
    },
    fill: {
      opacity: chartType === 'area' ? 0.18 : 1
    },
    markers: {
      size: chartType === 'line' || chartType === 'area' ? 4 : 0,
      strokeColors: markerStroke,
      strokeWidth: 2
    },
    plotOptions: {
      bar: {
        borderRadius: 6,
        columnWidth: '58%'
      },
      radialBar: {
        hollow: {
          size: '54%'
        },
        track: {
          background: gridLine
        }
      }
    },
    tooltip: {
      enabled: true,
      theme: themeType,
      style: {
        fontFamily
      },
      fillSeriesColor: false,
      marker: {
        show: true
      }
    },
    noData: {
      text: noDataText,
      style: {
        color: noDataColor,
        fontFamily
      }
    },
    responsive: [
      {
        breakpoint: 640,
        options: {
          legend: {
            position: 'bottom'
          }
        }
      }
    ],
    states: {
      active: {
        filter: {
          type: 'none'
        }
      }
    }
  };
}

export function useApexThemeOptions({
  hostRef,
  chartId,
  type,
  options,
  noDataText
}: UseApexThemeOptionsParams) {
  const { themeScope } = useApexThemeSync(hostRef);

  const resolvedOptions = computed(() =>
    normalizeApexOptions(
      options.value
        ? {
            chartId: chartId.value,
            type: type.value,
            noDataText: noDataText.value,
            reducedMotion: prefersReducedMotion(),
            themeOptions: createThemeDrivenOptions(
              themeScope.value.container,
              themeScope.value.themeType,
              type.value,
              noDataText.value
            ),
            userOptions: options.value
          }
        : {
            chartId: chartId.value,
            type: type.value,
            noDataText: noDataText.value,
            reducedMotion: prefersReducedMotion(),
            themeOptions: createThemeDrivenOptions(
              themeScope.value.container,
              themeScope.value.themeType,
              type.value,
              noDataText.value
            )
          }
    )
  );

  return {
    resolvedOptions,
    themeScope
  };
}
