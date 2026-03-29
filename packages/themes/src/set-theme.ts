import { THEME_ATTRIBUTE, THEME_TYPE_ATTRIBUTE } from './create-theme-sheet';
import { getThemeType, type ThemeName } from './theme-maps';

export function setTheme(themeName: ThemeName, target?: HTMLElement | null) {
  const resolvedTarget = target ?? (typeof document !== 'undefined' ? document.documentElement : null);

  if (!resolvedTarget) {
    return null;
  }

  const themeType = getThemeType(themeName);
  resolvedTarget.setAttribute(THEME_ATTRIBUTE, themeName);
  resolvedTarget.setAttribute(THEME_TYPE_ATTRIBUTE, themeType);
  resolvedTarget.style.colorScheme = themeType;
  return resolvedTarget;
}
