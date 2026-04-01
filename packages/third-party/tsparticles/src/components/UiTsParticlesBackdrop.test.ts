import { defineComponent, h, nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import { renderToString } from 'vue/server-renderer';
import { afterEach, describe, expect, it, vi } from 'vitest';

import UiTsParticlesBackdrop from './UiTsParticlesBackdrop.vue';
import { UiTsParticlesBackdrop as ExportedUiTsParticlesBackdrop } from '../index';
import * as themesModule from '@ww/themes';

const vendorMocks = vi.hoisted(() => {
  const destroy = vi.fn();
  const reset = vi.fn(async () => undefined);
  const load = vi.fn(async () => ({
    destroy,
    reset,
  }));
  const loadSlim = vi.fn(async () => undefined);

  return {
    destroy,
    reset,
    load,
    loadSlim,
  };
});

vi.mock('@tsparticles/engine', () => ({
  tsParticles: {
    load: vendorMocks.load,
  },
}));

vi.mock('@tsparticles/slim', () => ({
  loadSlim: vendorMocks.loadSlim,
}));

function createMatchMediaMock(matches: boolean, mode: 'modern' | 'legacy' = 'modern') {
  let listener: ((event: MediaQueryListEvent) => void) | null = null;
  const mediaQuery = {
    matches,
    media: '(prefers-reduced-motion: reduce)',
    addEventListener:
      mode === 'modern'
        ? vi.fn((_: string, nextListener: (event: MediaQueryListEvent) => void) => {
            listener = nextListener;
          })
        : undefined,
    removeEventListener:
      mode === 'modern'
        ? vi.fn(() => {
            listener = null;
          })
        : undefined,
    addListener:
      mode === 'legacy'
        ? vi.fn((nextListener: (event: MediaQueryListEvent) => void) => {
            listener = nextListener;
          })
        : vi.fn(),
    removeListener:
      mode === 'legacy'
        ? vi.fn(() => {
            listener = null;
          })
        : vi.fn(),
    dispatchEvent: vi.fn(),
  };

  return {
    trigger(nextMatches: boolean) {
      mediaQuery.matches = nextMatches;
      listener?.({ matches: nextMatches } as MediaQueryListEvent);
    },
    stub: vi.fn().mockImplementation(() => mediaQuery),
  };
}

async function flushAsyncWork() {
  await Promise.resolve();
  await nextTick();
  await new Promise((resolve) => window.setTimeout(resolve, 0));
  await nextTick();
}

describe('UiTsParticlesBackdrop', () => {
  afterEach(() => {
    vendorMocks.destroy.mockClear();
    vendorMocks.reset.mockClear();
    vendorMocks.load.mockClear();
    vendorMocks.loadSlim.mockClear();
    vi.unstubAllGlobals();
    document.documentElement.removeAttribute('data-ui-theme');
    document.documentElement.removeAttribute('data-ui-theme-type');
    document.documentElement.removeAttribute('style');
    document.body.removeAttribute('style');
    document.body.innerHTML = '';
  });

  it('exports the public component and mounts a neutral decorative layer behind slotted content', async () => {
    expect(ExportedUiTsParticlesBackdrop).toBe(UiTsParticlesBackdrop);

    const reducedMotion = createMatchMediaMock(false);
    vi.stubGlobal('matchMedia', reducedMotion.stub);

    const scope = document.createElement('section');
    scope.setAttribute('data-ui-theme', 'belovodye');
    scope.setAttribute('data-ui-theme-type', 'dark');
    scope.style.setProperty('--ui-border-focus', 'rgb(12, 24, 36)');
    scope.style.setProperty('--ui-border-subtle', 'rgb(48, 60, 72)');
    document.body.append(scope);

    const wrapper = mount(UiTsParticlesBackdrop, {
      attachTo: scope,
      props: {
        options: {
          fullScreen: {
            enable: true,
          },
          particles: {
            links: {
              distance: 220,
            },
            number: {
              value: 10,
            },
          },
        },
      },
      slots: {
        default: () => h('div', { class: 'proof-content' }, 'Decorative slot content'),
      },
    });

    await flushAsyncWork();

    expect(wrapper.find('.ui-tsparticles-backdrop').exists()).toBe(true);
    expect(wrapper.find('.ui-tsparticles-backdrop__layer').attributes('aria-hidden')).toBe('true');
    expect(wrapper.find('.proof-content').text()).toBe('Decorative slot content');
    expect(vendorMocks.loadSlim).toHaveBeenCalledTimes(1);
    expect(vendorMocks.load).toHaveBeenCalledTimes(1);
    expect(vendorMocks.load.mock.calls[0]?.[0]).toMatchObject({
      element: expect.any(HTMLDivElement),
      id: expect.stringContaining('tsparticles-backdrop'),
      options: {
        fullScreen: {
          enable: false,
          zIndex: 0,
        },
        particles: {
          color: {
            value: 'rgb(12, 24, 36)',
          },
          links: {
            color: 'rgb(48, 60, 72)',
            distance: 220,
          },
          number: {
            value: 10,
          },
        },
      },
    });

    wrapper.unmount();
    expect(vendorMocks.destroy).toHaveBeenCalled();
  });

  it('reacts to theme runtime changes and reduced-motion updates without exposing vendor state to consumers', async () => {
    const reducedMotion = createMatchMediaMock(true);
    vi.stubGlobal('matchMedia', reducedMotion.stub);

    const scope = document.createElement('section');
    scope.setAttribute('data-ui-theme', 'dark');
    scope.setAttribute('data-ui-theme-type', 'dark');
    scope.style.setProperty('--ui-border-focus', 'rgb(1, 2, 3)');
    scope.style.setProperty('--ui-border-subtle', 'rgb(4, 5, 6)');
    document.body.append(scope);

    const wrapper = mount(
      defineComponent({
        components: { UiTsParticlesBackdrop },
        data: () => ({
          disabled: false,
        }),
        template: `
          <UiTsParticlesBackdrop :disabled="disabled" size="fill">
            <div style="block-size: 8rem">Fill surface</div>
          </UiTsParticlesBackdrop>
        `,
      }),
      {
        attachTo: scope,
      }
    );

    await flushAsyncWork();

    expect(vendorMocks.load.mock.calls[0]?.[0]).toMatchObject({
      options: {
        particles: {
          move: {
            enable: false,
          },
        },
      },
    });

    scope.style.setProperty('--ui-border-focus', 'rgb(7, 8, 9)');
    scope.style.setProperty('--ui-border-subtle', 'rgb(10, 11, 12)');
    scope.setAttribute('data-ui-theme', 'belovodye');
    await flushAsyncWork();

    expect(vendorMocks.reset).toHaveBeenCalledWith(
      expect.objectContaining({
        particles: expect.objectContaining({
          color: {
            value: 'rgb(7, 8, 9)',
          },
          links: expect.objectContaining({
            color: 'rgb(10, 11, 12)',
          }),
        }),
      })
    );

    reducedMotion.trigger(false);
    await flushAsyncWork();

    expect(vendorMocks.reset).toHaveBeenLastCalledWith(
      expect.objectContaining({
        particles: expect.objectContaining({
          move: expect.objectContaining({
            enable: true,
          }),
        }),
      })
    );

    await wrapper.setData({ disabled: true });
    await flushAsyncWork();
    expect(vendorMocks.destroy).toHaveBeenCalled();
    wrapper.unmount();
  });

  it('supports legacy reduced-motion listeners and updates motion state when matchMedia becomes unavailable', async () => {
    const reducedMotion = createMatchMediaMock(true, 'legacy');
    vi.stubGlobal('matchMedia', reducedMotion.stub);

    const scope = document.createElement('section');
    scope.style.setProperty('--ui-border-focus', 'rgb(20, 30, 40)');
    scope.style.setProperty('--ui-border-subtle', 'rgb(50, 60, 70)');
    document.body.append(scope);

    const wrapper = mount(UiTsParticlesBackdrop, {
      attachTo: scope,
      props: {
        size: 'fill',
      },
      slots: {
        default: () => h('div', 'Legacy motion host'),
      },
    });

    await flushAsyncWork();

    expect(vendorMocks.load.mock.calls[0]?.[0]).toMatchObject({
      options: {
        particles: {
          move: {
            enable: false,
          },
        },
      },
    });
    expect(reducedMotion.stub).toHaveBeenCalledTimes(1);
    expect(reducedMotion.stub.mock.results[0]?.value.addListener).toHaveBeenCalledTimes(1);

    vi.stubGlobal('matchMedia', undefined);
    reducedMotion.trigger(false);
    await flushAsyncWork();

    expect(vendorMocks.reset).toHaveBeenLastCalledWith(
      expect.objectContaining({
        particles: expect.objectContaining({
          move: expect.objectContaining({
            enable: true,
          }),
        }),
      })
    );

    wrapper.unmount();
    expect(reducedMotion.stub.mock.results[0]?.value.removeListener).toHaveBeenCalledTimes(1);
  });

  it('prefers the resolved theme container when the theme runtime exposes one', async () => {
    const reducedMotion = createMatchMediaMock(false);
    vi.stubGlobal('matchMedia', reducedMotion.stub);

    const themeScope = document.createElement('section');
    themeScope.style.setProperty('--ui-border-focus', 'rgb(90, 91, 92)');
    themeScope.style.setProperty('--ui-border-subtle', 'rgb(80, 81, 82)');
    const host = document.createElement('div');
    themeScope.append(host);
    document.body.append(themeScope);

    const readThemeRuntimeSpy = vi.spyOn(themesModule, 'readThemeRuntime').mockImplementation(
      (source) =>
        ({
          container: source ? themeScope : null,
          themeName: 'belovodye',
          themeType: 'dark',
        }) as ReturnType<typeof themesModule.readThemeRuntime>
    );

    const wrapper = mount(UiTsParticlesBackdrop, {
      attachTo: host,
      slots: {
        default: () => h('div', 'Theme container proof'),
      },
    });

    await flushAsyncWork();

    expect(vendorMocks.load.mock.calls.at(-1)?.[0]).toMatchObject({
      options: {
        particles: {
          color: {
            value: 'rgb(90, 91, 92)',
          },
          links: {
            color: 'rgb(80, 81, 82)',
          },
        },
      },
    });

    wrapper.unmount();
    readThemeRuntimeSpy.mockRestore();
  });

  it('falls back to the host element when the theme runtime has no themed container', async () => {
    const reducedMotion = createMatchMediaMock(false);
    vi.stubGlobal('matchMedia', reducedMotion.stub);

    const host = document.createElement('div');
    host.style.setProperty('--ui-border-focus', 'rgb(15, 16, 17)');
    host.style.setProperty('--ui-border-subtle', 'rgb(25, 26, 27)');
    document.body.append(host);

    const readThemeRuntimeSpy = vi.spyOn(themesModule, 'readThemeRuntime').mockImplementation(
      () =>
        ({
          container: null,
          themeName: 'light',
          themeType: 'light',
        }) as ReturnType<typeof themesModule.readThemeRuntime>
    );

    const wrapper = mount(UiTsParticlesBackdrop, {
      attachTo: host,
      slots: {
        default: () => h('div', 'Host fallback proof'),
      },
    });

    await flushAsyncWork();

    expect(vendorMocks.load.mock.calls.at(-1)?.[0]).toMatchObject({
      options: {
        particles: {
          color: {
            value: 'rgb(15, 16, 17)',
          },
          links: {
            color: 'rgb(25, 26, 27)',
          },
        },
      },
    });

    wrapper.unmount();
    readThemeRuntimeSpy.mockRestore();
  });

  it('aborts vendor loading work when the wrapper unmounts before a delayed engine resolves', async () => {
    const reducedMotion = createMatchMediaMock(false);
    vi.stubGlobal('matchMedia', reducedMotion.stub);

    let resolveSlim: (() => void) | null = null;
    vendorMocks.loadSlim.mockImplementationOnce(
      () =>
        new Promise<void>((resolve) => {
          resolveSlim = resolve;
        })
    );

    const scope = document.createElement('section');
    scope.style.setProperty('--ui-border-focus', 'rgb(12, 12, 12)');
    scope.style.setProperty('--ui-border-subtle', 'rgb(24, 24, 24)');
    document.body.append(scope);

    vi.resetModules();
    const { default: DelayedUiTsParticlesBackdrop } = await import('./UiTsParticlesBackdrop.vue');

    const wrapper = mount(DelayedUiTsParticlesBackdrop, {
      attachTo: scope,
      slots: {
        default: () => h('div', 'Unmount before ready'),
      },
    });

    await nextTick();
    wrapper.unmount();

    resolveSlim?.();
    await flushAsyncWork();

    expect(vendorMocks.load).not.toHaveBeenCalled();
  });

  it('renders a safe shell during server rendering', async () => {
    const html = await renderToString(
      h(
        UiTsParticlesBackdrop,
        {
          size: 'fill',
        },
        {
          default: () => h('div', 'SSR proof'),
        }
      )
    );

    expect(html).toContain('ui-tsparticles-backdrop');
    expect(html).toContain('SSR proof');
    expect(html).not.toContain('<canvas');
    expect(vendorMocks.load).not.toHaveBeenCalled();
  });
});
