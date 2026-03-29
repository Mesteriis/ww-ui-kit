import type { UiApexChartOptions, UiApexChartSeries } from '@ww/charts-apex';

export const monthCategories = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

export const lineSeries: UiApexChartSeries = [
  {
    name: 'Visitors',
    data: [128, 164, 152, 186, 210, 228]
  }
];

export const lineOptions: UiApexChartOptions = {
  xaxis: {
    categories: monthCategories
  }
};

export const areaSeries: UiApexChartSeries = [
  {
    name: 'Active teams',
    data: [32, 38, 42, 49, 54, 58]
  }
];

export const areaOptions: UiApexChartOptions = {
  xaxis: {
    categories: monthCategories
  }
};

export const barSeries: UiApexChartSeries = [
  {
    name: 'Revenue',
    data: [38, 51, 47, 63]
  }
];

export const barOptions: UiApexChartOptions = {
  xaxis: {
    categories: ['North', 'South', 'East', 'West']
  }
};

export const donutSeries: UiApexChartSeries = [42, 28, 18, 12];

export const donutOptions: UiApexChartOptions = {
  labels: ['Core', 'Docs', 'Playground', 'Adapters']
};

export const radialBarSeries: UiApexChartSeries = [72];

export const radialBarOptions: UiApexChartOptions = {
  labels: ['Adoption']
};

export const heatmapSeries: UiApexChartSeries = [
  {
    name: 'Mon',
    data: [
      { x: '08:00', y: 22 },
      { x: '12:00', y: 32 },
      { x: '16:00', y: 27 }
    ]
  },
  {
    name: 'Tue',
    data: [
      { x: '08:00', y: 16 },
      { x: '12:00', y: 28 },
      { x: '16:00', y: 35 }
    ]
  },
  {
    name: 'Wed',
    data: [
      { x: '08:00', y: 24 },
      { x: '12:00', y: 30 },
      { x: '16:00', y: 41 }
    ]
  }
];

export const heatmapOptions: UiApexChartOptions = {
  dataLabels: {
    enabled: false
  }
};
