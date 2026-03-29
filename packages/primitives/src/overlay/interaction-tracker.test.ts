import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  ensureOverlayInteractionTracking,
  getLastOverlayInteractionTarget
} from './interaction-tracker';

describe('overlay interaction tracker', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    document.body.innerHTML = '';
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    document.body.innerHTML = '';
  });

  it('tracks the nearest focusable element from pointer interactions', () => {
    ensureOverlayInteractionTracking();

    const button = document.createElement('button');
    const icon = document.createElement('span');
    button.append(icon);
    document.body.append(button);

    icon.dispatchEvent(new Event('pointerdown', { bubbles: true }));

    expect(getLastOverlayInteractionTarget()).toBe(button);
  });

  it('prefers the active element for keyboard interactions and expires stale targets', () => {
    ensureOverlayInteractionTracking();

    const input = document.createElement('input');
    const other = document.createElement('div');
    document.body.append(input, other);
    input.focus();

    document.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Enter' }));
    expect(getLastOverlayInteractionTarget()).toBe(input);

    vi.advanceTimersByTime(1501);
    expect(getLastOverlayInteractionTarget()).toBeNull();
  });

  it('falls back to a non-focusable event target and drops disconnected elements', () => {
    ensureOverlayInteractionTracking();

    const container = document.createElement('div');
    document.body.append(container);

    container.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    expect(getLastOverlayInteractionTarget()).toBe(container);

    container.remove();
    expect(getLastOverlayInteractionTarget()).toBeNull();
  });

  it('falls back to the keyboard event target when no active focus target exists', () => {
    ensureOverlayInteractionTracking();

    const link = document.createElement('a');
    link.href = '#details';
    document.body.append(link);

    document.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Space' }));
    expect(getLastOverlayInteractionTarget()).toBeNull();

    link.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Space' }));
    expect(getLastOverlayInteractionTarget()).toBe(link);
  });

  it('handles tabindex targets, disabled focusables, and missing browser globals safely', () => {
    ensureOverlayInteractionTracking();

    const tabbable = document.createElement('div');
    tabbable.tabIndex = 0;
    const disabledButton = document.createElement('button');
    disabledButton.disabled = true;
    disabledButton.tabIndex = 0;
    document.body.append(tabbable, disabledButton);

    tabbable.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    expect(getLastOverlayInteractionTarget()).toBe(tabbable);

    disabledButton.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    expect(getLastOverlayInteractionTarget()).toBe(disabledButton);

    const originalDocument = globalThis.document;
    const originalHTMLElement = globalThis.HTMLElement;

    Object.defineProperty(globalThis, 'HTMLElement', {
      configurable: true,
      value: undefined
    });
    vi.advanceTimersByTime(1501);
    tabbable.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    expect(getLastOverlayInteractionTarget()).toBeNull();

    Object.defineProperty(globalThis, 'document', {
      configurable: true,
      value: undefined
    });
    expect(() => ensureOverlayInteractionTracking()).not.toThrow();
    expect(getLastOverlayInteractionTarget()).toBeNull();

    Object.defineProperty(globalThis, 'document', {
      configurable: true,
      value: originalDocument
    });
    Object.defineProperty(globalThis, 'HTMLElement', {
      configurable: true,
      value: originalHTMLElement
    });
  });

  it('covers listener guards for documentless handling and non-element keyboard fallbacks', async () => {
    vi.resetModules();
    const module = await import('./interaction-tracker');
    const listeners = new Map<string, EventListener>();
    const originalAddEventListener = document.addEventListener.bind(document);
    const addEventListenerSpy = vi
      .spyOn(document, 'addEventListener')
      .mockImplementation(((type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) => {
        listeners.set(type, listener as EventListener);
        originalAddEventListener(type, listener, options);
      }) as typeof document.addEventListener);

    module.ensureOverlayInteractionTracking();

    const originalActiveElement = Object.getOwnPropertyDescriptor(document, 'activeElement');
    Object.defineProperty(document, 'activeElement', {
      configurable: true,
      get: () => document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    });

    const keydownListener = listeners.get('keydown') as ((event: KeyboardEvent) => void) | undefined;
    const pointerdownListener = listeners.get('pointerdown') as ((event: PointerEvent) => void) | undefined;

    keydownListener?.({ target: { parentElement: null } } as KeyboardEvent);
    expect(module.getLastOverlayInteractionTarget()).toBeNull();

    const originalDocument = globalThis.document;
    Object.defineProperty(globalThis, 'document', {
      configurable: true,
      value: undefined
    });
    pointerdownListener?.({ target: originalDocument.body } as PointerEvent);
    keydownListener?.({ target: originalDocument.body } as KeyboardEvent);
    expect(module.getLastOverlayInteractionTarget()).toBeNull();

    Object.defineProperty(globalThis, 'document', {
      configurable: true,
      value: originalDocument
    });
    if (originalActiveElement) {
      Object.defineProperty(document, 'activeElement', originalActiveElement);
    }
    addEventListenerSpy.mockRestore();
  });

  it('resolves parentElement fallbacks for non-HTMLElement targets and ignores null event targets', async () => {
    vi.resetModules();
    const module = await import('./interaction-tracker');

    const button = document.createElement('button');
    const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    button.append(icon);
    document.body.append(button);

    module.ensureOverlayInteractionTracking();
    icon.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    expect(module.getLastOverlayInteractionTarget()).toBe(button);

    const listeners = new Map<string, EventListener>();
    const originalAddEventListener = document.addEventListener.bind(document);
    const addEventListenerSpy = vi
      .spyOn(document, 'addEventListener')
      .mockImplementation(((type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) => {
        listeners.set(type, listener as EventListener);
        originalAddEventListener(type, listener, options);
      }) as typeof document.addEventListener);

    vi.resetModules();
    const listenerModule = await import('./interaction-tracker');
    listenerModule.ensureOverlayInteractionTracking();

    const keydownListener = listeners.get('keydown') as ((event: KeyboardEvent) => void) | undefined;
    keydownListener?.({ target: null } as KeyboardEvent);
    expect(listenerModule.getLastOverlayInteractionTarget()).toBeNull();

    const originalDocument = globalThis.document;
    Object.defineProperty(globalThis, 'document', {
      configurable: true,
      value: undefined
    });

    keydownListener?.({ target: null } as KeyboardEvent);
    expect(listenerModule.getLastOverlayInteractionTarget()).toBeNull();

    Object.defineProperty(globalThis, 'document', {
      configurable: true,
      value: originalDocument
    });
    addEventListenerSpy.mockRestore();
  });
});
