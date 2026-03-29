import { beforeEach, describe, expect, it, vi } from 'vitest';

import { MOTION_PRESETS } from './presets';
import {
  applyTransitionMotionVariables,
  clearTransitionMotionVariables,
  createTransitionGroupMotionStyle,
  prefersReducedMotion,
  resolveCollapseMotionPreset,
  resolveMotionPreset,
  resolveTransitionMotionPreset
} from './runtime';

describe('motion runtime', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      writable: true,
      value: vi.fn().mockReturnValue({ matches: false })
    });
  });

  it('resolves known presets from the catalog', () => {
    const preset = resolveMotionPreset('modal-fade-scale');

    expect(preset).toBe(MOTION_PRESETS['modal-fade-scale']);
    expect(preset.kind).toBe('transition');
  });

  it('uses fallback presets when no preset name is provided', () => {
    expect(resolveMotionPreset(undefined, 'fade-out')).toBe(MOTION_PRESETS['fade-out']);
  });

  it('falls back once for unknown presets', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    const fallback = resolveMotionPreset('missing-preset', 'fade-in');
    resolveMotionPreset('missing-preset', 'fade-in');

    expect(fallback).toBe(MOTION_PRESETS['fade-in']);
    expect(warn).toHaveBeenCalledTimes(1);
  });

  it('returns false when matchMedia is unavailable', () => {
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      writable: true,
      value: undefined
    });

    expect(prefersReducedMotion()).toBe(false);
  });

  it('returns false without window access and supports default fallback parameters', async () => {
    const originalWindow = globalThis.window;
    Object.defineProperty(globalThis, 'window', {
      configurable: true,
      value: undefined
    });

    const runtimeModule = await import('./runtime');
    expect(runtimeModule.prefersReducedMotion()).toBe(false);
    expect(runtimeModule.resolveMotionPreset('fade-in')).toBe(MOTION_PRESETS['fade-in']);

    Object.defineProperty(globalThis, 'window', {
      configurable: true,
      value: originalWindow
    });
  });

  it('reduces motion at runtime when the user prefers reduced motion', () => {
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      writable: true,
      value: vi.fn().mockReturnValue({ matches: true })
    });

    const preset = resolveTransitionMotionPreset('backdrop-soften');

    expect(preset.durationToken).toBe('--ui-motion-duration-instant');
    expect(preset.enter.transform).toBe('none');
  });

  it('falls back when a collapse preset is requested as transition motion', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    const preset = resolveTransitionMotionPreset('collapse-y-soft', 'fade-in');

    expect(preset).toBe(MOTION_PRESETS['fade-in']);
    expect(warn).toHaveBeenCalled();
  });

  it('warns using the resolved kind when the fallback itself is not a transition preset', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    const preset = resolveTransitionMotionPreset(undefined, 'collapse-y-soft' as never);

    expect(preset).toBe(MOTION_PRESETS['fade-in']);
    expect(warn).toHaveBeenCalledWith(
      '[ui-motion] Unknown motion preset "collapse". Falling back to "collapse-y-soft".'
    );
  });

  it('falls back when a transition preset is requested as collapse motion', () => {
    const preset = resolveCollapseMotionPreset('fade-in', 'collapse-y-soft');

    expect(preset).toBe(MOTION_PRESETS['collapse-y-soft']);
  });

  it('uses the default collapse fallback when no preset name is provided', () => {
    expect(resolveCollapseMotionPreset(undefined)).toBe(MOTION_PRESETS['collapse-y-soft']);
  });

  it('applies and clears transition css variables', () => {
    const element = document.createElement('div');
    const preset = resolveTransitionMotionPreset('list-stagger-in');

    applyTransitionMotionVariables(element, preset, 'enter', 2);

    expect(element.style.getPropertyValue('--ui-motion-duration')).toBe(
      `var(${preset.durationToken})`
    );
    expect(element.style.getPropertyValue('--ui-motion-delay')).toContain('calc(');
    expect(element.style.getPropertyValue('--ui-motion-transform-from')).toContain('translate3d');

    clearTransitionMotionVariables(element);

    expect(element.style.getPropertyValue('--ui-motion-duration')).toBe('');
    expect(element.style.getPropertyValue('--ui-motion-transform-from')).toBe('');
  });

  it('uses zero delay without a stagger token and creates group motion styles', () => {
    const element = document.createElement('div');
    const preset = resolveTransitionMotionPreset('fade-in');

    applyTransitionMotionVariables(element, preset, 'leave');

    expect(element.style.getPropertyValue('--ui-motion-delay')).toBe('0ms');
    expect(element.style.getPropertyValue('--ui-motion-opacity-from')).toBe(
      preset.leave.opacity ?? ''
    );

    const groupStyle = createTransitionGroupMotionStyle(preset);
    expect(groupStyle['--ui-motion-duration']).toBe(`var(${preset.durationToken})`);
    expect(groupStyle['--ui-motion-move-duration']).toBe(`var(${preset.durationToken})`);
  });

  it('clears clip and filter variables when the preset stage omits them', () => {
    const element = document.createElement('div');
    element.style.setProperty('--ui-motion-clip-from', 'circle(40%)');
    element.style.setProperty('--ui-motion-filter-from', 'blur(4px)');

    const preset = resolveTransitionMotionPreset('fade-out');
    applyTransitionMotionVariables(element, preset, 'enter', 0);

    expect(element.style.getPropertyValue('--ui-motion-clip-from')).toBe('');
    expect(element.style.getPropertyValue('--ui-motion-filter-from')).toBe('');
  });

  it('keeps a reduced-motion transition preset when the resolved preset has no custom reduced preset', async () => {
    vi.resetModules();
    vi.doMock('./presets', () => ({
      MOTION_PRESETS: {
        'fade-in': MOTION_PRESETS['fade-in'],
        'no-reduced': {
          kind: 'transition',
          family: 'enter',
          layer: 'component',
          tier: 'A',
          durationToken: '--ui-motion-duration-sm',
          easingToken: '--ui-motion-easing-standard',
          properties: 'opacity',
          useCases: ['custom'],
          antiUseCases: ['none'],
          reducedMotion: 'softened',
          enter: { opacity: '0', transform: 'translateY(4px)' },
          leave: { opacity: '0', transform: 'translateY(-4px)' }
        }
      }
    }));

    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      writable: true,
      value: vi.fn().mockReturnValue({ matches: true })
    });

    const runtimeModule = await import('./runtime');
    const preset = runtimeModule.resolveTransitionMotionPreset('no-reduced', 'fade-in');

    expect(preset.durationToken).toBe('--ui-motion-duration-sm');
    expect(preset.enter.transform).toContain('translateY');

    vi.doUnmock('./presets');
    vi.resetModules();
  });

  it('falls back to the none preset when reduced motion resolves to a collapse preset', async () => {
    vi.resetModules();
    vi.doMock('./presets', () => ({
      MOTION_PRESETS: {
        'fade-in': MOTION_PRESETS['fade-in'],
        'collapse-y-soft': MOTION_PRESETS['collapse-y-soft'],
        'reduced-collapse': {
          ...MOTION_PRESETS['fade-in'],
          reducedPreset: 'collapse-y-soft'
        }
      }
    }));

    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      writable: true,
      value: vi.fn().mockReturnValue({ matches: true })
    });

    const runtimeModule = await import('./runtime');
    const preset = runtimeModule.resolveTransitionMotionPreset('reduced-collapse', 'fade-in');

    expect(preset.durationToken).toBe('--ui-motion-duration-instant');
    expect(preset.properties).toBe('opacity');

    vi.doUnmock('./presets');
    vi.resetModules();
  });

  it('recursively resolves reduced transition presets when they point to another transition preset', async () => {
    vi.resetModules();
    vi.doMock('./presets', () => ({
      MOTION_PRESETS: {
        'fade-in': MOTION_PRESETS['fade-in'],
        'fade-out': MOTION_PRESETS['fade-out'],
        recursive: {
          ...MOTION_PRESETS['fade-in'],
          reducedPreset: 'fade-out'
        }
      }
    }));

    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      writable: true,
      value: vi.fn().mockReturnValue({ matches: true })
    });

    const runtimeModule = await import('./runtime');
    const preset = runtimeModule.resolveTransitionMotionPreset('recursive', 'fade-in');

    expect(preset.durationToken).toBe('--ui-motion-duration-instant');
    expect(preset.properties).toBe('opacity');

    vi.doUnmock('./presets');
    vi.resetModules();
  });
});
