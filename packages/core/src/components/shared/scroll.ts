export type UiScrollTarget = string | HTMLElement | null | undefined;

function isWindowTarget(value: HTMLElement | Window | null): value is Window {
  return typeof window !== 'undefined' && value === window;
}

export function resolveScrollTarget(target: UiScrollTarget): HTMLElement | Window | null {
  if (typeof window === 'undefined') {
    return null;
  }

  if (!target) {
    return window;
  }

  if (typeof target === 'string') {
    return document.querySelector<HTMLElement>(target);
  }

  return target;
}

export function getScrollTop(target: HTMLElement | Window | null) {
  if (!target) {
    return 0;
  }

  if (isWindowTarget(target)) {
    return Math.max(window.scrollY, document.documentElement.scrollTop, document.body.scrollTop, 0);
  }

  return target.scrollTop;
}

export function isScrollTargetAtEnd(target: HTMLElement | Window | null) {
  if (!target) {
    return false;
  }

  if (isWindowTarget(target)) {
    const scrollHeight = Math.max(
      document.documentElement.scrollHeight,
      document.body.scrollHeight
    );
    return getScrollTop(target) + window.innerHeight >= scrollHeight - 1;
  }

  return target.scrollTop + target.clientHeight >= target.scrollHeight - 1;
}

export function getTargetClientRect(target: HTMLElement | Window | null) {
  if (isWindowTarget(target)) {
    return {
      top: 0,
      right: window.innerWidth,
      bottom: window.innerHeight,
      left: 0,
      width: window.innerWidth,
      height: window.innerHeight,
      x: 0,
      y: 0,
      toJSON() {
        return this;
      },
    };
  }

  return target ? target.getBoundingClientRect() : null;
}

export function resolveLength(value: number | string | undefined) {
  if (value === undefined || value === null) {
    return undefined;
  }

  return typeof value === 'number' ? `${value}px` : value;
}

export function resolveAnchorElement(href: string) {
  if (typeof document === 'undefined') {
    return null;
  }

  if (!href) {
    return null;
  }

  if (href.startsWith('#')) {
    const id = href.slice(1);
    return document.getElementById(id) ?? document.querySelector(href);
  }

  try {
    return document.querySelector(href);
  } catch {
    return null;
  }
}

export function getScrollOffsetForElement(
  target: HTMLElement | Window | null,
  element: HTMLElement,
  offset = 0
) {
  const targetScrollTop = getScrollTop(target);
  const elementTop = element.getBoundingClientRect().top;

  if (isWindowTarget(target) || !target) {
    return Math.max(0, targetScrollTop + elementTop - offset);
  }

  const targetRect = target.getBoundingClientRect();
  return Math.max(0, targetScrollTop + (elementTop - targetRect.top) - offset);
}

export function scrollTargetTo(
  target: HTMLElement | Window | null,
  options: Pick<ScrollToOptions, 'behavior' | 'left' | 'top'>
) {
  if (!target) {
    return;
  }

  const payload = {
    behavior: options.behavior ?? 'auto',
    left: options.left ?? 0,
    top: options.top ?? 0,
  } satisfies ScrollToOptions;

  if (isWindowTarget(target)) {
    window.scrollTo(payload);
    return;
  }

  target.scrollTo(payload);
}
