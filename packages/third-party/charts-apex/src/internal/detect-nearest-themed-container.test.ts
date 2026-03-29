import { afterEach, describe, expect, it } from 'vitest';

import { detectNearestThemedContainer, resolveApexThemeScope } from './detect-nearest-themed-container';

describe('detectNearestThemedContainer', () => {
  afterEach(() => {
    document.documentElement.removeAttribute('data-ui-theme');
    document.documentElement.removeAttribute('data-ui-theme-type');
    document.body.innerHTML = '';
  });

  it('resolves the nearest themed subtree container', () => {
    const scope = document.createElement('section');
    scope.setAttribute('data-ui-theme', 'belovodye');
    scope.setAttribute('data-ui-theme-type', 'light');
    const host = document.createElement('div');
    scope.append(host);
    document.body.append(scope);

    expect(detectNearestThemedContainer(host)).toBe(scope);
    expect(resolveApexThemeScope(host)).toEqual({
      container: scope,
      themeName: 'belovodye',
      themeType: 'light'
    });
  });

  it('falls back to the root theme scope when no subtree is present', () => {
    document.documentElement.setAttribute('data-ui-theme', 'dark');
    document.documentElement.setAttribute('data-ui-theme-type', 'dark');
    const host = document.createElement('div');
    document.body.append(host);

    expect(resolveApexThemeScope(host)).toEqual({
      container: document.documentElement,
      themeName: 'dark',
      themeType: 'dark'
    });
  });

  it('normalizes invalid metadata and handles missing document access', () => {
    const scope = document.createElement('section');
    scope.setAttribute('data-ui-theme', 'unknown-theme');
    scope.setAttribute('data-ui-theme-type', 'invalid');
    const host = document.createElement('div');
    scope.append(host);
    document.body.append(scope);

    expect(resolveApexThemeScope(host)).toEqual({
      container: scope,
      themeName: 'light',
      themeType: 'light'
    });

    const originalDocument = globalThis.document;
    // @ts-expect-error test-only override
    globalThis.document = undefined;
    expect(detectNearestThemedContainer()).toBeNull();
    // @ts-expect-error restore test-only override
    globalThis.document = originalDocument;
  });
});
