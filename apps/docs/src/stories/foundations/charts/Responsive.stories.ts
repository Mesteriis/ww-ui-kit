import type { Meta, StoryObj } from '@storybook/vue3';

import { UiCard } from '@ww/core';
import { UiApexChart } from '@ww/charts-apex';

import { areaOptions, areaSeries } from './chart-fixtures';

const meta = {
  title: 'Foundations/Charts/Responsive',
  tags: ['autodocs']
} satisfies Meta<typeof UiApexChart>;

export default meta;

export const Responsive: StoryObj<typeof UiApexChart> = {
  render: () => ({
    components: { UiApexChart, UiCard },
    setup() {
      return {
        areaOptions,
        areaSeries
      };
    },
    template: `
      <UiCard>
        <template #header>Resizable container</template>
        <div
          style="
            resize: horizontal;
            overflow: auto;
            min-width: 18rem;
            width: min(100%, 44rem);
            padding: var(--ui-space-2);
            border: 1px dashed var(--ui-border-subtle);
            border-radius: var(--ui-radius-lg);
          "
        >
          <UiApexChart
            type="area"
            :series="areaSeries"
            :options="areaOptions"
            title="Responsive chart"
            description="Apex redraws inside a resizable parent container."
            height="320"
          />
        </div>
      </UiCard>
    `
  })
};
