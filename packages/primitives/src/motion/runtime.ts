import {
  MOTION_PRESETS,
  type MotionCollapsePreset,
  type MotionPresetDefinition,
  type MotionPresetName,
  type MotionTransitionPreset,
} from './presets';

const warnedInvalidPresets = new Set<string>();
const MAX_REDUCED_PRESET_DEPTH = 8;

const NONE_TRANSITION_PRESET: MotionTransitionPreset = {
  antiUseCases: ['Reserved for reduced-motion and disabled animation paths.'],
  durationToken: '--ui-motion-duration-instant',
  easingToken: '--ui-motion-easing-linear',
  enter: {
    opacity: '1',
    transform: 'none',
  },
  family: 'enter',
  kind: 'transition',
  layer: 'component',
  leave: {
    opacity: '1',
    transform: 'none',
  },
  properties: 'opacity',
  reducedMotion: 'no motion',
  tier: 'A',
  useCases: ['Instant fallback when motion is disabled.'],
};

function warnInvalidPreset(preset: string, fallback: MotionPresetName): void {
  if (warnedInvalidPresets.has(preset) || typeof console === 'undefined') {
    return;
  }

  warnedInvalidPresets.add(preset);
  console.warn(`[ui-motion] Unknown motion preset "${preset}". Falling back to "${fallback}".`);
}

function warnReducedPresetFallback(preset: string): void {
  const warningKey = `reduced:${preset}`;
  if (warnedInvalidPresets.has(warningKey) || typeof console === 'undefined') {
    return;
  }

  warnedInvalidPresets.add(warningKey);
  console.warn(
    `[ui-motion] Reduced motion preset chain for "${preset}" is recursive or too deep. Falling back to "none".`
  );
}

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function resolveMotionPreset(
  preset: string | undefined,
  fallback: MotionPresetName = 'fade-in'
): MotionPresetDefinition {
  if (!preset) {
    return MOTION_PRESETS[fallback];
  }

  const resolved = MOTION_PRESETS[preset as MotionPresetName];
  if (resolved) {
    return resolved;
  }

  warnInvalidPreset(preset, fallback);
  return MOTION_PRESETS[fallback];
}

function resolveTransitionPresetInternal(
  preset: MotionTransitionPreset,
  visitedReducedPresets = new Set<string>()
): MotionTransitionPreset {
  if (!prefersReducedMotion()) {
    return preset;
  }

  if (preset.reducedPreset === 'none') {
    return NONE_TRANSITION_PRESET;
  }

  if (!preset.reducedPreset) {
    return preset;
  }

  if (
    visitedReducedPresets.size >= MAX_REDUCED_PRESET_DEPTH ||
    visitedReducedPresets.has(preset.reducedPreset)
  ) {
    warnReducedPresetFallback(preset.reducedPreset);
    return NONE_TRANSITION_PRESET;
  }

  const nextVisitedReducedPresets = new Set(visitedReducedPresets);
  nextVisitedReducedPresets.add(preset.reducedPreset);

  const reducedPreset = resolveMotionPreset(preset.reducedPreset, 'fade-in');
  if (reducedPreset.kind === 'transition') {
    return resolveTransitionPresetInternal(reducedPreset, nextVisitedReducedPresets);
  }

  return NONE_TRANSITION_PRESET;
}

export function resolveTransitionMotionPreset(
  preset: string | undefined,
  fallback: MotionPresetName = 'fade-in'
): MotionTransitionPreset {
  const resolved = resolveMotionPreset(preset, fallback);

  if (resolved.kind !== 'transition') {
    warnInvalidPreset(String(preset || resolved.kind), fallback);
    const fallbackPreset = MOTION_PRESETS[fallback];
    return resolveTransitionPresetInternal(
      fallbackPreset.kind === 'transition'
        ? fallbackPreset
        : (MOTION_PRESETS['fade-in'] as MotionTransitionPreset)
    );
  }

  return resolveTransitionPresetInternal(resolved);
}

export function resolveCollapseMotionPreset(
  preset: string | undefined,
  fallback: MotionPresetName = 'collapse-y-soft'
): MotionCollapsePreset {
  const resolved = resolveMotionPreset(preset, fallback);

  if (resolved.kind === 'collapse') {
    return resolved;
  }

  return MOTION_PRESETS[fallback] as MotionCollapsePreset;
}

function setVariable(element: HTMLElement, name: string, value: string | undefined): void {
  if (!value) {
    element.style.removeProperty(name);
    return;
  }

  element.style.setProperty(name, value);
}

export function clearTransitionMotionVariables(element: HTMLElement): void {
  const motionVariables = [
    '--ui-motion-clip-from',
    '--ui-motion-delay',
    '--ui-motion-duration',
    '--ui-motion-easing',
    '--ui-motion-filter-from',
    '--ui-motion-opacity-from',
    '--ui-motion-properties',
    '--ui-motion-transform-from',
  ];

  for (const variableName of motionVariables) {
    element.style.removeProperty(variableName);
  }
}

export function applyTransitionMotionVariables(
  element: HTMLElement,
  preset: MotionTransitionPreset,
  phase: 'enter' | 'leave',
  delayIndex = 0
): void {
  const stage = phase === 'enter' ? preset.enter : preset.leave;
  const delay =
    delayIndex > 0 && preset.staggerToken
      ? `calc(var(${preset.staggerToken}) * ${delayIndex})`
      : '0ms';

  setVariable(element, '--ui-motion-clip-from', stage.clipPath);
  setVariable(element, '--ui-motion-delay', delay);
  setVariable(element, '--ui-motion-duration', `var(${preset.durationToken})`);
  setVariable(element, '--ui-motion-easing', `var(${preset.easingToken})`);
  setVariable(element, '--ui-motion-filter-from', stage.filter);
  setVariable(element, '--ui-motion-opacity-from', stage.opacity);
  setVariable(element, '--ui-motion-properties', preset.properties);
  setVariable(element, '--ui-motion-transform-from', stage.transform);
}

export function createTransitionGroupMotionStyle(
  preset: MotionTransitionPreset
): Record<string, string> {
  return {
    '--ui-motion-duration': `var(${preset.durationToken})`,
    '--ui-motion-easing': `var(${preset.easingToken})`,
    '--ui-motion-move-duration': `var(${preset.moveDurationToken ?? preset.durationToken})`,
    '--ui-motion-move-easing': `var(${preset.moveEasingToken ?? preset.easingToken})`,
  };
}
