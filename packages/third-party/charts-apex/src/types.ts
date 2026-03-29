import type {
  ApexAxisChartSeries,
  ApexChart,
  ApexNonAxisChartSeries,
  ApexOptions
} from 'apexcharts';

export type UiApexChartType = NonNullable<ApexChart['type']>;
export type UiApexChartSeries = ApexAxisChartSeries | ApexNonAxisChartSeries;
export type UiApexChartOptions = ApexOptions;
export type UiApexChartSize = number | string;
export type UiApexChartError = boolean | string | Error | null | undefined;

export interface UiApexChartProps {
  type: UiApexChartType;
  series: UiApexChartSeries;
  options?: UiApexChartOptions;
  width?: UiApexChartSize;
  height?: UiApexChartSize;
  title?: string;
  description?: string;
  ariaLabel?: string;
  loading?: boolean;
  error?: UiApexChartError;
  empty?: boolean;
  emptyText?: string;
  errorText?: string;
  noDataText?: string;
}
