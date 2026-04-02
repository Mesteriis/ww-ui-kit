import { afterEach, describe, expect, it, vi } from 'vitest';
import type * as ThemeMapsModule from './theme-maps';

import {
  THEME_ATTRIBUTE,
  THEME_DENSITY_ATTRIBUTE,
  THEME_MOTION_PROFILE_ATTRIBUTE,
  THEME_PERSONALITY_ATTRIBUTE,
  THEME_TYPE_ATTRIBUTE,
  createThemeSheet,
} from './create-theme-sheet';
import { observeThemeRuntime, patchThemeRuntime, readThemeRuntime, setTheme } from './set-theme';
import {
  THEME_CAPABILITY_MATRIX,
  THEME_DENSITIES,
  THEME_MOTION_PROFILES,
  THEME_PERSONALITIES,
  THEMES,
  THEME_NAMES,
  THEME_TYPES,
  belovodyeTheme,
  getThemeMeta,
  getThemeType,
  getThemesByType,
  isDarkTheme,
  isLightTheme,
  themeRegistry,
} from './theme-maps';

describe('themes', () => {
  afterEach(() => {
    document.documentElement.removeAttribute(THEME_ATTRIBUTE);
    document.documentElement.removeAttribute(THEME_DENSITY_ATTRIBUTE);
    document.documentElement.removeAttribute(THEME_MOTION_PROFILE_ATTRIBUTE);
    document.documentElement.removeAttribute(THEME_PERSONALITY_ATTRIBUTE);
    document.documentElement.removeAttribute(THEME_TYPE_ATTRIBUTE);
    document.body.innerHTML = '';
  });

  it('registers typed theme metadata and contracts', () => {
    expect(THEME_TYPES).toEqual(['light', 'dark']);
    expect(THEME_NAMES).toEqual(expect.arrayContaining(['light', 'dark', 'belovodye']));
    expect(THEMES.belovodye).toMatchObject({
      name: 'belovodye',
      label: 'Belovodye',
      type: 'dark',
    });
    expect(themeRegistry.belovodye).toBe(belovodyeTheme);
  });

  it('resolves theme helpers from the canonical registry', () => {
    expect(getThemeMeta('dark')).toEqual({
      name: 'dark',
      label: 'Dark',
      type: 'dark',
    });
    expect(getThemeType('belovodye')).toBe('dark');
    expect(getThemesByType('light').map(({ name }) => name)).toEqual(
      expect.arrayContaining(['light'])
    );
    expect(getThemesByType('dark').map(({ name }) => name)).toEqual(
      expect.arrayContaining(['dark', 'belovodye'])
    );
    expect(isLightTheme('light')).toBe(true);
    expect(isLightTheme('dark')).toBe(false);
    expect(isLightTheme('belovodye')).toBe(false);
    expect(isDarkTheme('dark')).toBe(true);
    expect(isDarkTheme('belovodye')).toBe(true);
  });

  it('sets theme name and type on the document element by default without inline color-scheme drift', () => {
    const target = setTheme('belovodye');

    expect(target).toBe(document.documentElement);
    expect(document.documentElement.getAttribute(THEME_ATTRIBUTE)).toBe('belovodye');
    expect(document.documentElement.getAttribute(THEME_TYPE_ATTRIBUTE)).toBe('dark');
    expect(document.documentElement.style.colorScheme).toBe('');
  });

  it('sets theme name and type on an explicit subtree container without inline color-scheme drift', () => {
    const container = document.createElement('section');
    document.body.append(container);

    const target = setTheme('dark', container);

    expect(target).toBe(container);
    expect(container.getAttribute(THEME_ATTRIBUTE)).toBe('dark');
    expect(container.getAttribute(THEME_TYPE_ATTRIBUTE)).toBe('dark');
    expect(container.style.colorScheme).toBe('');
    expect(document.documentElement.hasAttribute(THEME_ATTRIBUTE)).toBe(false);
  });

  it('reads and patches the runtime theme capability state without introducing invalid type combinations', () => {
    const container = document.createElement('section');
    document.body.append(container);

    setTheme('belovodye', container);
    patchThemeRuntime(
      {
        density: 'compact',
        motionProfile: 'expressive',
        personality: 'accented',
      },
      container
    );

    expect(container.getAttribute(THEME_ATTRIBUTE)).toBe('belovodye');
    expect(container.getAttribute(THEME_TYPE_ATTRIBUTE)).toBe('dark');
    expect(container.getAttribute(THEME_DENSITY_ATTRIBUTE)).toBe('compact');
    expect(container.getAttribute(THEME_MOTION_PROFILE_ATTRIBUTE)).toBe('expressive');
    expect(container.getAttribute(THEME_PERSONALITY_ATTRIBUTE)).toBe('accented');
    expect(readThemeRuntime(container)).toMatchObject({
      density: 'compact',
      motionProfile: 'expressive',
      personality: 'accented',
      themeName: 'belovodye',
      themeType: 'dark',
    });

    patchThemeRuntime({ themeName: 'dark' }, container);
    expect(container.getAttribute(THEME_ATTRIBUTE)).toBe('dark');
    expect(container.getAttribute(THEME_TYPE_ATTRIBUTE)).toBe('dark');
    expect(readThemeRuntime(container).themeType).toBe('dark');
  });

  it('reads direct runtime attributes from the source element and removes default capability attributes', () => {
    const container = document.createElement('section');
    document.body.append(container);

    patchThemeRuntime({ themeName: 'dark' }, container);

    expect(readThemeRuntime(container)).toMatchObject({
      container,
      density: 'default',
      motionProfile: 'balanced',
      personality: 'neutral',
      themeName: 'dark',
      themeType: 'dark',
    });
    expect(container.hasAttribute(THEME_DENSITY_ATTRIBUTE)).toBe(false);
    expect(container.hasAttribute(THEME_MOTION_PROFILE_ATTRIBUTE)).toBe(false);
    expect(container.hasAttribute(THEME_PERSONALITY_ATTRIBUTE)).toBe(false);
  });

  it('observes runtime theme changes through the DOM-backed runtime contract', async () => {
    const listener = vi.fn();
    const host = document.createElement('div');
    document.body.append(host);

    const stop = observeThemeRuntime(host, listener);
    patchThemeRuntime({ themeName: 'dark', density: 'comfortable' }, document.documentElement);
    await Promise.resolve();
    await Promise.resolve();

    expect(listener).toHaveBeenCalled();
    expect(listener.mock.calls.at(-1)?.[0]).toMatchObject({
      density: 'comfortable',
      themeName: 'dark',
      themeType: 'dark',
    });

    stop();
  });

  it('observes runtime state without document access and coalesces queued DOM mutations', async () => {
    const originalDocument = globalThis.document;
    const originalMutationObserver = globalThis.MutationObserver;
    const originalQueueMicrotask = globalThis.queueMicrotask;
    const listener = vi.fn();

    try {
      Object.defineProperty(globalThis, 'document', {
        configurable: true,
        value: undefined,
      });

      const stopWithoutDocument = observeThemeRuntime(null, listener);
      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({
          container: null,
          themeName: 'light',
          themeType: 'light',
        })
      );
      stopWithoutDocument();

      Object.defineProperty(globalThis, 'document', {
        configurable: true,
        value: originalDocument,
      });

      const callbacks: MutationCallback[] = [];
      class MockMutationObserver {
        constructor(callback: MutationCallback) {
          callbacks.push(callback);
        }

        disconnect() {}

        observe() {}
      }

      Object.defineProperty(globalThis, 'MutationObserver', {
        configurable: true,
        value: MockMutationObserver,
      });
      Object.defineProperty(globalThis, 'queueMicrotask', {
        configurable: true,
        value: undefined,
      });

      const host = document.createElement('div');
      document.body.append(host);
      listener.mockClear();

      const stop = observeThemeRuntime(host, listener);
      patchThemeRuntime({ themeName: 'dark' }, document.documentElement);
      callbacks[0]?.([], {} as MutationObserver);
      callbacks[0]?.([], {} as MutationObserver);
      await Promise.resolve();

      expect(listener).toHaveBeenCalledTimes(2);
      expect(listener.mock.calls.at(-1)?.[0]).toMatchObject({
        themeName: 'dark',
        themeType: 'dark',
      });

      stop();
    } finally {
      Object.defineProperty(globalThis, 'document', {
        configurable: true,
        value: originalDocument,
      });
      Object.defineProperty(globalThis, 'MutationObserver', {
        configurable: true,
        value: originalMutationObserver,
      });
      Object.defineProperty(globalThis, 'queueMicrotask', {
        configurable: true,
        value: originalQueueMicrotask,
      });
    }
  });

  it('returns null without a document target and generates the root selector for the light theme', () => {
    const lightSheet = createThemeSheet('light', THEMES.light.tokens);
    const originalDocument = globalThis.document;

    expect(lightSheet).toContain(':root,');
    expect(lightSheet).toContain('[data-ui-theme="light"]');
    expect(lightSheet).toContain('--ui-button-info-solid-bg: var(--ui-brand-600);');
    expect(lightSheet).toContain('--ui-button-success-solid-bg: var(--ui-success-700);');

    Object.defineProperty(globalThis, 'document', {
      configurable: true,
      value: undefined,
    });
    expect(setTheme('light')).toBeNull();
    Object.defineProperty(globalThis, 'document', {
      configurable: true,
      value: originalDocument,
    });
  });

  it('generates a public sheet for belovodye selectors and tokens', () => {
    const sheet = createThemeSheet('belovodye', belovodyeTheme);

    expect(sheet).toContain('[data-ui-theme="belovodye"]');
    expect(sheet).toContain('[data-ui-theme="belovodye"] body');
    expect(sheet).toContain('[data-ui-theme="belovodye"][data-ui-density="compact"]');
    expect(sheet).toContain('[data-ui-theme="belovodye"][data-ui-motion-profile="expressive"]');
    expect(sheet).toContain('[data-ui-theme="belovodye"][data-ui-personality="accented"]');
    expect(sheet).toContain('@media (min-width: 48rem)');
    expect(sheet).toContain('background-image:');
    expect(sheet).toContain('--ui-overlay-backdrop');
    expect(sheet).toContain('--ui-brand-500: #2dd4bf;');
    expect(sheet).toContain('--ui-button-brand-solid-bg: var(--ui-brand-400);');
    expect(sheet).toContain('--ui-button-info-solid-bg: var(--ui-brand-300);');
    expect(sheet).toContain(
      '--ui-z-layer-dropdown: calc(var(--ui-z-overlay-base) - var(--ui-z-overlay-step));'
    );
  });

  it('omits empty selector and responsive override blocks from generated theme sheets', async () => {
    vi.resetModules();
    vi.doMock('./theme-maps', async () => {
      const actual = (await vi.importActual('./theme-maps')) as typeof ThemeMapsModule;
      return {
        ...actual,
        baseThemeTokens: {},
        getThemeCapabilityOverrides: () => ({
          density: {},
          motionProfile: {},
          personality: {},
          responsive: { md: {}, lg: {} },
        }),
      };
    });

    const sheetModule = await import('./create-theme-sheet');
    expect(sheetModule.createThemeSheet('dark', {} as never)).toBe('');

    vi.doUnmock('./theme-maps');
    vi.resetModules();
  });

  it('exposes a transparent capability matrix for runtime, typography, motion, and responsive theme contracts', () => {
    expect(THEME_DENSITIES).toEqual(['compact', 'default', 'comfortable']);
    expect(THEME_MOTION_PROFILES).toEqual(['calm', 'balanced', 'expressive']);
    expect(THEME_PERSONALITIES).toEqual(['neutral', 'accented']);
    expect(THEME_CAPABILITY_MATRIX.foundations).toContain('surface-default');
    expect(THEME_CAPABILITY_MATRIX.systems).toContain('graph-node-surface');
    expect(THEME_CAPABILITY_MATRIX.personality).toContain('dialog-border');
    expect(THEME_CAPABILITY_MATRIX.motion).toContain('motion-collapse-opacity-duration-factor');
    expect(THEME_CAPABILITY_MATRIX.runtime.writableAttributes).toEqual(
      expect.arrayContaining([
        'data-ui-theme',
        'data-ui-density',
        'data-ui-motion-profile',
        'data-ui-personality',
      ])
    );
  });
});
