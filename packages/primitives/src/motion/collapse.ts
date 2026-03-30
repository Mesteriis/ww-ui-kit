import { prefersReducedMotion, resolveCollapseMotionPreset } from './runtime';

interface CollapseMotionOptions {
  phase: 'enter' | 'leave';
  preset?: string;
}

// Mirrors the canonical semantic fallback when a theme does not override the collapse opacity ratio.
const DEFAULT_COLLAPSE_OPACITY_DURATION_FACTOR = 0.8;
const collapseMeasurements = new WeakMap<HTMLElement, { expandedHeight: number }>();

function clearCollapseStyles(element: HTMLElement): void {
  element.style.removeProperty('height');
  element.style.removeProperty('opacity');
  element.style.removeProperty('overflow');
  element.style.removeProperty('transition');
  collapseMeasurements.delete(element);
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

function parseNumber(rawValue: string): number | null {
  const trimmed = rawValue.trim();
  if (!trimmed) {
    return null;
  }

  const value = Number.parseFloat(trimmed);
  return Number.isFinite(value) ? value : null;
}

function readCollapseOpacityDurationFactor(element: HTMLElement): number {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return DEFAULT_COLLAPSE_OPACITY_DURATION_FACTOR;
  }

  const tokenName = '--ui-motion-collapse-opacity-duration-factor';
  const raw =
    window.getComputedStyle(element).getPropertyValue(tokenName).trim() ||
    window.getComputedStyle(document.documentElement).getPropertyValue(tokenName).trim();
  const factor = parseNumber(raw);

  if (factor === null || factor <= 0) {
    return DEFAULT_COLLAPSE_OPACITY_DURATION_FACTOR;
  }

  return Math.min(factor, 1);
}

function rememberCollapseMeasurement(element: HTMLElement): number {
  const expandedHeight = element.scrollHeight;
  collapseMeasurements.set(element, { expandedHeight });
  return expandedHeight;
}

function readCollapseMeasurement(element: HTMLElement): number {
  return collapseMeasurements.get(element)?.expandedHeight ?? rememberCollapseMeasurement(element);
}

export function beforeCollapseMotion(element: HTMLElement, options: CollapseMotionOptions): void {
  if (prefersReducedMotion()) {
    return;
  }

  const expandedHeight = rememberCollapseMeasurement(element);

  if (options.phase === 'enter') {
    element.style.height = '0px';
    element.style.opacity = '0';
  } else {
    element.style.height = `${expandedHeight}px`;
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
  const opacityDurationMs = Math.max(
    Math.round(durationMs * readCollapseOpacityDurationFactor(element)),
    1
  );
  const expandedHeight = readCollapseMeasurement(element);
  const scheduleTransitionFallback = waitForTransitionEnd(element, done);

  element.style.transition = [
    `height var(${preset.durationToken}) ${easing}`,
    `opacity ${opacityDurationMs}ms ${easing}`,
  ].join(', ');

  const applyTransition = () => {
    element.style.height = options.phase === 'enter' ? `${expandedHeight}px` : '0px';
    element.style.opacity = options.phase === 'enter' ? '1' : '0';
    scheduleTransitionFallback(
      readLongestTransitionMs(element, Math.max(durationMs, opacityDurationMs))
    );
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
