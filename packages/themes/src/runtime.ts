import {
  THEME_DENSITIES,
  THEME_MOTION_PROFILES,
  THEME_NAMES,
  THEME_PERSONALITIES,
  THEME_TYPES,
  getThemeRuntimeDefaults,
  getThemeType,
  type ThemeDensity,
  type ThemeMotionProfile,
  type ThemeName,
  type ThemePersonality,
  type ThemeType,
} from './theme-maps';
import {
  THEME_ATTRIBUTE,
  THEME_DENSITY_ATTRIBUTE,
  THEME_MOTION_PROFILE_ATTRIBUTE,
  THEME_PERSONALITY_ATTRIBUTE,
  THEME_TYPE_ATTRIBUTE,
} from './create-theme-sheet';

const themeNameSet = new Set<string>(THEME_NAMES);
const themeTypeSet = new Set<string>(THEME_TYPES);
const themeDensitySet = new Set<string>(THEME_DENSITIES);
const themeMotionProfileSet = new Set<string>(THEME_MOTION_PROFILES);
const themePersonalitySet = new Set<string>(THEME_PERSONALITIES);

const THEME_RUNTIME_ATTRIBUTES = [
  THEME_ATTRIBUTE,
  THEME_TYPE_ATTRIBUTE,
  THEME_DENSITY_ATTRIBUTE,
  THEME_MOTION_PROFILE_ATTRIBUTE,
  THEME_PERSONALITY_ATTRIBUTE,
] as const;

export interface ThemeRuntimeState {
  container: HTMLElement | null;
  density: ThemeDensity;
  motionProfile: ThemeMotionProfile;
  personality: ThemePersonality;
  themeName: ThemeName;
  themeType: ThemeType;
}

export interface ThemeRuntimePatch {
  density?: ThemeDensity;
  motionProfile?: ThemeMotionProfile;
  personality?: ThemePersonality;
  themeName?: ThemeName;
}

export type ThemeRuntimeListener = (state: ThemeRuntimeState) => void;

function isThemeName(value: string | null): value is ThemeName {
  return Boolean(value && themeNameSet.has(value));
}

function isThemeType(value: string | null): value is ThemeType {
  return Boolean(value && themeTypeSet.has(value));
}

function isThemeDensity(value: string | null): value is ThemeDensity {
  return Boolean(value && themeDensitySet.has(value));
}

function isThemeMotionProfile(value: string | null): value is ThemeMotionProfile {
  return Boolean(value && themeMotionProfileSet.has(value));
}

function isThemePersonality(value: string | null): value is ThemePersonality {
  return Boolean(value && themePersonalitySet.has(value));
}

function resolveThemeTarget(target?: HTMLElement | null): HTMLElement | null {
  if (target) {
    return target;
  }

  if (typeof document === 'undefined') {
    return null;
  }

  return document.documentElement;
}

function findThemeRuntimeContainer(source?: HTMLElement | null): HTMLElement | null {
  if (typeof document === 'undefined') {
    return null;
  }

  let current = source ?? null;

  while (current) {
    const currentElement = current;
    if (
      THEME_RUNTIME_ATTRIBUTES.some((attributeName) => currentElement.hasAttribute(attributeName))
    ) {
      return current;
    }

    current = current.parentElement;
  }

  return document.documentElement;
}

function setOptionalAttribute(
  target: HTMLElement,
  attributeName: string,
  value: string,
  defaultValue: string
): void {
  if (value === defaultValue) {
    target.removeAttribute(attributeName);
    return;
  }

  target.setAttribute(attributeName, value);
}

export function readThemeRuntime(source?: HTMLElement | null): ThemeRuntimeState {
  const container = findThemeRuntimeContainer(source);
  const rawThemeName = container?.getAttribute(THEME_ATTRIBUTE) ?? null;
  const themeName = isThemeName(rawThemeName) ? rawThemeName : 'light';
  const runtimeDefaults = getThemeRuntimeDefaults(themeName);
  const rawThemeType = container?.getAttribute(THEME_TYPE_ATTRIBUTE) ?? null;
  const rawDensity = container?.getAttribute(THEME_DENSITY_ATTRIBUTE) ?? null;
  const rawMotionProfile = container?.getAttribute(THEME_MOTION_PROFILE_ATTRIBUTE) ?? null;
  const rawPersonality = container?.getAttribute(THEME_PERSONALITY_ATTRIBUTE) ?? null;

  return {
    container,
    density: isThemeDensity(rawDensity) ? rawDensity : runtimeDefaults.density,
    motionProfile: isThemeMotionProfile(rawMotionProfile)
      ? rawMotionProfile
      : runtimeDefaults.motionProfile,
    personality: isThemePersonality(rawPersonality) ? rawPersonality : runtimeDefaults.personality,
    themeName,
    themeType: isThemeType(rawThemeType) ? rawThemeType : getThemeType(themeName),
  };
}

export function patchThemeRuntime(
  patch: ThemeRuntimePatch,
  target?: HTMLElement | null
): HTMLElement | null {
  const resolvedTarget = resolveThemeTarget(target);
  if (!resolvedTarget) {
    return null;
  }

  const currentRuntime = readThemeRuntime(resolvedTarget);
  const themeName = patch.themeName ?? currentRuntime.themeName;
  const runtimeDefaults = getThemeRuntimeDefaults(themeName);
  const nextRuntime: ThemeRuntimeState = {
    container: resolvedTarget,
    density: patch.density ?? currentRuntime.density,
    motionProfile: patch.motionProfile ?? currentRuntime.motionProfile,
    personality: patch.personality ?? currentRuntime.personality,
    themeName,
    themeType: getThemeType(themeName),
  };

  resolvedTarget.setAttribute(THEME_ATTRIBUTE, nextRuntime.themeName);
  resolvedTarget.setAttribute(THEME_TYPE_ATTRIBUTE, nextRuntime.themeType);
  setOptionalAttribute(
    resolvedTarget,
    THEME_DENSITY_ATTRIBUTE,
    nextRuntime.density,
    runtimeDefaults.density
  );
  setOptionalAttribute(
    resolvedTarget,
    THEME_MOTION_PROFILE_ATTRIBUTE,
    nextRuntime.motionProfile,
    runtimeDefaults.motionProfile
  );
  setOptionalAttribute(
    resolvedTarget,
    THEME_PERSONALITY_ATTRIBUTE,
    nextRuntime.personality,
    runtimeDefaults.personality
  );

  return resolvedTarget;
}

export function setTheme(themeName: ThemeName, target?: HTMLElement | null) {
  return patchThemeRuntime({ themeName }, target);
}

export function observeThemeRuntime(
  source: HTMLElement | null | undefined,
  listener: ThemeRuntimeListener
): () => void {
  if (typeof document === 'undefined') {
    listener(readThemeRuntime(source));
    return () => undefined;
  }

  let observer: MutationObserver | null = null;
  let observedTargets: HTMLElement[] = [];
  let scheduled = false;

  const connectObserver = (state: ThemeRuntimeState) => {
    if (typeof MutationObserver === 'undefined') {
      return;
    }

    const nextTargets = Array.from(
      new Set(
        [document.documentElement, state.container]
          .filter((target): target is HTMLElement => Boolean(target))
          .filter(
            (target, index, targets) =>
              targets.findIndex((candidate) => candidate === target) === index
          )
      )
    );

    if (
      observer &&
      observedTargets.length === nextTargets.length &&
      observedTargets.every((target, index) => target === nextTargets[index])
    ) {
      return;
    }

    observer?.disconnect();
    observedTargets = nextTargets;
    observer = new MutationObserver(() => {
      if (scheduled) {
        return;
      }

      scheduled = true;
      const flush = () => {
        scheduled = false;
        emitState();
      };

      if (typeof queueMicrotask === 'function') {
        queueMicrotask(flush);
        return;
      }

      void Promise.resolve().then(flush);
    });

    for (const target of observedTargets) {
      observer.observe(target, {
        attributes: true,
        attributeFilter: [...THEME_RUNTIME_ATTRIBUTES],
      });
    }
  };

  const emitState = () => {
    const state = readThemeRuntime(source);
    listener(state);
    connectObserver(state);
  };

  emitState();

  return () => {
    observer?.disconnect();
    observer = null;
    observedTargets = [];
  };
}
