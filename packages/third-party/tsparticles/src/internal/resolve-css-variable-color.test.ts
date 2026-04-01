import { afterEach, describe, expect, it, vi } from 'vitest';

import { resolveCssVariableColor } from './resolve-css-variable-color';

describe('resolveCssVariableColor', () => {
  afterEach(() => {
    document.documentElement.removeAttribute('data-ui-theme');
    document.documentElement.removeAttribute('style');
    document.body.removeAttribute('style');
    document.body.innerHTML = '';
  });

  it('resolves scoped theme variables against the provided source element', () => {
    const scope = document.createElement('section');
    scope.style.setProperty('--ui-border-focus', 'rgb(1, 2, 3)');
    const host = document.createElement('div');
    scope.append(host);
    document.body.append(scope);

    expect(
      resolveCssVariableColor({
        variableName: '--ui-border-focus',
        source: host,
        fallbackExpression: 'currentColor',
      })
    ).toBe('rgb(1, 2, 3)');
  });

  it('falls back cleanly when the variable is not defined', () => {
    document.body.style.color = 'rgb(9, 8, 7)';

    expect(
      resolveCssVariableColor({
        variableName: '--ui-border-subtle',
        source: document.documentElement,
        fallbackExpression: 'currentColor',
      })
    ).toBe('rgb(9, 8, 7)');
  });

  it('returns a non-currentColor fallback when the probe resolves the fallback directly', () => {
    expect(
      resolveCssVariableColor({
        variableName: '--ui-border-subtle',
        source: document.documentElement,
        fallbackExpression: 'rgb(11, 12, 13)',
      })
    ).toBe('rgb(11, 12, 13)');
  });

  it('returns the fallback expression when DOM globals are unavailable', () => {
    vi.stubGlobal('document', undefined);
    vi.stubGlobal('window', undefined);

    expect(
      resolveCssVariableColor({
        variableName: '--ui-border-focus',
        fallbackExpression: 'var(--ui-text-primary)',
      })
    ).toBe('var(--ui-text-primary)');

    vi.unstubAllGlobals();
  });

  it('uses the direct scoped value when the probe cannot resolve a CSS variable expression', () => {
    const scope = document.createElement('section');
    scope.style.setProperty('--ui-border-subtle', 'rgb(6, 7, 8)');
    document.body.append(scope);

    let scopeReads = 0;
    const originalGetComputedStyle = window.getComputedStyle.bind(window);
    const getComputedStyleSpy = vi
      .spyOn(window, 'getComputedStyle')
      .mockImplementation((element: Element) => {
        if (element === scope) {
          scopeReads += 1;
          return {
            ...originalGetComputedStyle(element),
            color: 'var(--ui-border-subtle)',
            getPropertyValue: (propertyName: string) => {
              if (propertyName !== '--ui-border-subtle') {
                return '';
              }

              return scopeReads === 1 ? 'var(--ui-border-subtle)' : 'rgb(6, 7, 8)';
            },
          } as CSSStyleDeclaration;
        }

        if (element instanceof HTMLSpanElement) {
          return {
            ...originalGetComputedStyle(element),
            color: 'var(--ui-border-subtle)',
            getPropertyValue: () => '',
          } as CSSStyleDeclaration;
        }

        return originalGetComputedStyle(element);
      });

    expect(
      resolveCssVariableColor({
        variableName: '--ui-border-subtle',
        source: scope,
        fallbackExpression: 'rgb(1, 1, 1)',
      })
    ).toBe('rgb(6, 7, 8)');

    getComputedStyleSpy.mockRestore();
  });

  it('uses the document element as the probe host when document.body is unavailable', () => {
    const originalBody = document.body;

    try {
      Object.defineProperty(document, 'body', {
        configurable: true,
        value: null,
      });

      expect(
        resolveCssVariableColor({
          variableName: '--ui-border-focus',
          source: document.documentElement,
          fallbackExpression: 'rgb(21, 22, 23)',
        })
      ).toBe('rgb(21, 22, 23)');
    } finally {
      Object.defineProperty(document, 'body', {
        configurable: true,
        value: originalBody,
      });
    }
  });

  it('returns the resolved probe color when the decorative fallback resolves cleanly', () => {
    const scope = document.createElement('section');
    document.body.append(scope);

    const originalGetComputedStyle = window.getComputedStyle.bind(window);
    const getComputedStyleSpy = vi
      .spyOn(window, 'getComputedStyle')
      .mockImplementation((element: Element) => {
        if (element === scope) {
          return {
            ...originalGetComputedStyle(element),
            color: '',
            getPropertyValue: () => '',
          } as CSSStyleDeclaration;
        }

        if (element instanceof HTMLSpanElement) {
          return {
            ...originalGetComputedStyle(element),
            color: 'rgb(31, 32, 33)',
            getPropertyValue: () => '',
          } as CSSStyleDeclaration;
        }

        return originalGetComputedStyle(element);
      });

    expect(
      resolveCssVariableColor({
        variableName: '--ui-border-focus',
        source: scope,
        fallbackExpression: 'rgb(1, 2, 3)',
      })
    ).toBe('rgb(31, 32, 33)');

    getComputedStyleSpy.mockRestore();
  });

  it('returns the non-currentColor fallback when the probe resolves to an empty color', () => {
    const scope = document.createElement('section');
    document.body.append(scope);

    const originalGetComputedStyle = window.getComputedStyle.bind(window);
    const getComputedStyleSpy = vi
      .spyOn(window, 'getComputedStyle')
      .mockImplementation((element: Element) => {
        if (element === scope || element instanceof HTMLSpanElement) {
          return {
            ...originalGetComputedStyle(element),
            color: '',
            getPropertyValue: () => '',
          } as CSSStyleDeclaration;
        }

        return originalGetComputedStyle(element);
      });

    expect(
      resolveCssVariableColor({
        variableName: '--ui-border-focus',
        source: scope,
        fallbackExpression: 'rgb(41, 42, 43)',
      })
    ).toBe('rgb(41, 42, 43)');

    getComputedStyleSpy.mockRestore();
  });

  it('returns the currentColor fallback expression when the probe host has no computed color', () => {
    const originalGetComputedStyle = window.getComputedStyle.bind(window);
    const getComputedStyleSpy = vi
      .spyOn(window, 'getComputedStyle')
      .mockImplementation((element: Element) => {
        if (element === document.documentElement || element instanceof HTMLSpanElement) {
          return {
            ...originalGetComputedStyle(element),
            color: '',
            getPropertyValue: () => '',
          } as CSSStyleDeclaration;
        }

        if (element === document.body) {
          return {
            ...originalGetComputedStyle(element),
            color: '',
            getPropertyValue: () => '',
          } as CSSStyleDeclaration;
        }

        return originalGetComputedStyle(element);
      });

    expect(
      resolveCssVariableColor({
        variableName: '--ui-border-subtle',
        source: document.documentElement,
        fallbackExpression: 'currentColor',
      })
    ).toBe('currentColor');

    getComputedStyleSpy.mockRestore();
  });
});
