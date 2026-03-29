import { defineComponent, h, nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import { renderToString } from 'vue/server-renderer';
import { afterEach, describe, expect, it, vi } from 'vitest';

import UiApexChart from './UiApexChart.vue';
import { UiApexChart as ExportedUiApexChart } from '../index';

let lastVendorProps: Record<string, unknown> | null = null;

vi.mock('vue3-apexcharts', () => {
  const MockApexChart = defineComponent({
    name: 'MockApexChart',
    props: {
      type: { type: String, required: true },
      series: { type: Array, required: true },
      options: { type: Object, required: true },
      width: { type: [Number, String], default: undefined },
      height: { type: [Number, String], default: undefined }
    },
    render() {
      if ((this.options as { chart?: { id?: string } } | undefined)?.chart?.id === 'throw-render') {
        throw new Error('Vendor render failed');
      }
      if ((this.options as { chart?: { id?: string } } | undefined)?.chart?.id === 'throw-string') {
        throw 'String render failure';
      }

      lastVendorProps = {
        type: this.type,
        series: this.series,
        options: this.options,
        width: this.width,
        height: this.height
      };

      return h('div', {
        'data-testid': 'mock-apex-chart',
        'data-type': String(this.type),
        'data-width': String(this.width ?? ''),
        'data-height': String(this.height ?? '')
      });
    }
  });

  return {
    default: MockApexChart
  };
});

function createMatchMediaMock(matches: boolean) {
  return vi.fn().mockImplementation(() => ({
    matches,
    media: '(prefers-reduced-motion: reduce)',
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn()
  }));
}

async function flushAsyncWork() {
  await Promise.resolve();
  await nextTick();
  await new Promise((resolve) => window.setTimeout(resolve, 0));
  await nextTick();
}

describe('UiApexChart', () => {
  afterEach(() => {
    document.documentElement.removeAttribute('data-ui-theme');
    document.documentElement.removeAttribute('data-ui-theme-type');
    document.body.innerHTML = '';
    lastVendorProps = null;
    vi.unstubAllGlobals();
  });

  it('exports the public component and renders the vendor wrapper with canonical props', async () => {
    expect(ExportedUiApexChart).toBe(UiApexChart);

    const options = {
      chart: {
        type: 'line' as const
      },
      colors: ['#123456'],
      xaxis: {
        categories: ['Jan', 'Feb']
      }
    };
    const optionsSnapshot = structuredClone(options);

    const wrapper = mount(UiApexChart, {
      attachTo: document.body,
      props: {
        type: 'bar',
        series: [
          {
            name: 'Revenue',
            data: [10, 18]
          }
        ],
        options,
        width: '100%',
        height: 280,
        title: 'Revenue',
        description: 'Quarterly revenue'
      }
    });

    await flushAsyncWork();

    expect(wrapper.get('[data-testid="mock-apex-chart"]').attributes('data-type')).toBe('bar');
    expect(lastVendorProps?.type).toBe('bar');
    expect((lastVendorProps?.options as { chart?: { type?: string } }).chart?.type).toBe('bar');
    expect(lastVendorProps?.width).toBe('100%');
    expect(lastVendorProps?.height).toBe(280);
    expect(options).toEqual(optionsSnapshot);
    expect(wrapper.text()).toContain('Quarterly revenue');

    wrapper.unmount();
  });

  it('handles loading, empty, error, theme sync, and reduced motion without exposing vendor setup', async () => {
    vi.stubGlobal('matchMedia', createMatchMediaMock(true));

    const themedWrapper = mount(
      defineComponent({
        components: { UiApexChart },
        data: () => ({
          chartLoading: false
        }),
        template: `
          <section id="scope" data-ui-theme="dark" data-ui-theme-type="dark">
            <UiApexChart
              :loading="chartLoading"
              type="line"
              :series="[{ name: 'Traffic', data: [12, 18, 9] }]"
            />
          </section>
        `
      }),
      {
        attachTo: document.body
      }
    );

    await flushAsyncWork();

    expect((lastVendorProps?.options as { tooltip?: { theme?: string } }).tooltip?.theme).toBe('dark');
    expect((lastVendorProps?.options as { theme?: { mode?: string } }).theme?.mode).toBe('dark');
    expect((lastVendorProps?.options as { chart?: { animations?: { enabled?: boolean } } }).chart?.animations?.enabled).toBe(false);

    const scope = themedWrapper.get('#scope').element as HTMLElement;
    scope.setAttribute('data-ui-theme', 'belovodye');
    scope.setAttribute('data-ui-theme-type', 'light');
    await flushAsyncWork();

    expect((lastVendorProps?.options as { tooltip?: { theme?: string } }).tooltip?.theme).toBe('light');

    themedWrapper.unmount();

    const loadingWrapper = mount(UiApexChart, {
      props: {
        loading: true,
        type: 'line',
        series: [],
        empty: true
      }
    });
    expect(loadingWrapper.find('.ui-apex-chart__state--loading').exists()).toBe(true);
    expect(loadingWrapper.find('.ui-apex-chart__loading-bar--short').exists()).toBe(true);
    loadingWrapper.unmount();

    const emptyWrapper = mount(UiApexChart, {
      props: {
        type: 'donut',
        series: [],
        empty: true,
        emptyText: 'Nothing to display yet'
      }
    });
    await flushAsyncWork();
    expect(emptyWrapper.text()).toContain('Nothing to display yet');
    emptyWrapper.unmount();

    const zeroSeriesWrapper = mount(UiApexChart, {
      attachTo: document.body,
      props: {
        type: 'donut',
        series: [0, 0, 0]
      }
    });
    await flushAsyncWork();
    expect(zeroSeriesWrapper.find('[data-testid="mock-apex-chart"]').exists()).toBe(true);
    zeroSeriesWrapper.unmount();

    const errorWrapper = mount(UiApexChart, {
      props: {
        type: 'line',
        series: [{ name: 'Traffic', data: [1, 2] }],
        error: 'Vendor mount failed'
      }
    });
    await flushAsyncWork();
    expect(errorWrapper.text()).toContain('Vendor mount failed');
    errorWrapper.unmount();
  });

  it('renders a safe shell during server rendering', async () => {
    const html = await renderToString(
      h(UiApexChart, {
        type: 'line',
        series: [
          {
            name: 'Traffic',
            data: [4, 7, 9]
          }
        ],
        title: 'SSR safe chart'
      })
    );

    expect(html).toContain('ui-apex-chart');
    expect(html).not.toContain('mock-apex-chart');
  });

  it('supports captionless labels, custom state slots, and runtime error capture fallbacks', async () => {
    const runtimeWrapper = mount(UiApexChart, {
      attachTo: document.body,
      props: {
        ariaLabel: 'Capacity chart',
        type: 'line',
        series: [],
        loading: true
      },
      slots: {
        loading: () => h('div', { class: 'custom-loading' }, 'Loading slot')
      }
    });

    await nextTick();
    expect(runtimeWrapper.attributes('aria-label')).toBe('Capacity chart');
    expect(runtimeWrapper.find('.ui-apex-chart__overlay').exists()).toBe(true);

    runtimeWrapper.unmount();

    const emptyWrapper = mount(UiApexChart, {
      props: {
        description: 'Description only',
        type: 'line',
        series: [],
        empty: true
      },
      slots: {
        empty: '<div class="custom-empty">Empty slot</div>'
      }
    });
    await flushAsyncWork();
    expect(emptyWrapper.find('.custom-empty').exists()).toBe(true);
    expect(emptyWrapper.find('.ui-apex-chart__title').exists()).toBe(false);
    expect(emptyWrapper.find('.ui-apex-chart__description').text()).toContain('Description only');
    emptyWrapper.unmount();

    const runtimeErrorWrapper = mount(UiApexChart, {
      attachTo: document.body,
      props: {
        type: 'line',
        series: [{ name: 'Capacity', data: [1, 2, 3] }],
        options: {
          chart: {
            id: 'throw-render'
          }
        }
      }
    });
    await flushAsyncWork();
    expect(runtimeErrorWrapper.text()).toContain('Vendor render failed');
    runtimeErrorWrapper.unmount();

    const runtimeStringErrorWrapper = mount(UiApexChart, {
      attachTo: document.body,
      props: {
        type: 'line',
        series: [{ name: 'Capacity', data: [1, 2, 3] }],
        options: {
          chart: {
            id: 'throw-string'
          }
        }
      }
    });
    await flushAsyncWork();
    expect(runtimeStringErrorWrapper.text()).toContain('String render failure');
    runtimeStringErrorWrapper.unmount();

    const errorWrapper = mount(UiApexChart, {
      props: {
        type: 'line',
        series: [{ name: 'Errors', data: [1] }],
        error: new Error('Explicit error')
      },
      slots: {
        error: '<div class="custom-error">Error slot</div>'
      }
    });
    await flushAsyncWork();
    expect(errorWrapper.find('.custom-error').exists()).toBe(true);
    errorWrapper.unmount();

  });
});
