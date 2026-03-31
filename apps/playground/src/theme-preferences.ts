import {
  THEME_DENSITIES,
  THEME_MOTION_PROFILES,
  THEME_NAMES,
  THEME_PERSONALITIES,
  THEME_TYPES,
  getThemeType,
  type ThemeDensity,
  type ThemeMotionProfile,
  type ThemeName,
  type ThemePersonality,
  type ThemeType,
} from '@ww/themes';

const themeNameSet = new Set<string>(THEME_NAMES);
const themeTypeSet = new Set<string>(THEME_TYPES);
const themeDensitySet = new Set<string>(THEME_DENSITIES);
const themeMotionProfileSet = new Set<string>(THEME_MOTION_PROFILES);
const themePersonalitySet = new Set<string>(THEME_PERSONALITIES);

export const PLAYGROUND_THEME_PREFERENCES_STORAGE_KEY = 'ww-playground.theme-preferences.v1';

export interface PlaygroundThemePreferences {
  themeName: ThemeName;
  themeFilter: ThemeType | 'all';
  density: ThemeDensity;
  motionProfile: ThemeMotionProfile;
  personality: ThemePersonality;
}

export const DEFAULT_PLAYGROUND_THEME_PREFERENCES = Object.freeze<PlaygroundThemePreferences>({
  themeName: 'belovodye',
  themeFilter: 'all',
  density: 'default',
  motionProfile: 'balanced',
  personality: 'neutral',
});

function resolveStorage(storage?: Storage | null): Storage | null {
  if (storage) {
    return storage;
  }

  if (typeof window === 'undefined') {
    return null;
  }

  return window.localStorage;
}

function isThemeName(value: string | null | undefined): value is ThemeName {
  return Boolean(value && themeNameSet.has(value));
}

function isThemeType(value: string | null | undefined): value is ThemeType {
  return Boolean(value && themeTypeSet.has(value));
}

function isThemeDensity(value: string | null | undefined): value is ThemeDensity {
  return Boolean(value && themeDensitySet.has(value));
}

function isThemeMotionProfile(value: string | null | undefined): value is ThemeMotionProfile {
  return Boolean(value && themeMotionProfileSet.has(value));
}

function isThemePersonality(value: string | null | undefined): value is ThemePersonality {
  return Boolean(value && themePersonalitySet.has(value));
}

export function normalizePlaygroundThemePreferences(
  preferences: Partial<PlaygroundThemePreferences>
): PlaygroundThemePreferences {
  const themeName = isThemeName(preferences.themeName)
    ? preferences.themeName
    : DEFAULT_PLAYGROUND_THEME_PREFERENCES.themeName;
  const themeType = getThemeType(themeName);
  const requestedThemeFilter =
    preferences.themeFilter === 'all'
      ? 'all'
      : isThemeType(preferences.themeFilter)
        ? preferences.themeFilter
        : null;

  return {
    themeName,
    themeFilter:
      requestedThemeFilter === null
        ? DEFAULT_PLAYGROUND_THEME_PREFERENCES.themeFilter
        : requestedThemeFilter === 'all' || requestedThemeFilter === themeType
          ? requestedThemeFilter
          : themeType,
    density: isThemeDensity(preferences.density)
      ? preferences.density
      : DEFAULT_PLAYGROUND_THEME_PREFERENCES.density,
    motionProfile: isThemeMotionProfile(preferences.motionProfile)
      ? preferences.motionProfile
      : DEFAULT_PLAYGROUND_THEME_PREFERENCES.motionProfile,
    personality: isThemePersonality(preferences.personality)
      ? preferences.personality
      : DEFAULT_PLAYGROUND_THEME_PREFERENCES.personality,
  };
}

export function readPlaygroundThemePreferences(
  storage?: Storage | null
): PlaygroundThemePreferences {
  const resolvedStorage = resolveStorage(storage);
  if (!resolvedStorage) {
    return { ...DEFAULT_PLAYGROUND_THEME_PREFERENCES };
  }

  try {
    const rawValue = resolvedStorage.getItem(PLAYGROUND_THEME_PREFERENCES_STORAGE_KEY);
    if (!rawValue) {
      return { ...DEFAULT_PLAYGROUND_THEME_PREFERENCES };
    }

    return normalizePlaygroundThemePreferences(
      JSON.parse(rawValue) as Partial<PlaygroundThemePreferences>
    );
  } catch {
    return { ...DEFAULT_PLAYGROUND_THEME_PREFERENCES };
  }
}

export function writePlaygroundThemePreferences(
  preferences: PlaygroundThemePreferences,
  storage?: Storage | null
): void {
  const resolvedStorage = resolveStorage(storage);
  if (!resolvedStorage) {
    return;
  }

  try {
    resolvedStorage.setItem(
      PLAYGROUND_THEME_PREFERENCES_STORAGE_KEY,
      JSON.stringify(normalizePlaygroundThemePreferences(preferences))
    );
  } catch {
    // Storage access can fail in private browsing or locked-down environments.
  }
}
