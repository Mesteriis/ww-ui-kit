import type { Meta, StoryObj } from '@storybook/vue3-vite';

import { UiCard } from '@ww/core';
import { UiApexChart } from '@ww/charts-apex';
import { getThemeMeta } from '@ww/themes';

import {
  barOptions,
  barSeries,
  lineOptions,
  lineSeries,
  radialBarOptions,
  radialBarSeries,
} from './chart-fixtures';

const meta = {
  title: 'Foundations/Charts/Theming',
  tags: ['autodocs', '!dev'],
} satisfies Meta<typeof UiApexChart>;

export default meta;

export const Theming: StoryObj<typeof UiApexChart> = {
  render: () => ({
    components: { UiApexChart, UiCard },
    setup() {
      const darkTheme = getThemeMeta('dark');
      const belovodyeTheme = getThemeMeta('belovodye');

      return {
        barOptions,
        barSeries,
        belovodyeTheme,
        darkTheme,
        lineOptions,
        lineSeries,
        radialBarOptions,
        radialBarSeries,
      };
    },
    template: `
      <div class="ui-stack">
        <UiCard>
          <template #header>Current root theme</template>
          <UiApexChart
            type="line"
            :series="lineSeries"
            :options="lineOptions"
            title="Root theme chart"
            description="The chart follows the active Storybook theme switcher."
          />
        </UiCard>

        <div style="display: grid; gap: var(--ui-space-6); grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));">
          <section
            :data-ui-theme="darkTheme.name"
            :data-ui-theme-type="darkTheme.type"
            style="display: grid; gap: var(--ui-space-4); padding: var(--ui-space-5); border-radius: var(--ui-radius-xl); background: var(--ui-surface-default);"
          >
            <strong>{{ darkTheme.label }} / {{ darkTheme.type }}</strong>
            <UiApexChart
              type="bar"
              :series="barSeries"
              :options="barOptions"
              title="Scoped dark chart"
              description="Subtree theming works without chart-specific configuration."
            />
          </section>

          <section
            :data-ui-theme="belovodyeTheme.name"
            :data-ui-theme-type="belovodyeTheme.type"
            style="display: grid; gap: var(--ui-space-4); padding: var(--ui-space-5); border-radius: var(--ui-radius-xl); background: linear-gradient(180deg, var(--ui-surface-canvas), var(--ui-surface-default));"
          >
            <strong>{{ belovodyeTheme.label }} / {{ belovodyeTheme.type }}</strong>
            <UiApexChart
              type="radialBar"
              :series="radialBarSeries"
              :options="radialBarOptions"
              title="Scoped Belovodye chart"
              description="Tooltip, palette, grid, and surface defaults follow the subtree theme."
            />
          </section>
        </div>
      </div>
    `,
  }),
};
