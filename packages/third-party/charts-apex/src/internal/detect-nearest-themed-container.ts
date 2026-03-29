import {
  THEME_ATTRIBUTE,
  THEME_NAMES,
  THEME_TYPE_ATTRIBUTE,
  THEME_TYPES,
  getThemeType,
  type ThemeName,
  type ThemeType
} from '@ww/themes';

const themeNameSet = new Set<string>(THEME_NAMES);
const themeTypeSet = new Set<string>(THEME_TYPES);

export interface ResolvedApexThemeScope {
  container: HTMLElement | null;
  themeName: ThemeName;
  themeType: ThemeType;
}

function isThemeName(value: string | null): value is ThemeName {
  return Boolean(value && themeNameSet.has(value));
}

function isThemeType(value: string | null): value is ThemeType {
  return Boolean(value && themeTypeSet.has(value));
}

export function detectNearestThemedContainer(source?: HTMLElement | null): HTMLElement | null {
  if (typeof document === 'undefined') {
    return null;
  }

  let current = source;

  while (current) {
    if (current.hasAttribute(THEME_ATTRIBUTE) || current.hasAttribute(THEME_TYPE_ATTRIBUTE)) {
      return current;
    }

    current = current.parentElement;
  }

  return document.documentElement;
}

export function resolveApexThemeScope(source?: HTMLElement | null): ResolvedApexThemeScope {
  const container = detectNearestThemedContainer(source);
  const rawThemeName = container?.getAttribute(THEME_ATTRIBUTE) ?? null;
  const themeName = isThemeName(rawThemeName) ? rawThemeName : 'light';
  const rawThemeType = container?.getAttribute(THEME_TYPE_ATTRIBUTE) ?? null;
  const themeType = isThemeType(rawThemeType) ? rawThemeType : getThemeType(themeName);

  return {
    container,
    themeName,
    themeType
  };
}
