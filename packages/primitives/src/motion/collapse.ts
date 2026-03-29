import {
  prefersReducedMotion,
  resolveCollapseMotionPreset,
} from './runtime';

interface CollapseMotionOptions {
  phase: "enter" | "leave";
  preset?: string;
}

function clearCollapseStyles(element: HTMLElement): void {
  element.style.removeProperty("height");
  element.style.removeProperty("opacity");
  element.style.removeProperty("overflow");
  element.style.removeProperty("transition");
}

function waitForTransitionEnd(
  element: HTMLElement,
  durationMs: number,
  done: () => void,
): void {
  let finished = false;

  const finish = () => {
    if (finished) return;
    finished = true;
    element.removeEventListener("transitionend", onTransitionEnd);
    done();
  };

  const onTransitionEnd = (event: TransitionEvent) => {
    if (event.target !== element || event.propertyName !== "height") {
      return;
    }

    finish();
  };

  element.addEventListener("transitionend", onTransitionEnd);
  window.setTimeout(finish, durationMs + 80);
}

function readDurationMs(tokenName: string, element: HTMLElement): number {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return 0;
  }

  const raw =
    window.getComputedStyle(element).getPropertyValue(tokenName).trim() ||
    window.getComputedStyle(document.documentElement).getPropertyValue(tokenName).trim();

  if (!raw.endsWith("ms")) {
    return Number.parseFloat(raw) || 0;
  }

  return Number.parseFloat(raw) || 0;
}

export function beforeCollapseMotion(
  element: HTMLElement,
  options: CollapseMotionOptions,
): void {
  if (prefersReducedMotion()) {
    return;
  }

  if (options.phase === "enter") {
    element.style.height = "0px";
    element.style.opacity = "0";
  } else {
    element.style.height = `${element.scrollHeight}px`;
    element.style.opacity = "1";
  }

  element.style.overflow = "hidden";
}

export function runCollapseMotion(
  element: HTMLElement,
  options: CollapseMotionOptions,
  done: () => void,
): void {
  if (prefersReducedMotion()) {
    done();
    return;
  }

  const preset = resolveCollapseMotionPreset(options.preset, "collapse-y-soft");
  const durationMs = readDurationMs(preset.durationToken, element);
  const easing = `var(${preset.easingToken})`;
  const opacityDurationMs = Math.max(Math.round(durationMs * 0.8), 1);

  if (options.phase === "leave") {
    void element.offsetHeight;
  }

  element.style.transition = [
    `height var(${preset.durationToken}) ${easing}`,
    `opacity ${opacityDurationMs}ms ${easing}`,
  ].join(", ");

  requestAnimationFrame(() => {
    element.style.height =
      options.phase === "enter" ? `${element.scrollHeight}px` : "0px";
    element.style.opacity = options.phase === "enter" ? "1" : "0";
  });

  waitForTransitionEnd(element, durationMs, done);
}

export function afterCollapseMotion(element: HTMLElement): void {
  clearCollapseStyles(element);
}
