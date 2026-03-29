import { describe, expect, it } from 'vitest';

import { focusFirstElement, getFocusableElements, trapFocusWithin } from './focus';

const createButton = (id: string) => {
  const button = document.createElement('button');
  button.id = id;
  button.type = 'button';
  button.textContent = id;
  return button;
};

describe('focus helpers', () => {
  it('filters out hidden, disabled, and aria-hidden elements', () => {
    const container = document.createElement('div');

    const visible = createButton('visible');
    const hidden = createButton('hidden');
    hidden.hidden = true;

    const ariaHidden = createButton('aria-hidden');
    ariaHidden.setAttribute('aria-hidden', 'true');

    const disabled = createButton('disabled');
    disabled.disabled = true;

    const hiddenInput = document.createElement('input');
    hiddenInput.type = 'hidden';
    hiddenInput.tabIndex = 0;

    const displayNone = createButton('display-none');
    displayNone.style.display = 'none';

    const visibilityHidden = createButton('visibility-hidden');
    visibilityHidden.style.visibility = 'hidden';

    const disabledFocusable = createButton('disabled-focusable');
    disabledFocusable.disabled = true;
    disabledFocusable.tabIndex = 0;

    container.append(
      visible,
      hidden,
      ariaHidden,
      disabled,
      hiddenInput,
      displayNone,
      visibilityHidden,
      disabledFocusable
    );
    document.body.append(container);

    expect(getFocusableElements(container)).toEqual([visible]);

    container.remove();
  });

  it('focuses the first available element and reports when none exist', () => {
    const emptyContainer = document.createElement('div');
    expect(focusFirstElement(emptyContainer)).toBe(false);

    const container = document.createElement('div');
    const first = createButton('first');
    const second = createButton('second');
    container.append(first, second);
    document.body.append(container);

    expect(focusFirstElement(container)).toBe(true);
    expect(document.activeElement).toBe(first);

    container.remove();
  });

  it('traps Tab focus within the container and ignores unrelated keys', () => {
    const container = document.createElement('div');
    container.tabIndex = -1;
    const first = createButton('first');
    const middle = createButton('middle');
    const last = createButton('last');
    container.append(first, middle, last);
    document.body.append(container);

    const ignored = new KeyboardEvent('keydown', { key: 'Enter', cancelable: true });
    expect(trapFocusWithin(ignored, container)).toBe(false);

    first.focus();
    const shiftWrap = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, cancelable: true });
    expect(trapFocusWithin(shiftWrap, container)).toBe(true);
    expect(shiftWrap.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(last);

    last.focus();
    const forwardWrap = new KeyboardEvent('keydown', { key: 'Tab', cancelable: true });
    expect(trapFocusWithin(forwardWrap, container)).toBe(true);
    expect(forwardWrap.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(first);

    middle.focus();
    const passThrough = new KeyboardEvent('keydown', { key: 'Tab', cancelable: true });
    expect(trapFocusWithin(passThrough, container)).toBe(false);
    expect(passThrough.defaultPrevented).toBe(false);

    middle.focus();
    const shiftPassThrough = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, cancelable: true });
    expect(trapFocusWithin(shiftPassThrough, container)).toBe(false);
    expect(shiftPassThrough.defaultPrevented).toBe(false);

    const outside = createButton('outside');
    document.body.append(outside);
    outside.focus();
    const outsideShift = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, cancelable: true });
    expect(trapFocusWithin(outsideShift, container)).toBe(true);
    expect(document.activeElement).toBe(last);

    const noFocusables = document.createElement('div');
    noFocusables.tabIndex = -1;
    document.body.append(noFocusables);
    const noFocusableEvent = new KeyboardEvent('keydown', { key: 'Tab', cancelable: true });
    expect(trapFocusWithin(noFocusableEvent, noFocusables)).toBe(true);
    expect(noFocusableEvent.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(noFocusables);

    outside.remove();
    noFocusables.remove();
    container.remove();
  });
});
