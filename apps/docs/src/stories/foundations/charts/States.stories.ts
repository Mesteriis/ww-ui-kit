import type { Meta, StoryObj } from '@storybook/vue3';

import { UiCard } from '@ww/core';
import { UiApexChart } from '@ww/charts-apex';

import { lineOptions, lineSeries } from './chart-fixtures';

const meta = {
  title: 'Foundations/Charts/States',
  tags: ['autodocs'],
} satisfies Meta<typeof UiApexChart>;

export default meta;

export const States: StoryObj<typeof UiApexChart> = {
  render: () => ({
    components: { UiApexChart, UiCard },
    setup() {
      return {
        lineOptions,
        lineSeries,
      };
    },
    template: `
      <div style="display: grid; gap: var(--ui-space-6); grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));">
        <UiCard>
          <template #header>Loading</template>
          <UiApexChart type="line" :series="lineSeries" :options="lineOptions" loading title="Loading chart" />
        </UiCard>

        <UiCard>
          <template #header>Empty</template>
          <UiApexChart type="bar" :series="[]" empty empty-text="No chart data yet." title="Empty state" />
        </UiCard>

        <UiCard>
          <template #header>Error</template>
          <UiApexChart
            type="line"
            :series="lineSeries"
            :options="lineOptions"
            error="Apex failed to mount for this chart."
            title="Error state"
          />
        </UiCard>

        <UiCard>
          <template #header>No data text</template>
          <UiApexChart
            type="line"
            :series="[]"
            :options="{ noData: { align: 'center' } }"
            no-data-text="Awaiting ingestion."
            title="Vendor noData text"
          />
        </UiCard>
      </div>
    `,
  }),
};
