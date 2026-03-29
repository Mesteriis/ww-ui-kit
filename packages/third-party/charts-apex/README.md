# @ww/charts-apex

Optional ApexCharts adapter package for Belovodye UiKit.

## Why this package exists

`@ww/charts-apex` keeps vendor charting separate from `@ww/core`.

- `@ww/core` stays free of chart-library dependencies.
- consumers get a black-box `UiApexChart` component instead of raw Apex setup
- theme, ThemeType, reduced-motion, and state handling stay aligned with the existing design system

## Installation

```bash
pnpm add @ww/charts-apex
```

The package carries `apexcharts` and `vue3-apexcharts` as internal vendor dependencies. Consumers do not need to register a global Vue plugin or import vendor-specific features manually.

## Usage

```ts
import '@ww/themes/theme-light.css';
import '@ww/charts-apex/styles.css';
```

```vue
<script setup lang="ts">
import { UiApexChart, type UiApexChartOptions, type UiApexChartSeries } from '@ww/charts-apex';

const series: UiApexChartSeries = [
  {
    name: 'Revenue',
    data: [14, 18, 21, 24],
  },
];

const options: UiApexChartOptions = {
  xaxis: {
    categories: ['Q1', 'Q2', 'Q3', 'Q4'],
  },
};
</script>

<template>
  <UiApexChart
    type="line"
    :series="series"
    :options="options"
    title="Quarterly revenue"
    description="Theme-aware Apex chart wrapper"
  />
</template>
```

## Theme integration

- the chart reads the nearest themed container
- both `data-ui-theme` and `data-ui-theme-type` are respected
- subtree theming works without extra chart configuration
- tooltip mode, chart theme mode, colors, grid, axis, legend, and no-data styling follow the active design-system tokens

If you apply a scoped theme:

```ts
import { setTheme } from '@ww/themes';

setTheme('belovodye', themedContainer);
```

Charts inside that subtree pick up the same theme automatically.

## Loading, empty, and error states

`UiApexChart` supports:

- `loading`
- `empty`
- `error`
- `emptyText`
- `errorText`
- `noDataText`

Slots are also available:

- `loading`
- `empty`
- `error`

## SSR behavior

The vendor wrapper is loaded only on the client. Server render falls back to a safe shell and does not touch `window` or `document` without guards.

## License note

This package is a vendor-backed adapter around ApexCharts. Consumers are responsible for checking whether the ApexCharts license fits their usage scenario.
