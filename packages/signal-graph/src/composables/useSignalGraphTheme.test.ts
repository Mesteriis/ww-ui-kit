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
    // @ts-expect-error test-only override
    globalThis.MutationObserver = undefined;
    vi.stubGlobal('queueMicrotask', undefined);

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
      refreshThemeState: () => void;
      themeState: {
        themeName: string;
        themeType: string;
      };
    };

    state.refreshThemeState();
    await flushThemeWork();

    expect(state.themeState.themeName).toBe('light');
    expect(state.themeState.themeType).toBe('light');

    wrapper.unmount();
    globalThis.MutationObserver = originalObserver;
  });

  it('dedupes scheduled theme refreshes when queueMicrotask is unavailable', async () => {
    vi.stubGlobal('queueMicrotask', undefined);

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

    const state = wrapper.vm as typeof wrapper.vm & {
      themeState: {
        revision: number;
      };
    };

    const scope = wrapper.get('#scope').element as HTMLElement;
    scope.setAttribute('data-ui-theme', 'dark');
    scope.setAttribute('data-ui-theme-type', 'dark');
    scope.style.setProperty('--ui-surface-default', '#111827');
    await Promise.resolve();
    await Promise.resolve();
    await nextTick();

    expect(state.themeState.revision).toBeGreaterThan(0);

    wrapper.unmount();
  });

  it('dedupes observer-triggered refreshes while a queueMicrotask callback is pending', async () => {
    const scheduledCallbacks: VoidFunction[] = [];
    vi.stubGlobal('queueMicrotask', (callback: VoidFunction) => {
      scheduledCallbacks.push(callback);
    });

    let observerCallback: MutationCallback | null = null;
    class MockMutationObserver {
      constructor(callback: MutationCallback) {
        observerCallback = callback;
      }

      disconnect() {}

      observe() {}
    }

    const originalObserver = globalThis.MutationObserver;
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

    observerCallback?.([], {} as MutationObserver);
    observerCallback?.([], {} as MutationObserver);
    expect(scheduledCallbacks).toHaveLength(1);

    scheduledCallbacks.shift()?.();
    await flushThemeWork();

    wrapper.unmount();
    Object.defineProperty(globalThis, 'MutationObserver', {
      configurable: true,
      value: originalObserver,
    });
  });
});
