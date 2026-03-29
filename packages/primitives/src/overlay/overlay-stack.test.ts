import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { registerOverlay, resetOverlayStackForTesting } from './overlay-stack';

function createSurface() {
  const element = document.createElement('div');
  const first = document.createElement('button');
  const second = document.createElement('button');

  first.textContent = 'first';
  second.textContent = 'second';
  element.tabIndex = -1;
  element.append(first, second);
  document.body.append(element);

  return { element, first, second };
}

describe('overlay stack', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    vi.restoreAllMocks();
    resetOverlayStackForTesting();
    document.body.innerHTML = '';
  });

  it('registers overlays with deterministic stacking order', () => {
    const firstSurface = createSurface();
    const secondSurface = createSurface();

    const first = registerOverlay({
      kind: 'modal',
      getContentElement: () => firstSurface.element,
      onDismiss: vi.fn()
    });
    const second = registerOverlay({
      kind: 'modal',
      getContentElement: () => secondSurface.element,
      onDismiss: vi.fn()
    });

    expect(first.stackIndex).toBe(0);
    expect(second.stackIndex).toBe(1);
    expect(second.layers.content).toBeGreaterThan(first.layers.content);

    first.unregister();
    second.unregister();
  });

  it('dismisses only the topmost overlay on escape', () => {
    const firstSurface = createSurface();
    const secondSurface = createSurface();
    const firstDismiss = vi.fn();
    const secondDismiss = vi.fn();

    const first = registerOverlay({
      kind: 'modal',
      getContentElement: () => firstSurface.element,
      dismissOnEscape: true,
      onDismiss: firstDismiss
    });
    const second = registerOverlay({
      kind: 'modal',
      getContentElement: () => secondSurface.element,
      dismissOnEscape: true,
      onDismiss: secondDismiss
    });

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

    expect(firstDismiss).not.toHaveBeenCalled();
    expect(secondDismiss).toHaveBeenCalledWith('escape-key');

    first.unregister();
    second.unregister();
  });

  it('ignores escape when dismissal is disabled or already prevented', () => {
    const surface = createSurface();
    const dismiss = vi.fn();

    const registration = registerOverlay({
      kind: 'modal',
      getContentElement: () => surface.element,
      dismissOnEscape: false,
      onDismiss: dismiss
    });

    const prevented = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true });
    prevented.preventDefault();
    document.dispatchEvent(prevented);
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

    expect(dismiss).not.toHaveBeenCalled();

    registration.unregister();
  });

  it('dismisses only the topmost overlay on outside pointer interactions', () => {
    const firstSurface = createSurface();
    const secondSurface = createSurface();
    const firstDismiss = vi.fn();
    const secondDismiss = vi.fn();
    const outside = document.createElement('button');
    document.body.append(outside);

    const first = registerOverlay({
      kind: 'modal',
      getContentElement: () => firstSurface.element,
      dismissOnPointerOutside: true,
      onDismiss: firstDismiss
    });
    const second = registerOverlay({
      kind: 'modal',
      getContentElement: () => secondSurface.element,
      dismissOnPointerOutside: true,
      onDismiss: secondDismiss
    });

    outside.dispatchEvent(new Event('pointerdown', { bubbles: true, cancelable: true }));

    expect(firstDismiss).not.toHaveBeenCalled();
    expect(secondDismiss).toHaveBeenCalledWith('pointer-outside');

    first.unregister();
    second.unregister();
  });

  it('ignores pointer interactions that stay within the topmost overlay', () => {
    const surface = createSurface();
    const dismiss = vi.fn();

    const registration = registerOverlay({
      kind: 'modal',
      getContentElement: () => surface.element,
      dismissOnPointerOutside: true,
      onDismiss: dismiss
    });

    surface.first.dispatchEvent(new Event('pointerdown', { bubbles: true, cancelable: true }));
    surface.first.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));

    expect(dismiss).not.toHaveBeenCalled();

    registration.unregister();
  });

  it('contains focus inside the topmost overlay when tabbing', () => {
    const surface = createSurface();

    const registration = registerOverlay({
      kind: 'modal',
      getContentElement: () => surface.element,
      containFocus: true,
      onDismiss: vi.fn()
    });

    surface.second.focus();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));

    expect(document.activeElement).toBe(surface.first);

    registration.unregister();
  });

  it('reference-counts scroll lock across nested overlays', () => {
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      value: 1200
    });
    Object.defineProperty(document.documentElement, 'clientWidth', {
      configurable: true,
      value: 1180
    });

    const firstSurface = createSurface();
    const secondSurface = createSurface();

    const first = registerOverlay({
      kind: 'modal',
      getContentElement: () => firstSurface.element,
      lockScroll: true,
      onDismiss: vi.fn()
    });
    const second = registerOverlay({
      kind: 'modal',
      getContentElement: () => secondSurface.element,
      lockScroll: true,
      onDismiss: vi.fn()
    });

    expect(document.body.style.overflow).toBe('hidden');
    expect(document.body.style.paddingRight).toBe('20px');

    second.unregister();
    expect(document.body.style.overflow).toBe('hidden');

    first.unregister();
    expect(document.body.style.overflow).toBe('');
  });

  it('keeps the underlying focus target when the topmost overlay is dismissed by outside click', async () => {
    const firstSurface = createSurface();
    const secondSurface = createSurface();
    const secondDismiss = vi.fn();

    const first = registerOverlay({
      kind: 'modal',
      getContentElement: () => firstSurface.element,
      dismissOnPointerOutside: true,
      onDismiss: vi.fn()
    });
    const second = registerOverlay({
      kind: 'modal',
      getContentElement: () => secondSurface.element,
      dismissOnPointerOutside: true,
      onDismiss: secondDismiss
    });

    firstSurface.first.dispatchEvent(new Event('pointerdown', { bubbles: true, cancelable: true }));
    firstSurface.first.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    vi.runAllTimers();
    await Promise.resolve();

    expect(secondDismiss).toHaveBeenCalledWith('pointer-outside');
    expect(document.activeElement).toBe(firstSurface.first);

    first.unregister();
    second.unregister();
  });

  it('skips queued fallback focus when the next entry is gone before focus-outside recovery runs', async () => {
    const lowerSurface = createSurface();
    const topSurface = createSurface();
    const outside = document.createElement('button');
    document.body.append(outside);
    const focusSpy = vi.spyOn(lowerSurface.first, 'focus');

    const lower = registerOverlay({
      kind: 'modal',
      getContentElement: () => lowerSurface.element,
      containFocus: true,
      onDismiss: vi.fn()
    });

    const top = registerOverlay({
      kind: 'modal',
      getContentElement: () => topSurface.element,
      dismissOnFocusOutside: true,
      onDismiss: () => {
        top.unregister();
        lower.unregister();
      }
    });

    outside.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    await Promise.resolve();

    expect(focusSpy).not.toHaveBeenCalled();
  });

  it('uses extra boundary elements and fallback content focus', () => {
    const surface = document.createElement('div');
    surface.tabIndex = -1;
    document.body.append(surface);

    const boundary = document.createElement('button');
    const outside = document.createElement('button');
    document.body.append(boundary, outside);
    const dismiss = vi.fn();

    const registration = registerOverlay({
      kind: 'modal',
      getContentElement: () => surface,
      getBoundaryElements: () => [boundary],
      dismissOnPointerOutside: true,
      onDismiss: dismiss
    });

    boundary.dispatchEvent(new Event('pointerdown', { bubbles: true, cancelable: true }));
    expect(dismiss).not.toHaveBeenCalled();

    expect(registration.focusContent()).toBe(true);
    expect(document.activeElement).toBe(surface);

    outside.dispatchEvent(new Event('pointerdown', { bubbles: true, cancelable: true }));
    expect(dismiss).toHaveBeenCalledWith('pointer-outside');

    registration.unregister();
  });

  it('skips queued fallback focus when the outside target becomes part of the next entry before recovery runs', () => {
    const lowerSurface = createSurface();
    const topSurface = createSurface();
    const outside = document.createElement('button');
    outside.textContent = 'outside';
    document.body.append(outside);
    const focusSpy = vi.spyOn(lowerSurface.first, 'focus');
    let capturedFocusIn: EventListener | null = null;
    let queuedRecovery: VoidFunction | null = null;
    const originalAddEventListener = document.addEventListener.bind(document);
    vi.spyOn(document, 'addEventListener').mockImplementation((type, listener, options) => {
      if (type === 'focusin') {
        capturedFocusIn = listener as EventListener;
      }
      return originalAddEventListener(type, listener, options);
    });
    vi.spyOn(globalThis, 'queueMicrotask').mockImplementation((callback: VoidFunction) => {
      queuedRecovery = callback;
    });

    const lower = registerOverlay({
      kind: 'modal',
      getContentElement: () => lowerSurface.element,
      containFocus: true,
      onDismiss: vi.fn()
    });

    const top = registerOverlay({
      kind: 'modal',
      getContentElement: () => topSurface.element,
      dismissOnFocusOutside: true,
      onDismiss: () => {
        top.unregister();
      }
    });

    if (!capturedFocusIn) {
      throw new Error('Expected focusin listener to be attached.');
    }

    capturedFocusIn({ target: outside } as Event);
    expect(queuedRecovery).not.toBeNull();

    lowerSurface.element.append(outside);
    queuedRecovery?.();

    expect(focusSpy).not.toHaveBeenCalled();

    lower.unregister();
  });

  it('returns false when focusContent is requested without a content element', () => {
    const registration = registerOverlay({
      kind: 'modal',
      getContentElement: () => null,
      onDismiss: vi.fn()
    });

    expect(registration.focusContent()).toBe(false);

    registration.unregister();
  });

  it('restores focus to the previous contain-focus overlay on focus-outside dismissal', async () => {
    const firstSurface = createSurface();
    const secondSurface = createSurface();
    const outside = document.createElement('button');
    document.body.append(outside);
    const second = {
      value: undefined as ReturnType<typeof registerOverlay> | undefined
    };
    const secondDismiss = vi.fn(() => {
      second.value?.unregister();
    });

    const first = registerOverlay({
      kind: 'modal',
      getContentElement: () => firstSurface.element,
      containFocus: true,
      onDismiss: vi.fn()
    });
    second.value = registerOverlay({
      kind: 'modal',
      getContentElement: () => secondSurface.element,
      dismissOnFocusOutside: true,
      onDismiss: secondDismiss
    });

    outside.focus();
    outside.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    await Promise.resolve();
    await Promise.resolve();

    expect(secondDismiss).toHaveBeenCalledWith('focus-outside');
    expect(firstSurface.element.contains(document.activeElement)).toBe(true);

    first.unregister();
  });

  it('ignores stray events without overlays and non-escape key presses on the topmost overlay', () => {
    const outside = document.createElement('button');
    document.body.append(outside);

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    outside.dispatchEvent(new Event('pointerdown', { bubbles: true, cancelable: true }));
    outside.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    outside.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));

    const surface = createSurface();
    const dismiss = vi.fn();

    const registration = registerOverlay({
      kind: 'modal',
      getContentElement: () => surface.element,
      containFocus: true,
      dismissOnEscape: true,
      onDismiss: dismiss
    });

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(dismiss).not.toHaveBeenCalled();

    registration.unregister();
  });

  it('suppresses outside clicks even when pointer dismissal is disabled and leaves unrelated clicks alone', () => {
    const surface = createSurface();
    const firstOutside = document.createElement('button');
    const secondOutside = document.createElement('button');
    document.body.append(firstOutside, secondOutside);
    const dismiss = vi.fn();

    const registration = registerOverlay({
      kind: 'modal',
      getContentElement: () => surface.element,
      dismissOnPointerOutside: false,
      onDismiss: dismiss
    });

    const suppressedClick = new MouseEvent('click', { bubbles: true, cancelable: true });
    firstOutside.dispatchEvent(new Event('pointerdown', { bubbles: true, cancelable: true }));
    firstOutside.dispatchEvent(suppressedClick);

    const unrelatedClick = new MouseEvent('click', { bubbles: true, cancelable: true });
    firstOutside.dispatchEvent(new Event('pointerdown', { bubbles: true, cancelable: true }));
    secondOutside.dispatchEvent(unrelatedClick);

    expect(dismiss).not.toHaveBeenCalled();
    expect(suppressedClick.defaultPrevented).toBe(true);
    expect(unrelatedClick.defaultPrevented).toBe(false);

    registration.unregister();
  });

  it('ignores outside focus when neither dismissal nor containment is enabled', async () => {
    const surface = createSurface();
    const outside = document.createElement('button');
    document.body.append(outside);
    const dismiss = vi.fn();

    const registration = registerOverlay({
      kind: 'modal',
      getContentElement: () => surface.element,
      dismissOnFocusOutside: false,
      containFocus: false,
      onDismiss: dismiss
    });

    outside.focus();
    outside.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    await Promise.resolve();

    expect(dismiss).not.toHaveBeenCalled();
    expect(document.activeElement).toBe(outside);

    registration.unregister();
  });

  it('covers the no-next-entry focus-outside path without follow-up refocus work', async () => {
    const surface = createSurface();
    const outside = document.createElement('button');
    document.body.append(outside);
    const dismiss = vi.fn();

    const registration = registerOverlay({
      kind: 'modal',
      getContentElement: () => surface.element,
      dismissOnFocusOutside: true,
      onDismiss: dismiss
    });

    outside.focus();
    outside.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    await Promise.resolve();

    expect(dismiss).toHaveBeenCalledWith('focus-outside');
    expect(document.activeElement).toBe(outside);

    registration.unregister();
  });

  it('handles zero-width scrollbars and contenteditable outside targets', async () => {
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      value: 1200
    });
    Object.defineProperty(document.documentElement, 'clientWidth', {
      configurable: true,
      value: 1200
    });

    const firstSurface = createSurface();
    const secondSurface = createSurface();
    const editable = document.createElement('div');
    editable.setAttribute('contenteditable', 'true');
    firstSurface.element.append(editable);

    const second = {
      value: undefined as ReturnType<typeof registerOverlay> | undefined
    };

    const first = registerOverlay({
      kind: 'modal',
      getContentElement: () => firstSurface.element,
      containFocus: true,
      lockScroll: true,
      onDismiss: vi.fn()
    });
    second.value = registerOverlay({
      kind: 'modal',
      getContentElement: () => secondSurface.element,
      dismissOnPointerOutside: true,
      onDismiss: () => second.value?.unregister()
    });

    editable.dispatchEvent(new Event('pointerdown', { bubbles: true, cancelable: true }));
    editable.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    vi.runAllTimers();
    await Promise.resolve();

    expect(document.body.style.paddingRight).toBe('');
    expect(document.activeElement).toBe(editable);

    first.unregister();
  });

  it('covers guard branches for captured listeners and documentless scroll-sync cleanup', () => {
    const listeners = new Map<string, EventListener>();
    const originalAddEventListener = document.addEventListener.bind(document);
    const addEventListenerSpy = vi
      .spyOn(document, 'addEventListener')
      .mockImplementation(((type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) => {
        listeners.set(type, listener as EventListener);
        originalAddEventListener(type, listener, options);
      }) as typeof document.addEventListener);

    const surface = createSurface();
    const registration = registerOverlay({
      kind: 'modal',
      getContentElement: () => surface.element,
      dismissOnEscape: true,
      onDismiss: vi.fn()
    });
    registration.unregister();

    const keydownListener = listeners.get('keydown') as ((event: KeyboardEvent) => void) | undefined;
    const pointerListener = listeners.get('pointerdown') as ((event: PointerEvent) => void) | undefined;
    const clickListener = listeners.get('click') as ((event: MouseEvent) => void) | undefined;
    const focusInListener = listeners.get('focusin') as ((event: FocusEvent) => void) | undefined;

    keydownListener?.({ defaultPrevented: false, key: 'Escape' } as KeyboardEvent);
    pointerListener?.({ target: null } as PointerEvent);
    clickListener?.({ target: null } as MouseEvent);
    focusInListener?.({ target: null } as FocusEvent);

    const originalDocument = globalThis.document;
    Object.defineProperty(globalThis, 'document', {
      configurable: true,
      value: undefined
    });
    expect(() => resetOverlayStackForTesting()).not.toThrow();
    Object.defineProperty(globalThis, 'document', {
      configurable: true,
      value: originalDocument
    });

    addEventListenerSpy.mockRestore();
  });

  it('covers suppressed focus restoration paths for pointerdown and click outside flows', async () => {
    const firstSurface = createSurface();
    const secondSurface = createSurface();
    const anchor = document.createElement('a');
    anchor.href = '#details';
    anchor.textContent = 'details';
    const hiddenInput = document.createElement('input');
    hiddenInput.type = 'hidden';
    const disabledButton = document.createElement('button');
    disabledButton.disabled = true;
    const negativeTabIndex = document.createElement('div');
    negativeTabIndex.tabIndex = -2;
    firstSurface.element.append(anchor, hiddenInput, disabledButton, negativeTabIndex);

    const first = registerOverlay({
      kind: 'modal',
      getContentElement: () => firstSurface.element,
      containFocus: true,
      onDismiss: vi.fn()
    });
    const second = registerOverlay({
      kind: 'modal',
      getContentElement: () => secondSurface.element,
      dismissOnPointerOutside: true,
      onDismiss: vi.fn()
    });

    anchor.dispatchEvent(new Event('pointerdown', { bubbles: true, cancelable: true }));
    vi.runAllTimers();
    await Promise.resolve();
    expect(document.activeElement).toBe(anchor);

    hiddenInput.dispatchEvent(new Event('pointerdown', { bubbles: true, cancelable: true }));
    vi.runAllTimers();
    await Promise.resolve();
    expect(document.activeElement).toBe(firstSurface.element);

    disabledButton.dispatchEvent(new Event('pointerdown', { bubbles: true, cancelable: true }));
    vi.runAllTimers();
    await Promise.resolve();
    expect(document.activeElement).toBe(firstSurface.element);

    negativeTabIndex.dispatchEvent(new Event('pointerdown', { bubbles: true, cancelable: true }));
    vi.runAllTimers();
    await Promise.resolve();
    expect(document.activeElement).toBe(firstSurface.element);

    anchor.dispatchEvent(new Event('pointerdown', { bubbles: true, cancelable: true }));
    anchor.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    await Promise.resolve();
    await Promise.resolve();
    expect(document.activeElement).toBe(anchor);

    first.unregister();
    second.unregister();
  });

  it('covers focus-outside scheduling for dismissing and containing overlays', async () => {
    const listeners = new Map<string, EventListener>();
    const originalAddEventListener = document.addEventListener.bind(document);
    const addEventListenerSpy = vi
      .spyOn(document, 'addEventListener')
      .mockImplementation(((type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) => {
        listeners.set(type, listener as EventListener);
        originalAddEventListener(type, listener, options);
      }) as typeof document.addEventListener);

    const firstSurface = createSurface();
    const secondSurface = createSurface();
    const outside = document.createElement('button');
    document.body.append(outside);

    const second = {
      value: undefined as ReturnType<typeof registerOverlay> | undefined
    };

    const first = registerOverlay({
      kind: 'modal',
      getContentElement: () => firstSurface.element,
      containFocus: true,
      onDismiss: vi.fn()
    });
    second.value = registerOverlay({
      kind: 'modal',
      getContentElement: () => secondSurface.element,
      dismissOnFocusOutside: true,
      onDismiss: () => {
        second.value?.unregister();
      }
    });

    const focusInListener = listeners.get('focusin') as ((event: FocusEvent) => void) | undefined;
    focusInListener?.({ target: outside } as FocusEvent);
    await Promise.resolve();
    await Promise.resolve();

    expect(firstSurface.element.contains(document.activeElement)).toBe(true);

    second.value = registerOverlay({
      kind: 'modal',
      getContentElement: () => secondSurface.element,
      containFocus: true,
      onDismiss: vi.fn()
    });

    focusInListener?.({ target: outside } as FocusEvent);
    await Promise.resolve();
    await Promise.resolve();

    expect(secondSurface.element.contains(document.activeElement)).toBe(true);

    first.unregister();
    second.value?.unregister();
    addEventListenerSpy.mockRestore();
  });

  it('covers disconnected restore guards and null content focus-trap branches', async () => {
    const listeners = new Map<string, EventListener>();
    const originalAddEventListener = document.addEventListener.bind(document);
    const addEventListenerSpy = vi
      .spyOn(document, 'addEventListener')
      .mockImplementation(((type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) => {
        listeners.set(type, listener as EventListener);
        originalAddEventListener(type, listener, options);
      }) as typeof document.addEventListener);

    const firstSurface = createSurface();
    const secondSurface = createSurface();
    const first = registerOverlay({
      kind: 'modal',
      getContentElement: () => firstSurface.element,
      containFocus: true,
      onDismiss: vi.fn()
    });
    const second = registerOverlay({
      kind: 'modal',
      getContentElement: () => secondSurface.element,
      dismissOnPointerOutside: true,
      onDismiss: vi.fn()
    });

    const pointerdownListener = listeners.get('pointerdown') as ((event: PointerEvent) => void) | undefined;
    const clickListener = listeners.get('click') as ((event: MouseEvent) => void) | undefined;
    const keydownListener = listeners.get('keydown') as ((event: KeyboardEvent) => void) | undefined;

    pointerdownListener?.({
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
      target: firstSurface.first
    } as unknown as PointerEvent);
    firstSurface.first.remove();
    vi.runAllTimers();
    await Promise.resolve();

    const replacementTarget = document.createElement('button');
    firstSurface.element.append(replacementTarget);
    pointerdownListener?.({
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
      target: replacementTarget
    } as unknown as PointerEvent);
    replacementTarget.remove();
    clickListener?.({
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
      target: replacementTarget
    } as unknown as MouseEvent);
    await Promise.resolve();

    const emptyRegistration = registerOverlay({
      kind: 'modal',
      getContentElement: () => null,
      containFocus: true,
      onDismiss: vi.fn()
    });

    keydownListener?.({
      defaultPrevented: false,
      key: 'Tab',
      preventDefault: vi.fn()
    } as unknown as KeyboardEvent);

    emptyRegistration.unregister();
    first.unregister();
    second.unregister();
    addEventListenerSpy.mockRestore();
  });

  it('covers direct focus-listener microtask branches for dismissing and containing overlays', async () => {
    const listeners = new Map<string, EventListener>();
    const originalAddEventListener = document.addEventListener.bind(document);
    const addEventListenerSpy = vi
      .spyOn(document, 'addEventListener')
      .mockImplementation(((type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) => {
        listeners.set(type, listener as EventListener);
        originalAddEventListener(type, listener, options);
      }) as typeof document.addEventListener);

    const firstSurface = createSurface();
    const secondSurface = createSurface();
    const outside = document.createElement('button');
    document.body.append(outside);

    const second = {
      value: undefined as ReturnType<typeof registerOverlay> | undefined
    };

    const first = registerOverlay({
      kind: 'modal',
      getContentElement: () => firstSurface.element,
      containFocus: true,
      onDismiss: vi.fn()
    });
    second.value = registerOverlay({
      kind: 'modal',
      getContentElement: () => secondSurface.element,
      dismissOnFocusOutside: true,
      onDismiss: () => {
        second.value?.unregister();
      }
    });

    const focusinListener = listeners.get('focusin') as ((event: FocusEvent) => void) | undefined;
    focusinListener?.({ target: outside } as FocusEvent);
    await Promise.resolve();
    await Promise.resolve();
    expect(firstSurface.element.contains(document.activeElement)).toBe(true);

    second.value = registerOverlay({
      kind: 'modal',
      getContentElement: () => secondSurface.element,
      containFocus: true,
      onDismiss: vi.fn()
    });

    focusinListener?.({ target: outside } as FocusEvent);
    await Promise.resolve();
    await Promise.resolve();
    expect(secondSurface.element.contains(document.activeElement)).toBe(true);

    first.unregister();
    second.value?.unregister();
    addEventListenerSpy.mockRestore();
  });

  it('covers queued focus guard branches after overlay dismissal and containment changes', async () => {
    const firstSurface = createSurface();
    const secondSurface = createSurface();
    const outside = document.createElement('button');
    document.body.append(outside);

    const first = registerOverlay({
      kind: 'modal',
      getContentElement: () => firstSurface.element,
      containFocus: true,
      onDismiss: vi.fn()
    });
    const second = registerOverlay({
      kind: 'modal',
      getContentElement: () => secondSurface.element,
      dismissOnFocusOutside: true,
      onDismiss: vi.fn()
    });

    second.unregister();
    outside.focus();
    outside.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    await Promise.resolve();
    await Promise.resolve();

    const third = registerOverlay({
      kind: 'modal',
      getContentElement: () => secondSurface.element,
      dismissOnFocusOutside: true,
      onDismiss: () => {
        outside.remove();
        firstSurface.element.append(outside);
      }
    });

    outside.focus();
    outside.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    await Promise.resolve();
    await Promise.resolve();

    third.unregister();
    const containFocusOnly = registerOverlay({
      kind: 'modal',
      getContentElement: () => secondSurface.element,
      containFocus: true,
      onDismiss: vi.fn()
    });

    outside.focus();
    outside.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    containFocusOnly.unregister();
    await Promise.resolve();

    first.unregister();
  });

  it('covers resolveFocusableTarget branches for non-HTMLElement nodes and null parents', async () => {
    const listeners = new Map<string, EventListener>();
    const originalAddEventListener = document.addEventListener.bind(document);
    const addEventListenerSpy = vi
      .spyOn(document, 'addEventListener')
      .mockImplementation(((type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) => {
        listeners.set(type, listener as EventListener);
        originalAddEventListener(type, listener, options);
      }) as typeof document.addEventListener);

    const firstSurface = createSurface();
    const secondSurface = createSurface();
    const anchor = document.createElement('a');
    anchor.href = '#focusable-parent';
    anchor.textContent = 'parent';
    const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    anchor.append(icon);
    firstSurface.element.append(anchor);

    const first = registerOverlay({
      kind: 'modal',
      getContentElement: () => firstSurface.element,
      containFocus: true,
      onDismiss: vi.fn()
    });
    const second = registerOverlay({
      kind: 'modal',
      getContentElement: () => secondSurface.element,
      dismissOnPointerOutside: true,
      onDismiss: vi.fn()
    });

    const pointerdownListener = listeners.get('pointerdown') as ((event: PointerEvent) => void) | undefined;
    const clickListener = listeners.get('click') as ((event: MouseEvent) => void) | undefined;

    pointerdownListener?.({ preventDefault() {}, stopPropagation() {}, target: icon } as unknown as PointerEvent);
    clickListener?.({ preventDefault() {}, stopPropagation() {}, target: anchor } as unknown as MouseEvent);
    await Promise.resolve();
    expect(document.activeElement).toBe(anchor);

    pointerdownListener?.({ preventDefault() {}, stopPropagation() {}, target: document.createTextNode('outside') } as unknown as PointerEvent);
    clickListener?.({ preventDefault() {}, stopPropagation() {}, target: document.createElement('div') } as unknown as MouseEvent);

    first.unregister();
    second.unregister();
    addEventListenerSpy.mockRestore();
  });
});
