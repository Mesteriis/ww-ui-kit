import { defineComponent, h, nextTick, ref } from 'vue';
import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { useApexThemeOptions } from './useApexThemeOptions';

const flushThemeOptions = async () => {
  await Promise.resolve();
  await nextTick();
};

describe('useApexThemeOptions', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    document.body.innerHTML = '';
    document.documentElement.removeAttribute('data-ui-theme');
    document.documentElement.removeAttribute('data-ui-theme-type');
  });

  it('derives dark theme defaults from the nearest themed container', async () => {
    const Harness = defineComponent({
      setup(_, { expose }) {
        const hostRef = ref<HTMLElement | null>(null);
        const chartId = ref('chart-dark');
        const type = ref<'line' | 'radialBar'>('line');
        const options = ref(undefined);
        const noDataText = ref('No data');
        const state = useApexThemeOptions({
          hostRef,
          chartId,
          type,
          options,
          noDataText,
        });
        const setType = (nextType: 'line' | 'radialBar') => {
          type.value = nextType;
        };
        expose({ hostRef, options, setType, ...state });
        return () =>
          h('section', { 'data-ui-theme': 'dark', 'data-ui-theme-type': 'dark' }, [
            h('div', { ref: hostRef }),
          ]);
      },
    });

    const wrapper = mount(Harness, { attachTo: document.body });
    await flushThemeOptions();

    const state = wrapper.vm as typeof wrapper.vm & {
      options: { value: unknown };
      resolvedOptions: {
        chart?: { type?: string; foreColor?: string };
        colors?: string[];
        stroke?: { width?: number; curve?: string };
        tooltip?: { theme?: string };
        theme?: { mode?: string };
        markers?: { size?: number };
      };
      themeScope: {
        themeName: string;
        themeType: string;
      };
      setType: (nextType: 'line' | 'radialBar') => void;
    };

    expect(state.themeScope.themeName).toBe('dark');
    expect(state.themeScope.themeType).toBe('dark');
    expect(state.resolvedOptions.theme?.mode).toBe('dark');
    expect(state.resolvedOptions.tooltip?.theme).toBe('dark');
    expect(state.resolvedOptions.colors).toHaveLength(8);
    expect(state.resolvedOptions.stroke?.width).toBe(3);
    expect(state.resolvedOptions.stroke?.curve).toBe('smooth');
    expect(state.resolvedOptions.markers?.size).toBe(4);

    state.setType('radialBar');
    await flushThemeOptions();
    expect(state.resolvedOptions.stroke?.width).toBe(2);
    expect(state.resolvedOptions.markers?.size).toBe(0);
  });

  it('merges user options while keeping the prop type canonical in belovodye dark scopes', async () => {
    const Harness = defineComponent({
      setup(_, { expose }) {
        const hostRef = ref<HTMLElement | null>(null);
        const chartId = ref('chart-light');
        const type = ref<'line' | 'area'>('area');
        const options = ref({
          chart: {
            id: 'custom-id',
            type: 'line' as const,
          },
          colors: ['#123456'],
        });
        const noDataText = ref('No data');
        const state = useApexThemeOptions({
          hostRef,
          chartId,
          type,
          options,
          noDataText,
        });
        expose({ options, ...state });
        return () =>
          h('section', { 'data-ui-theme': 'belovodye', 'data-ui-theme-type': 'dark' }, [
            h('div', { ref: hostRef }),
          ]);
      },
    });

    const wrapper = mount(Harness, { attachTo: document.body });
    await flushThemeOptions();

    const state = wrapper.vm as typeof wrapper.vm & {
      resolvedOptions: {
        chart?: { id?: string; type?: string };
        colors?: string[];
        fill?: { opacity?: number };
        tooltip?: { theme?: string };
        theme?: { mode?: string };
      };
    };

    expect(state.resolvedOptions.chart?.id).toBe('custom-id');
    expect(state.resolvedOptions.chart?.type).toBe('area');
    expect(state.resolvedOptions.colors).toEqual(['#123456']);
    expect(state.resolvedOptions.fill?.opacity).toBe(0.18);
    expect(state.resolvedOptions.tooltip?.theme).toBe('dark');
    expect(state.resolvedOptions.theme?.mode).toBe('dark');
  });

  it('falls back cleanly when the host element is not mounted yet', async () => {
    document.documentElement.style.setProperty('--ui-chart-series-1', 'rgb(1 2 3)');
    document.documentElement.style.setProperty('--ui-surface-default', 'rgb(250 251 252)');

    const Harness = defineComponent({
      setup(_, { expose }) {
        const hostRef = ref<HTMLElement | null>(null);
        const chartId = ref('chart-unmounted');
        const type = ref<'line'>('line');
        const options = ref(undefined);
        const noDataText = ref('No data');
        const state = useApexThemeOptions({
          hostRef,
          chartId,
          type,
          options,
          noDataText,
        });
        const setNoDataText = (value: string) => {
          noDataText.value = value;
        };
        expose({ setNoDataText, ...state });
        return () => h('div');
      },
    });

    const wrapper = mount(Harness);
    await flushThemeOptions();

    const state = wrapper.vm as typeof wrapper.vm & {
      resolvedOptions: {
        chart?: { type?: string };
        theme?: { mode?: string };
        tooltip?: { theme?: string };
        noData?: { text?: string };
      };
      themeScope: {
        themeName: string;
        themeType: string;
      };
      setNoDataText: (value: string) => void;
    };

    expect(state.themeScope.themeName).toBe('light');
    expect(state.themeScope.themeType).toBe('light');
    expect(state.resolvedOptions.chart?.type).toBe('line');
    expect(state.resolvedOptions.colors?.[0]).toBe('rgb(1 2 3)');
    expect(state.resolvedOptions.theme?.mode).toBe('light');
    expect(state.resolvedOptions.tooltip?.theme).toBe('light');

    vi.stubGlobal('window', undefined);
    state.setNoDataText('Server-safe fallback');
    await flushThemeOptions();

    expect(state.resolvedOptions.noData?.text).toBe('Server-safe fallback');
    expect(state.resolvedOptions.theme?.mode).toBe('light');

    document.documentElement.style.removeProperty('--ui-chart-series-1');
    document.documentElement.style.removeProperty('--ui-surface-default');
  });
});
