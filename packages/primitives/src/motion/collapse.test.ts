import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  __collapseTestUtils,
  afterCollapseMotion,
  beforeCollapseMotion,
  runCollapseMotion,
} from './collapse';
import { __motionRuntimeTestUtils } from './runtime';

function dispatchTransitionEnd(element: HTMLElement, propertyName: string) {
  const event = new Event('transitionend');
  Object.defineProperty(event, 'propertyName', {
    configurable: true,
    value: propertyName,
  });
  element.dispatchEvent(event);
}

describe('collapse motion', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.useFakeTimers();
    __motionRuntimeTestUtils.resetReducedMotionPreference();
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      writable: true,
      value: vi.fn().mockReturnValue({ matches: false }),
    });
    Object.defineProperty(window, 'requestAnimationFrame', {
      configurable: true,
      writable: true,
      value: (callback: FrameRequestCallback) => {
        callback(0);
        return 1;
      },
    });
    document.documentElement.style.setProperty('--ui-motion-duration-sm', '16ms');
  });

  afterEach(() => {
    __motionRuntimeTestUtils.resetReducedMotionPreference();
    vi.useRealTimers();
    document.documentElement.style.removeProperty('--ui-motion-duration-sm');
  });

  it('short-circuits when reduced motion is enabled', () => {
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      writable: true,
      value: vi.fn().mockReturnValue({ matches: true }),
    });

    const element = document.createElement('div');
    const done = vi.fn();

    runCollapseMotion(element, { phase: 'enter', preset: 'collapse-y-soft' }, done);

    expect(done).toHaveBeenCalledTimes(1);
    beforeCollapseMotion(element, { phase: 'enter', preset: 'collapse-y-soft' });
    expect(element.style.height).toBe('');
  });

  it('covers collapse timing helpers for empty, millisecond, second, and computed transition lists', () => {
    expect(__collapseTestUtils.parseTimeMs('')).toBe(0);
    expect(__collapseTestUtils.parseTimeMs('24ms')).toBe(24);
    expect(__collapseTestUtils.parseTimeMs('0.16s')).toBe(160);
    expect(__collapseTestUtils.parseTimeMs('bads')).toBe(0);
    expect(__collapseTestUtils.parseTimeMs('24')).toBe(24);
    expect(__collapseTestUtils.readTransitionListMs(', 16ms, , 0.2s')).toEqual([16, 200]);
    expect(__collapseTestUtils.readTransitionListMs('-16ms, 0.2s')).toEqual([200]);

    const originalGetComputedStyle = window.getComputedStyle;
    window.getComputedStyle = vi.fn(() => ({
      transitionDelay: '',
      transitionDuration: '',
    })) as typeof window.getComputedStyle;

    const element = document.createElement('div');
    expect(__collapseTestUtils.readLongestTransitionMs(element, 24)).toBe(24);

    window.getComputedStyle = vi.fn(() => ({
      transitionDelay: '8ms',
      transitionDuration: '16ms, 0.2s',
    })) as typeof window.getComputedStyle;

    expect(__collapseTestUtils.readLongestTransitionMs(element, 24)).toBe(208);

    window.getComputedStyle = vi.fn(() => ({
      transitionDelay: '8ms, 12ms',
      transitionDuration: '16ms',
    })) as typeof window.getComputedStyle;

    expect(__collapseTestUtils.readLongestTransitionMs(element, 24)).toBe(28);

    window.getComputedStyle = vi.fn(() => ({
      transitionDelay: '8ms',
      transitionDuration: '',
    })) as typeof window.getComputedStyle;

    expect(__collapseTestUtils.readLongestTransitionMs(element, 24)).toBe(32);

    window.getComputedStyle = vi.fn(() => ({
      transitionDelay: '',
      transitionDuration: '16ms',
    })) as typeof window.getComputedStyle;

    expect(__collapseTestUtils.readLongestTransitionMs(element, 24)).toBe(24);

    window.getComputedStyle = originalGetComputedStyle;
  });

  it('falls back to the default collapse opacity factor when the local token is not finite', () => {
    const element = document.createElement('div');
    element.style.setProperty('--ui-motion-duration-sm', '50ms');
    element.style.setProperty('--ui-motion-collapse-opacity-duration-factor', 'Infinity');
    Object.defineProperty(element, 'scrollHeight', {
      configurable: true,
      value: 80,
    });

    const done = vi.fn();
    runCollapseMotion(element, { phase: 'enter', preset: 'collapse-y-soft' }, done);

    expect(element.style.transition).toContain('opacity 40ms');
    vi.advanceTimersByTime(50);
    expect(done).toHaveBeenCalledTimes(1);
  });

  it('covers direct transition-end fallback scheduling for helper-level cleanup branches', () => {
    const element = document.createElement('div');
    const done = vi.fn();
    const scheduleFallback = __collapseTestUtils.waitForTransitionEnd(element, done);

    scheduleFallback(24);
    dispatchTransitionEnd(element, 'opacity');
    expect(done).not.toHaveBeenCalled();

    dispatchTransitionEnd(element, 'height');
    dispatchTransitionEnd(element, 'height');
    vi.runAllTimers();

    expect(done).toHaveBeenCalledTimes(1);
  });

  it('covers transition-end cleanup before a timeout fallback is armed', () => {
    const element = document.createElement('div');
    const done = vi.fn();
    __collapseTestUtils.waitForTransitionEnd(element, done);

    dispatchTransitionEnd(element, 'height');
    vi.runAllTimers();

    expect(done).toHaveBeenCalledTimes(1);
  });

  it('covers the defensive finished guard when timeout completion races with transitionend', () => {
    const element = document.createElement('div');
    const done = vi.fn();
    let timeoutCallback: (() => void) | undefined;
    const originalSetTimeout = window.setTimeout;

    window.setTimeout = vi.fn((callback: TimerHandler) => {
      timeoutCallback = callback as () => void;
      return 1;
    }) as typeof window.setTimeout;

    const scheduleFallback = __collapseTestUtils.waitForTransitionEnd(element, done);
    scheduleFallback(24);
    dispatchTransitionEnd(element, 'height');
    timeoutCallback?.();

    expect(done).toHaveBeenCalledTimes(1);

    window.setTimeout = originalSetTimeout;
  });

  it('prepares leave-phase styles before animating out', () => {
    const element = document.createElement('div');
    Object.defineProperty(element, 'scrollHeight', {
      configurable: true,
      value: 96,
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
      value: 120,
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
      value: 120,
    });
    Object.defineProperty(element, 'offsetHeight', {
      configurable: true,
      get: () => 120,
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
      value: 80,
    });

    const done = vi.fn();
    runCollapseMotion(element, { phase: 'enter', preset: 'collapse-y-soft' }, done);

    vi.advanceTimersByTime(47);
    expect(done).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(done).toHaveBeenCalledTimes(1);
  });

  it('derives opacity timing from the shared collapse opacity factor token', () => {
    const element = document.createElement('div');
    element.style.setProperty('--ui-motion-duration-sm', '50ms');
    element.style.setProperty('--ui-motion-collapse-opacity-duration-factor', '0.5');
    Object.defineProperty(element, 'scrollHeight', {
      configurable: true,
      value: 80,
    });

    const done = vi.fn();
    runCollapseMotion(element, { phase: 'enter', preset: 'collapse-y-soft' }, done);

    expect(element.style.transition).toContain('opacity 25ms');
    vi.advanceTimersByTime(50);
    expect(done).toHaveBeenCalledTimes(1);
  });

  it('parses numeric duration overrides that do not use ms suffixes', () => {
    const element = document.createElement('div');
    element.style.setProperty('--ui-motion-duration-sm', '24');
    Object.defineProperty(element, 'scrollHeight', {
      configurable: true,
      value: 80,
    });

    const done = vi.fn();
    runCollapseMotion(element, { phase: 'enter', preset: 'collapse-y-soft' }, done);

    vi.advanceTimersByTime(23);
    expect(done).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(done).toHaveBeenCalledTimes(1);
  });

  it('parses second-based duration overrides without truncating them to milliseconds', () => {
    const element = document.createElement('div');
    element.style.setProperty('--ui-motion-duration-sm', '0.16s');
    Object.defineProperty(element, 'scrollHeight', {
      configurable: true,
      value: 80,
    });

    const done = vi.fn();
    runCollapseMotion(element, { phase: 'enter', preset: 'collapse-y-soft' }, done);

    vi.advanceTimersByTime(159);
    expect(done).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(done).toHaveBeenCalledTimes(1);
  });

  it('falls back to zero-duration timing when document is unavailable', () => {
    const originalDocument = globalThis.document;
    const element = originalDocument.createElement('div');
    Object.defineProperty(element, 'scrollHeight', {
      configurable: true,
      value: 42,
    });
    Object.defineProperty(globalThis, 'document', {
      configurable: true,
      value: undefined,
    });

    const done = vi.fn();
    runCollapseMotion(element, { phase: 'enter', preset: 'collapse-y-soft' }, done);
    vi.runAllTimers();

    expect(done).toHaveBeenCalledTimes(1);

    Object.defineProperty(globalThis, 'document', {
      configurable: true,
      value: originalDocument,
    });
  });

  it('parses invalid local duration values as zero', () => {
    const element = document.createElement('div');
    element.style.setProperty('--ui-motion-duration-sm', 'fast');
    Object.defineProperty(element, 'scrollHeight', {
      configurable: true,
      value: 24,
    });

    const done = vi.fn();
    runCollapseMotion(element, { phase: 'enter', preset: 'collapse-y-soft' }, done);
    vi.runAllTimers();

    expect(done).toHaveBeenCalledTimes(1);
  });

  it('finishes only once even if timeout and transitionend both fire', () => {
    const element = document.createElement('div');
    Object.defineProperty(element, 'scrollHeight', {
      configurable: true,
      value: 56,
    });

    const done = vi.fn();
    runCollapseMotion(element, { phase: 'enter', preset: 'collapse-y-soft' }, done);
    dispatchTransitionEnd(element, 'height');
    vi.runAllTimers();

    expect(done).toHaveBeenCalledTimes(1);
  });

  it('treats explicit zero-millisecond duration tokens as immediate timing', () => {
    const element = document.createElement('div');
    element.style.setProperty('--ui-motion-duration-sm', '0ms');
    Object.defineProperty(element, 'scrollHeight', {
      configurable: true,
      value: 56,
    });

    const done = vi.fn();
    runCollapseMotion(element, { phase: 'enter', preset: 'collapse-y-soft' }, done);
    vi.runAllTimers();

    expect(done).toHaveBeenCalledTimes(1);
  });

  it('falls back to direct transition application when requestAnimationFrame and computed transition lists are unavailable', () => {
    const originalGetComputedStyle = window.getComputedStyle;
    Object.defineProperty(window, 'requestAnimationFrame', {
      configurable: true,
      writable: true,
      value: undefined,
    });
    window.getComputedStyle = vi.fn((target: Element) => ({
      getPropertyValue: (tokenName: string) => {
        if (tokenName !== '--ui-motion-duration-sm') {
          return '';
        }

        return target === document.documentElement ? '24ms' : '';
      },
      transitionDelay: '',
      transitionDuration: '',
    })) as typeof window.getComputedStyle;

    const element = document.createElement('div');
    Object.defineProperty(element, 'scrollHeight', {
      configurable: true,
      value: 32,
    });

    const done = vi.fn();
    runCollapseMotion(element, { phase: 'enter', preset: 'collapse-y-soft' }, done);

    vi.advanceTimersByTime(23);
    expect(done).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(done).toHaveBeenCalledTimes(1);

    window.getComputedStyle = originalGetComputedStyle;
  });
});
