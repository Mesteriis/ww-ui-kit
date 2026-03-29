import { defineComponent, h, nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';

const flushAsyncWork = async () => {
  await Promise.resolve();
  await nextTick();
  await new Promise((resolve) => window.setTimeout(resolve, 0));
  await nextTick();
};

async function importUseApexClientOnly() {
  const module = await import('./useApexClientOnly');
  return module.useApexClientOnly;
}

describe('useApexClientOnly', () => {
  afterEach(() => {
    vi.resetModules();
    vi.doUnmock('vue3-apexcharts');
    document.body.innerHTML = '';
  });

  it('loads and caches the vendor component on mount', async () => {
    vi.doMock('vue3-apexcharts', () => ({
      default: defineComponent({
        name: 'MockApexVendor',
        render() {
          return h('div', 'vendor');
        },
      }),
    }));

    const useApexClientOnly = await importUseApexClientOnly();

    const Harness = defineComponent({
      setup(_, { expose }) {
        const state = useApexClientOnly();
        expose(state);
        return () => h('div');
      },
    });

    const first = mount(Harness);
    await flushAsyncWork();

    const firstState = first.vm as typeof first.vm & {
      apexComponent: unknown;
      clientReady: { value?: boolean };
      vendorError: Error | null;
    };

    expect(firstState.clientReady).toBe(true);
    expect(firstState.apexComponent).toBeTruthy();
    expect(firstState.vendorError).toBeNull();

    const second = mount(Harness);
    await flushAsyncWork();

    const secondState = second.vm as typeof second.vm & {
      apexComponent: unknown;
      vendorError: Error | null;
    };

    expect(secondState.apexComponent).toBe(firstState.apexComponent);
    expect(secondState.vendorError).toBeNull();
  });

  it('normalizes vendor loading failures without crashing the host component', async () => {
    vi.doMock('vue3-apexcharts', () => {
      throw { reason: 'broken' };
    });

    const useApexClientOnly = await importUseApexClientOnly();

    const Harness = defineComponent({
      setup(_, { expose }) {
        const state = useApexClientOnly();
        expose(state);
        return () => h('div');
      },
    });

    const wrapper = mount(Harness);
    await flushAsyncWork();

    const state = wrapper.vm as typeof wrapper.vm & {
      apexComponent: unknown;
      clientReady: boolean;
      vendorError: Error | null;
    };

    expect(state.clientReady).toBe(true);
    expect(state.apexComponent).toBeNull();
    expect(state.vendorError).toBeInstanceOf(Error);
    expect(state.vendorError?.message.length).toBeGreaterThan(0);
  });

  it('keeps client-only state stable when the vendor import path fails again', async () => {
    vi.doMock('vue3-apexcharts', () => {
      throw { reason: 'still broken' };
    });

    const useApexClientOnly = await importUseApexClientOnly();

    const Harness = defineComponent({
      setup(_, { expose }) {
        const state = useApexClientOnly();
        expose(state);
        return () => h('div');
      },
    });

    const wrapper = mount(Harness);
    await flushAsyncWork();

    const state = wrapper.vm as typeof wrapper.vm & {
      apexComponent: unknown;
      clientReady: boolean;
      vendorError: Error | null;
    };

    expect(state.clientReady).toBe(true);
    expect(state.apexComponent).toBeNull();
    expect(state.vendorError).toBeInstanceOf(Error);
    expect(state.vendorError?.message.length).toBeGreaterThan(0);
  });

  it('preserves Error instances thrown by the vendor import path', async () => {
    vi.doMock('vue3-apexcharts', () => ({
      get default() {
        throw new Error('vendor exploded');
      },
    }));

    const useApexClientOnly = await importUseApexClientOnly();

    const Harness = defineComponent({
      setup(_, { expose }) {
        const state = useApexClientOnly();
        expose(state);
        return () => h('div');
      },
    });

    const wrapper = mount(Harness);
    await flushAsyncWork();

    const state = wrapper.vm as typeof wrapper.vm & {
      vendorError: Error | null;
    };

    expect(state.vendorError).toBeInstanceOf(Error);
    expect(state.vendorError?.message).toBe('vendor exploded');
  });

  it('normalizes non-Error getter failures from the vendor module', async () => {
    vi.doMock('vue3-apexcharts', () => ({
      get default() {
        throw 'vendor exploded';
      },
    }));

    const useApexClientOnly = await importUseApexClientOnly();

    const Harness = defineComponent({
      setup(_, { expose }) {
        const state = useApexClientOnly();
        expose(state);
        return () => h('div');
      },
    });

    const wrapper = mount(Harness);
    await flushAsyncWork();

    const state = wrapper.vm as typeof wrapper.vm & {
      vendorError: Error | null;
    };

    expect(state.vendorError).toBeInstanceOf(Error);
    expect(state.vendorError?.message).toBe('Failed to load ApexCharts.');
  });

  it('reuses an in-flight vendor import promise across concurrent mounts', async () => {
    let resolveVendor!: (value: { default: ReturnType<typeof defineComponent> }) => void;
    const pendingVendorModule = new Promise<{ default: ReturnType<typeof defineComponent> }>(
      (resolve) => {
        resolveVendor = resolve;
      }
    );

    vi.doMock('vue3-apexcharts', () => pendingVendorModule);

    const useApexClientOnly = await importUseApexClientOnly();

    const Harness = defineComponent({
      setup(_, { expose }) {
        const state = useApexClientOnly();
        expose(state);
        return () => h('div');
      },
    });

    const first = mount(Harness);
    const second = mount(Harness);

    resolveVendor({
      default: defineComponent({
        name: 'ConcurrentVendor',
        render() {
          return h('div', 'vendor');
        },
      }),
    });

    await flushAsyncWork();

    const firstState = first.vm as typeof first.vm & {
      apexComponent: unknown;
    };
    const secondState = second.vm as typeof second.vm & {
      apexComponent: unknown;
    };

    expect(firstState.apexComponent).toBeTruthy();
    expect(secondState.apexComponent).toBe(firstState.apexComponent);
  });
});
