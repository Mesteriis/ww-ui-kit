import type { Meta, StoryObj } from '@storybook/vue3';

import { UiBadge } from '@ww/core';
import { UiApexChart } from '@ww/charts-apex';
import { getThemeMeta } from '@ww/themes';

import { donutOptions, donutSeries, lineOptions, lineSeries } from './chart-fixtures';

const meta = {
  title: 'Foundations/Charts/ThemeType',
  tags: ['autodocs'],
} satisfies Meta<typeof UiApexChart>;

export default meta;

export const ThemeType: StoryObj<typeof UiApexChart> = {
  render: () => ({
    components: { UiApexChart, UiBadge },
    setup() {
      const lightTheme = getThemeMeta('light');
      const darkTheme = getThemeMeta('belovodye');

      return {
        darkTheme,
        donutOptions,
        donutSeries,
        lightTheme,
        lineOptions,
        lineSeries,
      };
    },
    template: `
      <div style="display: grid; gap: var(--ui-space-6); grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));">
        <section
          :data-ui-theme="lightTheme.name"
          :data-ui-theme-type="lightTheme.type"
          style="display: grid; gap: var(--ui-space-4); padding: var(--ui-space-5); border: 1px solid var(--ui-border-subtle); border-radius: var(--ui-radius-xl); background: linear-gradient(180deg, var(--ui-surface-canvas), var(--ui-surface-default));"
        >
          <UiBadge variant="brand">{{ lightTheme.label }} / {{ lightTheme.type }}</UiBadge>
          <UiApexChart
            type="line"
            :series="lineSeries"
            :options="lineOptions"
            title="Light-family defaults"
            description="Hover to inspect tooltip defaults derived from ThemeType=light."
          />
        </section>

        <section
          :data-ui-theme="darkTheme.name"
          :data-ui-theme-type="darkTheme.type"
          style="display: grid; gap: var(--ui-space-4); padding: var(--ui-space-5); border: 1px solid var(--ui-border-subtle); border-radius: var(--ui-radius-xl); background: var(--ui-surface-default);"
        >
          <UiBadge variant="danger">{{ darkTheme.label }} / {{ darkTheme.type }}</UiBadge>
          <UiApexChart
            type="donut"
            :series="donutSeries"
            :options="donutOptions"
            title="Belovodye dark-family defaults"
            description="Tooltip theme, chart mode, and fallbacks derive from ThemeType=dark."
          />
        </section>
      </div>
    `,
  }),
};
