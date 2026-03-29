import type { Meta, StoryObj } from '@storybook/vue3';

import { UiCard } from '@ww/core';
import { UiApexChart } from '@ww/charts-apex';

import {
  areaOptions,
  areaSeries,
  barOptions,
  barSeries,
  donutOptions,
  donutSeries,
  lineOptions,
  lineSeries
} from './chart-fixtures';

const meta = {
  title: 'Foundations/Charts/Apex Overview',
  tags: ['autodocs']
} satisfies Meta<typeof UiApexChart>;

export default meta;

export const Overview: StoryObj<typeof UiApexChart> = {
  render: () => ({
    components: { UiApexChart, UiCard },
    setup() {
      return {
        areaOptions,
        areaSeries,
        barOptions,
        barSeries,
        donutOptions,
        donutSeries,
        lineOptions,
        lineSeries
      };
    },
    template: `
      <div style="display: grid; gap: var(--ui-space-6); grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));">
        <UiCard>
          <template #header>Line</template>
          <UiApexChart
            type="line"
            :series="lineSeries"
            :options="lineOptions"
            title="Visitors"
            description="Black-box wrapper with theme-aware defaults."
          />
        </UiCard>

        <UiCard>
          <template #header>Area</template>
          <UiApexChart
            type="area"
            :series="areaSeries"
            :options="areaOptions"
            title="Active teams"
            description="Same API, different Apex chart type."
          />
        </UiCard>

        <UiCard>
          <template #header>Bar</template>
          <UiApexChart
            type="bar"
            :series="barSeries"
            :options="barOptions"
            title="Revenue by region"
            description="Consumer passes data and options only."
          />
        </UiCard>

        <UiCard>
          <template #header>Donut</template>
          <UiApexChart
            type="donut"
            :series="donutSeries"
            :options="donutOptions"
            title="Package split"
            description="Vendor internals stay inside the optional adapter package."
          />
        </UiCard>
      </div>
    `
  })
};
