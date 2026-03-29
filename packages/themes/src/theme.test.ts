import { afterEach, describe, expect, it } from 'vitest';

import { THEME_ATTRIBUTE, THEME_TYPE_ATTRIBUTE, createThemeSheet } from './create-theme-sheet';
import { setTheme } from './set-theme';
import {
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
    document.documentElement.removeAttribute(THEME_TYPE_ATTRIBUTE);
    document.body.innerHTML = '';
  });

  it('registers typed theme metadata and contracts', () => {
    expect(THEME_TYPES).toEqual(['light', 'dark']);
    expect(THEME_NAMES).toEqual(expect.arrayContaining(['light', 'dark', 'belovodye']));
    expect(THEMES.belovodye).toMatchObject({
      name: 'belovodye',
      label: 'Belovodye',
      type: 'light',
    });
    expect(themeRegistry.belovodye).toBe(belovodyeTheme);
  });

  it('resolves theme helpers from the canonical registry', () => {
    expect(getThemeMeta('dark')).toEqual({
      name: 'dark',
      label: 'Dark',
      type: 'dark',
    });
    expect(getThemeType('belovodye')).toBe('light');
    expect(getThemesByType('light').map(({ name }) => name)).toEqual(
      expect.arrayContaining(['light', 'belovodye'])
    );
    expect(getThemesByType('dark').map(({ name }) => name)).toEqual(['dark']);
    expect(isLightTheme('light')).toBe(true);
    expect(isLightTheme('dark')).toBe(false);
    expect(isDarkTheme('dark')).toBe(true);
    expect(isDarkTheme('belovodye')).toBe(false);
  });

  it('sets theme name and type on the document element by default without inline color-scheme drift', () => {
    const target = setTheme('belovodye');

    expect(target).toBe(document.documentElement);
    expect(document.documentElement.getAttribute(THEME_ATTRIBUTE)).toBe('belovodye');
    expect(document.documentElement.getAttribute(THEME_TYPE_ATTRIBUTE)).toBe('light');
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
    expect(sheet).toContain('--ui-overlay-backdrop');
    expect(sheet).toContain('--ui-brand-500: #169fe8;');
    expect(sheet).toContain('--ui-button-brand-solid-bg: var(--ui-brand-700);');
    expect(sheet).toContain('--ui-button-info-solid-bg: var(--ui-brand-700);');
    expect(sheet).toContain(
      '--ui-z-layer-dropdown: calc(var(--ui-z-overlay-base) + var(--ui-z-overlay-slot-floating));'
    );
  });
});
