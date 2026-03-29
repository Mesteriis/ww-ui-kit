import { prefersReducedMotion, resolveCollapseMotionPreset } from './runtime';

interface CollapseMotionOptions {
  phase: 'enter' | 'leave';
  preset?: string;
}

function clearCollapseStyles(element: HTMLElement): void {
  element.style.removeProperty('height');
  element.style.removeProperty('opacity');
  element.style.removeProperty('overflow');
  element.style.removeProperty('transition');
}

function parseTimeMs(rawValue: string): number {
  const value = rawValue.trim();
  if (!value) {
    return 0;
  }

  if (value.endsWith('ms')) {
    return Number.parseFloat(value) || 0;
  }

  if (value.endsWith('s')) {
    return (Number.parseFloat(value) || 0) * 1000;
  }

  return Number.parseFloat(value) || 0;
}

function readTransitionListMs(rawValue: string): number[] {
  return rawValue
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)
    .map((value) => parseTimeMs(value))
    .filter((value) => Number.isFinite(value) && value >= 0);
}

function readLongestTransitionMs(element: HTMLElement, fallbackMs: number): number {
  const computedStyle = window.getComputedStyle(element);
  const durations = readTransitionListMs(computedStyle.transitionDuration);
  const delays = readTransitionListMs(computedStyle.transitionDelay);
  const transitionCount = Math.max(durations.length, delays.length);

  if (transitionCount === 0) {
    return fallbackMs;
  }

  let longestTransitionMs = fallbackMs;

  for (let index = 0; index < transitionCount; index += 1) {
    const durationMs = durations[index] ?? durations[durations.length - 1] ?? fallbackMs;
    const delayMs = delays[index] ?? delays[delays.length - 1] ?? 0;
    longestTransitionMs = Math.max(longestTransitionMs, durationMs + delayMs);
  }

  return longestTransitionMs;
}

export const __collapseTestUtils = {
  parseTimeMs,
  readLongestTransitionMs,
  readTransitionListMs,
  waitForTransitionEnd,
};

function waitForTransitionEnd(element: HTMLElement, done: () => void) {
  let finished = false;
  let timeoutId: number | null = null;

  const finish = () => {
    /* istanbul ignore next -- transitionend and timeout completion can race in real browsers. */
    if (finished) return;
    finished = true;
    if (timeoutId !== null) {
      window.clearTimeout(timeoutId);
    }
    element.removeEventListener('transitionend', onTransitionEnd);
    done();
  };

  const onTransitionEnd = (event: TransitionEvent) => {
    if (event.target !== element || event.propertyName !== 'height') {
      return;
    }

    finish();
  };

  element.addEventListener('transitionend', onTransitionEnd);
  return (fallbackMs: number) => {
    timeoutId = window.setTimeout(finish, fallbackMs);
  };
}

function readDurationMs(tokenName: string, element: HTMLElement): number {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return 0;
  }

  const raw =
    window.getComputedStyle(element).getPropertyValue(tokenName).trim() ||
    window.getComputedStyle(document.documentElement).getPropertyValue(tokenName).trim();

  return parseTimeMs(raw);
}

export function beforeCollapseMotion(element: HTMLElement, options: CollapseMotionOptions): void {
  if (prefersReducedMotion()) {
    return;
  }

  if (options.phase === 'enter') {
    element.style.height = '0px';
    element.style.opacity = '0';
  } else {
    element.style.height = `${element.scrollHeight}px`;
    element.style.opacity = '1';
  }

  element.style.overflow = 'hidden';
}

export function runCollapseMotion(
  element: HTMLElement,
  options: CollapseMotionOptions,
  done: () => void
): void {
  if (prefersReducedMotion()) {
    done();
    return;
  }

  const preset = resolveCollapseMotionPreset(options.preset, 'collapse-y-soft');
  const durationMs = readDurationMs(preset.durationToken, element);
  const easing = `var(${preset.easingToken})`;
  const opacityDurationMs = Math.max(Math.round(durationMs * 0.8), 1);
  const scheduleTransitionFallback = waitForTransitionEnd(element, done);

  if (options.phase === 'leave') {
    void element.offsetHeight;
  }

  element.style.transition = [
    `height var(${preset.durationToken}) ${easing}`,
    `opacity ${opacityDurationMs}ms ${easing}`,
  ].join(', ');

  const applyTransition = () => {
    element.style.height = options.phase === 'enter' ? `${element.scrollHeight}px` : '0px';
    element.style.opacity = options.phase === 'enter' ? '1' : '0';
    scheduleTransitionFallback(readLongestTransitionMs(element, durationMs));
  };

  if (typeof requestAnimationFrame === 'function') {
    requestAnimationFrame(() => {
      applyTransition();
    });
    return;
  }

  applyTransition();
}

export function afterCollapseMotion(element: HTMLElement): void {
  clearCollapseStyles(element);
}
