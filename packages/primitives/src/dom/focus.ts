const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  "input:not([disabled]):not([type='hidden'])",
  'select:not([disabled])',
  'textarea:not([disabled])',
  "[tabindex]:not([tabindex='-1'])",
].join(', ');

function isSequentiallyFocusableElement(element: HTMLElement): boolean {
  if (element.hidden) return false;
  if (element.getAttribute('aria-hidden') === 'true') return false;
  if (!isProgrammaticallyFocusableElement(element)) {
    return false;
  }

  const style = window.getComputedStyle(element);
  return style.display !== 'none' && style.visibility !== 'hidden';
}

export function isProgrammaticallyFocusableElement(element: HTMLElement): boolean {
  if ('disabled' in element && Boolean(element.disabled)) {
    return false;
  }

  const tabIndex = element.getAttribute('tabindex');
  if (tabIndex !== null) {
    return Number(tabIndex) >= -1;
  }

  const tagName = element.tagName.toLowerCase();
  if (
    tagName === 'button' ||
    tagName === 'select' ||
    tagName === 'textarea' ||
    tagName === 'summary'
  ) {
    return true;
  }

  if (tagName === 'a' && Boolean(element.getAttribute('href'))) {
    return true;
  }

  if (tagName === 'input') {
    return (element as HTMLInputElement).type !== 'hidden';
  }

  const contentEditable = element.getAttribute('contenteditable');
  return contentEditable === '' || contentEditable === 'true';
}

export function getFocusableElements(container: ParentNode): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    isSequentiallyFocusableElement
  );
}

export function focusFirstElement(container: ParentNode): boolean {
  const firstElement = getFocusableElements(container)[0];
  if (!firstElement) return false;
  firstElement.focus();
  return true;
}

export function trapFocusWithin(event: KeyboardEvent, container: HTMLElement): boolean {
  if (event.key !== 'Tab') return false;

  const focusableElements = getFocusableElements(container);
  if (!focusableElements.length) {
    event.preventDefault();
    container.focus();
    return true;
  }

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  const activeElement = document.activeElement as HTMLElement | null;
  const focusInsideContainer = Boolean(activeElement && container.contains(activeElement));

  if (event.shiftKey) {
    if (!focusInsideContainer || activeElement === firstElement) {
      event.preventDefault();
      lastElement?.focus();
      return true;
    }
    return false;
  }

  if (!focusInsideContainer || activeElement === lastElement) {
    event.preventDefault();
    firstElement?.focus();
    return true;
  }

  return false;
}
