import type { Meta, StoryObj } from '@storybook/vue3';
import { ref } from 'vue';

import { UiBadge, UiCard } from '@ww/core';
import { UiApexChart, type UiApexChartOptions } from '@ww/charts-apex';

import { lineSeries, monthCategories } from './chart-fixtures';

const meta = {
  title: 'Foundations/Charts/Interactions',
  tags: ['autodocs'],
} satisfies Meta<typeof UiApexChart>;

export default meta;

export const Interactions: StoryObj<typeof UiApexChart> = {
  render: () => ({
    components: { UiApexChart, UiBadge, UiCard },
    setup() {
      const lastSelection = ref('No selection yet');

      const interactionOptions: UiApexChartOptions = {
        chart: {
          events: {
            dataPointSelection: (_event, _chartContext, config) => {
              const seriesIndex = config?.seriesIndex ?? -1;
              const dataPointIndex = config?.dataPointIndex ?? -1;
              lastSelection.value = `series ${seriesIndex}, point ${dataPointIndex}`;
            },
          },
        },
        xaxis: {
          categories: monthCategories,
        },
      };

      const groupedBase: UiApexChartOptions = {
        chart: {
          group: 'traffic-sync',
          toolbar: {
            show: false,
          },
        },
        xaxis: {
          categories: monthCategories,
        },
      };

      return {
        groupedBase,
        interactionOptions,
        lastSelection,
        lineSeries,
      };
    },
    template: `
      <div class="ui-stack">
        <UiCard>
          <template #header>Events via options.chart.events</template>
          <div class="ui-stack">
            <UiBadge variant="brand">{{ lastSelection }}</UiBadge>
            <UiApexChart
              type="line"
              :series="lineSeries"
              :options="interactionOptions"
              title="Interaction events"
              description="The adapter keeps vendor lifecycle internal while still allowing Apex events through options."
            />
          </div>
        </UiCard>

        <UiCard>
          <template #header>Grouped charts</template>
          <div style="display: grid; gap: var(--ui-space-6); grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));">
            <UiApexChart
              type="line"
              :series="lineSeries"
              :options="groupedBase"
              title="Traffic sync A"
              description="Uses options.chart.group."
            />
            <UiApexChart
              type="area"
              :series="lineSeries"
              :options="groupedBase"
              title="Traffic sync B"
              description="Grouped sync remains vendor-driven."
            />
          </div>
        </UiCard>
      </div>
    `,
  }),
};
