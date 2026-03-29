import { defineComponent, h, nextTick, ref } from 'vue';
import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';

const flushThemeOptions = async () => {
  await Promise.resolve();
  await nextTick();
};

describe('useApexThemeOptions fallback branch', () => {
  afterEach(() => {
    vi.doUnmock('./useApexThemeSync');
    vi.resetModules();
    document.body.innerHTML = '';
    document.documentElement.style.removeProperty('--ui-chart-series-1');
  });

  it('falls back to documentElement when the resolved theme scope container is null on the client', async () => {
    document.documentElement.style.setProperty('--ui-chart-series-1', 'rgb(9 8 7)');

    vi.doMock('./useApexThemeSync', () => ({
      useApexThemeSync: () => ({
        themeScope: ref({
          container: null,
          themeName: 'light',
          themeType: 'light',
          revision: 0
        })
      })
    }));

    const { useApexThemeOptions } = await import('./useApexThemeOptions');

    const Harness = defineComponent({
      setup(_, { expose }) {
        const hostRef = ref<HTMLElement | null>(null);
        const chartId = ref('chart-null-scope');
        const type = ref<'line'>('line');
        const options = ref(undefined);
        const noDataText = ref('No data');
        const state = useApexThemeOptions({
          hostRef,
          chartId,
          type,
          options,
          noDataText
        });
        expose(state);
        return () => h('div');
      }
    });

    const wrapper = mount(Harness);
    await flushThemeOptions();

    const state = wrapper.vm as typeof wrapper.vm & {
      resolvedOptions: {
        colors?: string[];
      };
      themeScope: {
        container: HTMLElement | null;
      };
    };

    expect(state.themeScope.container).toBeNull();
    expect(state.resolvedOptions.colors?.[0]).toBe('rgb(9 8 7)');
  });
});
