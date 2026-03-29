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

const lightPaletteFallback = [
  '#6366f1',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#64748b',
  '#4338ca',
  '#047857',
  '#b45309'
] as const;

const darkPaletteFallback = [
  '#a5b4fc',
  '#6ee7b7',
  '#fcd34d',
  '#fca5a5',
  '#cbd5e1',
  '#c7d2fe',
  '#a7f3d0',
  '#fde68a'
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
  const styles = typeof window === 'undefined' || !themeRoot ? null : window.getComputedStyle(themeRoot);
  const seriesPaletteFallback = themeType === 'dark' ? darkPaletteFallback : lightPaletteFallback;
  const seriesPalette = seriesPaletteFallback.map((fallback, index) =>
    readCssVariable(styles, `--ui-chart-series-${index + 1}`, fallback)
  );
  const primarySeriesColor = seriesPalette[0]!;
  const background = readCssVariable(styles, '--ui-surface-default', themeType === 'dark' ? '#0f172a' : '#ffffff');
  const textSecondary = readCssVariable(styles, '--ui-text-secondary', themeType === 'dark' ? '#cbd5e1' : '#475569');
  const fontFamily = readCssVariable(styles, '--ui-text-font-family', 'inherit');
  const gridLine = readCssVariable(
    styles,
    '--ui-chart-grid-line',
    themeType === 'dark' ? 'rgba(148, 163, 184, 0.18)' : '#e2e8f0'
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
