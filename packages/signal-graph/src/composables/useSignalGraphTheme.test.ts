import { defineComponent, h, nextTick, ref } from 'vue';
import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { useSignalGraphTheme } from './useSignalGraphTheme';

const flushThemeWork = async () => {
  await Promise.resolve();
  await nextTick();
};

describe('useSignalGraphTheme', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    document.body.innerHTML = '';
    document.documentElement.removeAttribute('data-ui-theme');
    document.documentElement.removeAttribute('data-ui-theme-type');
  });

  it('tracks scoped theme containers and revisions', async () => {
    const Harness = defineComponent({
      setup(_, { expose }) {
        const hostRef = ref<HTMLElement | null>(null);
        const state = useSignalGraphTheme(hostRef);
        expose({ hostRef, ...state });
        return () =>
          h(
            'section',
            {
              id: 'scope',
              'data-ui-theme': 'belovodye',
              'data-ui-theme-type': 'light',
            },
            [h('div', { id: 'host', ref: hostRef })]
          );
      },
    });

    const wrapper = mount(Harness, { attachTo: document.body });
    await flushThemeWork();

    const state = wrapper.vm as typeof wrapper.vm & {
      themeState: {
        container: HTMLElement | null;
        themeName: string;
        themeType: string;
        revision: number;
      };
    };

    expect(state.themeState.container?.id).toBe('scope');
    expect(state.themeState.themeName).toBe('belovodye');
    expect(state.themeState.themeType).toBe('light');

    const scope = wrapper.get('#scope').element as HTMLElement;
    scope.setAttribute('data-ui-theme', 'dark');
    scope.setAttribute('data-ui-theme-type', 'dark');
    await flushThemeWork();

    expect(state.themeState.themeName).toBe('dark');
    expect(state.themeState.themeType).toBe('dark');
    expect(state.themeState.revision).toBeGreaterThan(0);
  });

  it('falls back for invalid metadata and missing observers', async () => {
    const originalObserver = globalThis.MutationObserver;
    Object.defineProperty(globalThis, 'MutationObserver', {
      configurable: true,
      value: undefined,
    });

    const Harness = defineComponent({
      setup(_, { expose }) {
        const hostRef = ref<HTMLElement | null>(null);
        const state = useSignalGraphTheme(hostRef);
        expose({ hostRef, ...state });
        return () =>
          h(
            'section',
            {
              id: 'scope',
              'data-ui-theme': '',
              'data-ui-theme-type': 'invalid',
            },
            [h('div', { ref: hostRef })]
          );
      },
    });

    const wrapper = mount(Harness, { attachTo: document.body });
    await flushThemeWork();

    const state = wrapper.vm as typeof wrapper.vm & {
      themeState: {
        themeName: string;
        themeType: string;
      };
    };

    expect(state.themeState.themeName).toBe('light');
    expect(state.themeState.themeType).toBe('light');

    wrapper.unmount();
    Object.defineProperty(globalThis, 'MutationObserver', {
      configurable: true,
      value: originalObserver,
    });
  });

  it('does not recreate the mutation observer while the host stays in the same themed container', async () => {
    let observerCallback: MutationCallback | null = null;
    const observe = vi.fn();
    const disconnect = vi.fn();
    const observerInstances: MockMutationObserver[] = [];

    class MockMutationObserver {
      callback: MutationCallback;

      constructor(callback: MutationCallback) {
        this.callback = callback;
        observerCallback = callback;
        observerInstances.push(this);
      }

      disconnect = disconnect;

      observe = observe;
    }

    Object.defineProperty(globalThis, 'MutationObserver', {
      configurable: true,
      value: MockMutationObserver,
    });

    const Harness = defineComponent({
      setup(_, { expose }) {
        const hostRef = ref<HTMLElement | null>(null);
        const state = useSignalGraphTheme(hostRef);
        expose(state);
        return () =>
          h(
            'section',
            {
              id: 'scope',
              'data-ui-theme': 'light',
              'data-ui-theme-type': 'light',
            },
            [h('div', { ref: hostRef })]
          );
      },
    });

    const wrapper = mount(Harness, { attachTo: document.body });
    await flushThemeWork();

    expect(observerInstances).toHaveLength(1);
    expect(observe).toHaveBeenCalledTimes(2);

    const scope = wrapper.get('#scope').element as HTMLElement;
    scope.setAttribute('data-ui-theme', 'dark');
    scope.setAttribute('data-ui-theme-type', 'dark');
    observerCallback?.([], {} as MutationObserver);
    await flushThemeWork();

    expect(observerInstances).toHaveLength(1);

    wrapper.unmount();
  });
});
