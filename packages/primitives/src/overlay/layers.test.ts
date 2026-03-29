import { afterEach, describe, expect, it } from 'vitest';

import { readOverlayLayerScale, resolveOverlayLayerSlots } from './layers';

describe('overlay layers', () => {
  afterEach(() => {
    document.documentElement.removeAttribute('style');
  });

  it('reads the configured layer scale from css variables', () => {
    document.documentElement.style.setProperty('--ui-z-overlay-base', '5000');
    document.documentElement.style.setProperty('--ui-z-overlay-step', '30');
    document.documentElement.style.setProperty('--ui-z-overlay-slot-surface', '3');

    const scale = readOverlayLayerScale();

    expect(scale.base).toBe(5000);
    expect(scale.step).toBe(30);
    expect(scale.surface).toBe(3);
  });

  it('resolves deterministic z-index slots per stack level', () => {
    document.documentElement.style.setProperty('--ui-z-overlay-base', '5000');
    document.documentElement.style.setProperty('--ui-z-overlay-step', '20');
    document.documentElement.style.setProperty('--ui-z-overlay-slot-backdrop', '0');
    document.documentElement.style.setProperty('--ui-z-overlay-slot-surface', '2');

    const first = resolveOverlayLayerSlots(0, 'modal');
    const second = resolveOverlayLayerSlots(1, 'modal');

    expect(first).toEqual({ backdrop: 5000, content: 5002 });
    expect(second).toEqual({ backdrop: 5020, content: 5022 });
  });

  it('resolves floating, tooltip, and toast slots and clamps negative stack indexes', () => {
    document.documentElement.style.setProperty('--ui-z-overlay-base', '4500');
    document.documentElement.style.setProperty('--ui-z-overlay-step', '10');
    document.documentElement.style.setProperty('--ui-z-overlay-slot-floating', '4');
    document.documentElement.style.setProperty('--ui-z-overlay-slot-tooltip', '6');
    document.documentElement.style.setProperty('--ui-z-overlay-slot-toast', '8');

    expect(resolveOverlayLayerSlots(-1, 'floating')).toEqual({
      backdrop: 4504,
      content: 4504,
    });
    expect(resolveOverlayLayerSlots(1, 'tooltip')).toEqual({
      backdrop: 4516,
      content: 4516,
    });
    expect(resolveOverlayLayerSlots(2, 'toast')).toEqual({
      backdrop: 4528,
      content: 4528,
    });
  });

  it('falls back to defaults when css variables are missing or document is unavailable', () => {
    const customRoot = document.createElement('div');
    customRoot.style.setProperty('--ui-z-overlay-base', 'not-a-number');
    document.body.append(customRoot);

    expect(readOverlayLayerScale(customRoot)).toMatchObject({
      base: 4000,
      floating: 4,
    });
    expect(resolveOverlayLayerSlots(0, 'floating', customRoot)).toEqual({
      backdrop: 4004,
      content: 4004,
    });

    const originalDocument = globalThis.document;
    // @ts-expect-error test-only override
    globalThis.document = undefined;
    expect(readOverlayLayerScale()).toMatchObject({
      base: 4000,
      step: 20,
    });
    // @ts-expect-error restore test-only override
    globalThis.document = originalDocument;
  });
});
