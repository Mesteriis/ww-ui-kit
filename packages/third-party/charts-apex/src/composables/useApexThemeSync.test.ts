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
              'data-ui-theme-type': 'light'
            },
            [
              h('div', {
                id: 'host',
                ref: hostRef
              })
            ]
          );
      }
    });

    const wrapper = mount(Harness, { attachTo: document.body });
    await flushThemeWork();

    const state = wrapper.vm as typeof wrapper.vm & {
      refreshThemeScope: () => void;
      themeScope: {
        container: HTMLElement | null;
        themeName: string;
        themeType: string;
        revision: number;
      };
    };

    expect(state.themeScope.container?.id).toBe('scope');
    expect(state.themeScope.themeName).toBe('belovodye');
    expect(state.themeScope.themeType).toBe('light');

    const scope = wrapper.get('#scope').element as HTMLElement;
    scope.setAttribute('data-ui-theme', 'dark');
    scope.setAttribute('data-ui-theme-type', 'dark');
    await flushThemeWork();

    expect(state.themeScope.themeName).toBe('dark');
    expect(state.themeScope.themeType).toBe('dark');
    expect(state.themeScope.revision).toBeGreaterThan(0);
  });

  it('falls back without MutationObserver or queueMicrotask and cleans up on unmount', async () => {
    const originalObserver = globalThis.MutationObserver;

    Object.defineProperty(globalThis, 'MutationObserver', {
      configurable: true,
      value: undefined
    });
    vi.stubGlobal('queueMicrotask', undefined);

    const Harness = defineComponent({
      setup(_, { expose }) {
        const hostRef = ref<HTMLElement | null>(null);
        const state = useApexThemeSync(hostRef);
        expose({ hostRef, ...state });
        return () => h('div', { ref: hostRef });
      }
    });

    const wrapper = mount(Harness, { attachTo: document.body });
    await flushThemeWork();

    const state = wrapper.vm as typeof wrapper.vm & {
      refreshThemeScope: () => void;
      themeScope: {
        container: HTMLElement | null;
        themeName: string;
        themeType: string;
      };
    };

    state.refreshThemeScope();
    await flushThemeWork();

    expect(state.themeScope.container).toBe(document.documentElement);
    expect(state.themeScope.themeName).toBe('light');
    expect(state.themeScope.themeType).toBe('light');

    wrapper.unmount();

    Object.defineProperty(globalThis, 'MutationObserver', {
      configurable: true,
      value: originalObserver
    });
  });

  it('skips scheduled refreshes after disposal and avoids duplicate microtasks', async () => {
    const queueMicrotaskSpy = vi.fn((callback: VoidFunction) => callback());
    vi.stubGlobal('queueMicrotask', queueMicrotaskSpy);

    const Harness = defineComponent({
      setup(_, { expose }) {
        const hostRef = ref<HTMLElement | null>(null);
        const state = useApexThemeSync(hostRef);
        expose({ hostRef, ...state });
        return () =>
          h('section', { 'data-ui-theme': 'light', 'data-ui-theme-type': 'light' }, [
            h('div', { ref: hostRef })
          ]);
      }
    });

    const wrapper = mount(Harness, { attachTo: document.body });
    await flushThemeWork();

    const state = wrapper.vm as typeof wrapper.vm & {
      refreshThemeScope: () => void;
    };

    state.refreshThemeScope();
    state.refreshThemeScope();
    await flushThemeWork();
    expect(queueMicrotaskSpy).toHaveBeenCalled();

    wrapper.unmount();
    state.refreshThemeScope();
    await flushThemeWork();
  });

  it('dedupes observer-triggered refresh scheduling while a microtask is already queued', async () => {
    const scheduledCallbacks: VoidFunction[] = [];
    const queueMicrotaskSpy = vi.fn((callback: VoidFunction) => {
      scheduledCallbacks.push(callback);
    });
    vi.stubGlobal('queueMicrotask', queueMicrotaskSpy);

    let observerCallback: MutationCallback | null = null;
    const disconnect = vi.fn();
    const observe = vi.fn();
    class MockMutationObserver {
      constructor(callback: MutationCallback) {
        observerCallback = callback;
      }

      disconnect = disconnect;

      observe = observe;
    }

    Object.defineProperty(globalThis, 'MutationObserver', {
      configurable: true,
      value: MockMutationObserver
    });

    const Harness = defineComponent({
      setup(_, { expose }) {
        const hostRef = ref<HTMLElement | null>(null);
        const state = useApexThemeSync(hostRef);
        expose(state);
        return () =>
          h('section', { 'data-ui-theme': 'light', 'data-ui-theme-type': 'light' }, [
            h('div', { ref: hostRef })
          ]);
      }
    });

    const wrapper = mount(Harness, { attachTo: document.body });
    await flushThemeWork();

    observerCallback?.([], {} as MutationObserver);
    observerCallback?.([], {} as MutationObserver);

    expect(queueMicrotaskSpy).toHaveBeenCalledTimes(1);

    scheduledCallbacks.shift()?.();
    await flushThemeWork();

    wrapper.unmount();
  });
});
