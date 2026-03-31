import { describe, expect, it } from 'vitest';

import { buildPlaygroundPath, parsePlaygroundRoute } from './playground-route';

describe('playground route helpers', () => {
  it('parses testing and lab routes under the playground base prefix', () => {
    expect(parsePlaygroundRoute('/playground/testing', 'fallback-surface')).toEqual({
      mode: 'testing',
    });
    expect(parsePlaygroundRoute('/playground/lab/overlay-stack', 'fallback-surface')).toEqual({
      mode: 'lab',
      surfaceId: 'overlay-stack',
    });
    expect(parsePlaygroundRoute('/playground/lab', 'fallback-surface')).toEqual({
      mode: 'lab',
      surfaceId: 'fallback-surface',
    });
  });

  it('builds routes from an explicit pathname and stays safe without window access', () => {
    expect(
      buildPlaygroundPath({ mode: 'lab', surfaceId: 'overlay-stack' }, '/playground/testing')
    ).toBe('/playground/lab/overlay-stack');
    expect(buildPlaygroundPath({ mode: 'testing' }, '/playground/lab/overlay-stack')).toBe(
      '/playground/testing'
    );

    const originalWindow = globalThis.window;

    try {
      Object.defineProperty(globalThis, 'window', {
        configurable: true,
        value: undefined,
      });

      expect(buildPlaygroundPath({ mode: 'testing' })).toBe('/testing');
      expect(buildPlaygroundPath({ mode: 'lab', surfaceId: 'fallback-surface' })).toBe(
        '/lab/fallback-surface'
      );
    } finally {
      Object.defineProperty(globalThis, 'window', {
        configurable: true,
        value: originalWindow,
      });
    }
  });
});
