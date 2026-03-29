import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { afterCollapseMotion, beforeCollapseMotion, runCollapseMotion } from './collapse';

function dispatchTransitionEnd(
  element: HTMLElement,
  propertyName: string
) {
  const event = new Event('transitionend');
  Object.defineProperty(event, 'propertyName', {
    configurable: true,
    value: propertyName
  });
  element.dispatchEvent(event);
}

describe('collapse motion', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.useFakeTimers();
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      writable: true,
      value: vi.fn().mockReturnValue({ matches: false })
    });
    Object.defineProperty(window, 'requestAnimationFrame', {
      configurable: true,
      writable: true,
      value: (callback: FrameRequestCallback) => {
        callback(0);
        return 1;
      }
    });
    document.documentElement.style.setProperty('--ui-motion-duration-sm', '16ms');
  });

  afterEach(() => {
    vi.useRealTimers();
    document.documentElement.style.removeProperty('--ui-motion-duration-sm');
  });

  it('short-circuits when reduced motion is enabled', () => {
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      writable: true,
      value: vi.fn().mockReturnValue({ matches: true })
    });

    const element = document.createElement('div');
    const done = vi.fn();

    runCollapseMotion(element, { phase: 'enter', preset: 'collapse-y-soft' }, done);

    expect(done).toHaveBeenCalledTimes(1);
    beforeCollapseMotion(element, { phase: 'enter', preset: 'collapse-y-soft' });
    expect(element.style.height).toBe('');
  });

  it('prepares leave-phase styles before animating out', () => {
    const element = document.createElement('div');
    Object.defineProperty(element, 'scrollHeight', {
      configurable: true,
      value: 96
    });

    beforeCollapseMotion(element, { phase: 'leave', preset: 'collapse-y-soft' });

    expect(element.style.height).toBe('96px');
    expect(element.style.opacity).toBe('1');
    expect(element.style.overflow).toBe('hidden');
  });

  it('applies inline styles and completes through the transition callback', () => {
    const element = document.createElement('div');
    Object.defineProperty(element, 'scrollHeight', {
      configurable: true,
      value: 120
    });

    beforeCollapseMotion(element, { phase: 'enter', preset: 'collapse-y-soft' });
    expect(element.style.height).toBe('0px');
    expect(element.style.opacity).toBe('0');

    const done = vi.fn();
    runCollapseMotion(element, { phase: 'enter', preset: 'collapse-y-soft' }, done);
    vi.advanceTimersByTime(120);

    expect(done).toHaveBeenCalledTimes(1);

    afterCollapseMotion(element);
    expect(element.style.height).toBe('');
    expect(element.style.transition).toBe('');
  });

  it('handles leave-phase transitionend events and ignores unrelated properties', () => {
    const element = document.createElement('div');
    Object.defineProperty(element, 'scrollHeight', {
      configurable: true,
      value: 120
    });
    Object.defineProperty(element, 'offsetHeight', {
      configurable: true,
      get: () => 120
    });

    const done = vi.fn();
    runCollapseMotion(element, { phase: 'leave', preset: 'collapse-y-soft' }, done);

    dispatchTransitionEnd(element, 'opacity');
    expect(done).not.toHaveBeenCalled();

    dispatchTransitionEnd(element, 'height');
    expect(done).toHaveBeenCalledTimes(1);
    expect(element.style.height).toBe('0px');
    expect(element.style.opacity).toBe('0');
  });

  it('respects locally overridden duration tokens on the animated element', () => {
    const element = document.createElement('div');
    element.style.setProperty('--ui-motion-duration-sm', '48ms');
    Object.defineProperty(element, 'scrollHeight', {
      configurable: true,
      value: 80
    });

    const done = vi.fn();
    runCollapseMotion(element, { phase: 'enter', preset: 'collapse-y-soft' }, done);

    vi.advanceTimersByTime(47);
    expect(done).not.toHaveBeenCalled();

    vi.advanceTimersByTime(81);
    expect(done).toHaveBeenCalledTimes(1);
  });

  it('parses numeric duration overrides that do not use ms suffixes', () => {
    const element = document.createElement('div');
    element.style.setProperty('--ui-motion-duration-sm', '24');
    Object.defineProperty(element, 'scrollHeight', {
      configurable: true,
      value: 80
    });

    const done = vi.fn();
    runCollapseMotion(element, { phase: 'enter', preset: 'collapse-y-soft' }, done);

    vi.advanceTimersByTime(104);
    expect(done).toHaveBeenCalledTimes(1);
  });

  it('falls back to zero-duration timing when document is unavailable', () => {
    const originalDocument = globalThis.document;
    const element = originalDocument.createElement('div');
    Object.defineProperty(element, 'scrollHeight', {
      configurable: true,
      value: 42
    });
    Object.defineProperty(globalThis, 'document', {
      configurable: true,
      value: undefined
    });

    const done = vi.fn();
    runCollapseMotion(element, { phase: 'enter', preset: 'collapse-y-soft' }, done);
    vi.advanceTimersByTime(81);

    expect(done).toHaveBeenCalledTimes(1);

    Object.defineProperty(globalThis, 'document', {
      configurable: true,
      value: originalDocument
    });
  });

  it('parses invalid local duration values as zero', () => {
    const element = document.createElement('div');
    element.style.setProperty('--ui-motion-duration-sm', 'fast');
    Object.defineProperty(element, 'scrollHeight', {
      configurable: true,
      value: 24
    });

    const done = vi.fn();
    runCollapseMotion(element, { phase: 'enter', preset: 'collapse-y-soft' }, done);
    vi.advanceTimersByTime(81);

    expect(done).toHaveBeenCalledTimes(1);
  });

  it('finishes only once even if timeout and transitionend both fire', () => {
    const element = document.createElement('div');
    Object.defineProperty(element, 'scrollHeight', {
      configurable: true,
      value: 56
    });

    const done = vi.fn();
    runCollapseMotion(element, { phase: 'enter', preset: 'collapse-y-soft' }, done);
    dispatchTransitionEnd(element, 'height');
    vi.advanceTimersByTime(96);

    expect(done).toHaveBeenCalledTimes(1);
  });

  it('treats explicit zero-millisecond duration tokens as immediate timing', () => {
    const element = document.createElement('div');
    element.style.setProperty('--ui-motion-duration-sm', '0ms');
    Object.defineProperty(element, 'scrollHeight', {
      configurable: true,
      value: 56
    });

    const done = vi.fn();
    runCollapseMotion(element, { phase: 'enter', preset: 'collapse-y-soft' }, done);
    vi.advanceTimersByTime(81);

    expect(done).toHaveBeenCalledTimes(1);
  });
});
