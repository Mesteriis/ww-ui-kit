import { defineComponent, h, nextTick, ref } from 'vue';
import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { useApexThemeSync } from './useApexThemeSync';

const flushThemeWork = async () => {
  await Promise.resolve();
  await nextTick();
};

describe('useApexThemeSync', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    document.body.innerHTML = '';
    document.documentElement.removeAttribute('data-ui-theme');
    document.documentElement.removeAttribute('data-ui-theme-type');
  });

  it('tracks nearest theme scope changes and increments revisions', async () => {
    const Harness = defineComponent({
      setup(_, { expose }) {
        const hostRef = ref<HTMLElement | null>(null);
        const state = useApexThemeSync(hostRef);
        expose({ hostRef, ...state });
        return () =>
          h(
            'section',
            {
              id: 'scope',
              'data-ui-theme': 'belovodye',
              'data-ui-theme-type': 'dark',
            },
            [h('div', { id: 'host', ref: hostRef })]
          );
      },
    });

    const wrapper = mount(Harness, { attachTo: document.body });
    await flushThemeWork();

    const state = wrapper.vm as typeof wrapper.vm & {
      themeScope: {
        container: HTMLElement | null;
        themeName: string;
        themeType: string;
        revision: number;
      };
    };

    expect(state.themeScope.container?.id).toBe('scope');
    expect(state.themeScope.themeName).toBe('belovodye');
    expect(state.themeScope.themeType).toBe('dark');

    const scope = wrapper.get('#scope').element as HTMLElement;
    scope.setAttribute('data-ui-theme', 'dark');
    scope.setAttribute('data-ui-theme-type', 'dark');
    await flushThemeWork();

    expect(state.themeScope.themeName).toBe('dark');
    expect(state.themeScope.themeType).toBe('dark');
    expect(state.themeScope.revision).toBeGreaterThan(0);
  });

  it('falls back without MutationObserver and keeps the root theme scope', async () => {
    const originalObserver = globalThis.MutationObserver;
    Object.defineProperty(globalThis, 'MutationObserver', {
      configurable: true,
      value: undefined,
    });

    const Harness = defineComponent({
      setup(_, { expose }) {
        const hostRef = ref<HTMLElement | null>(null);
        const state = useApexThemeSync(hostRef);
        expose({ hostRef, ...state });
        return () => h('div', { ref: hostRef });
      },
    });

    const wrapper = mount(Harness, { attachTo: document.body });
    await flushThemeWork();

    const state = wrapper.vm as typeof wrapper.vm & {
      themeScope: {
        container: HTMLElement | null;
        themeName: string;
        themeType: string;
      };
    };

    expect(state.themeScope.container).toBe(document.documentElement);
    expect(state.themeScope.themeName).toBe('light');
    expect(state.themeScope.themeType).toBe('light');

    wrapper.unmount();
    Object.defineProperty(globalThis, 'MutationObserver', {
      configurable: true,
      value: originalObserver,
    });
  });

  it('keeps one observer instance while the host stays under the same themed container', async () => {
    let observerCallback: MutationCallback | null = null;
    const observe = vi.fn();
    const observerInstances: MockMutationObserver[] = [];

    class MockMutationObserver {
      constructor(callback: MutationCallback) {
        observerCallback = callback;
        observerInstances.push(this);
      }

      disconnect() {}

      observe = observe;
    }

    Object.defineProperty(globalThis, 'MutationObserver', {
      configurable: true,
      value: MockMutationObserver,
    });

    const Harness = defineComponent({
      setup(_, { expose }) {
        const hostRef = ref<HTMLElement | null>(null);
        const state = useApexThemeSync(hostRef);
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
