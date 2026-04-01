import { toCssVariableName } from '@ww/tokens';

import {
  THEME_RESPONSIVE_BREAKPOINTS,
  baseThemeTokens,
  getThemeCapabilityOverrides,
  type ThemeContract,
  type ThemeName,
} from './theme-maps';

export const THEME_ATTRIBUTE = 'data-ui-theme';
export const THEME_TYPE_ATTRIBUTE = 'data-ui-theme-type';
export const THEME_DENSITY_ATTRIBUTE = 'data-ui-density';
export const THEME_MOTION_PROFILE_ATTRIBUTE = 'data-ui-motion-profile';
export const THEME_PERSONALITY_ATTRIBUTE = 'data-ui-personality';

const serializeVariableBlock = (tokenMap: Record<string, string | undefined>) =>
  Object.entries(tokenMap)
    .filter((entry): entry is [string, string] => typeof entry[1] === 'string')
    .map(([tokenName, tokenValue]) => `  ${toCssVariableName(tokenName)}: ${tokenValue};`)
    .join('\n');

const withoutOverriddenBaseTokens = (
  tokenMap: Record<string, string>,
  overrides: Record<string, string | undefined>
) =>
  Object.fromEntries(
    Object.entries(tokenMap).filter(([tokenName]) => typeof overrides[tokenName] !== 'string')
  );

const serializeSelectorBlock = (
  selectors: readonly string[],
  tokenMap: Record<string, string | undefined>
) => {
  const body = serializeVariableBlock(tokenMap);
  /* istanbul ignore if -- empty override blocks are intentionally omitted from generated theme sheets. */
  if (!body) {
    return '';
  }

  return `${selectors.join(',\n')} {\n${body}\n}\n`;
};

const withAttribute = (selectors: readonly string[], attributeName: string, value: string) =>
  selectors.map((selector) => `${selector}[${attributeName}="${value}"]`);

const serializeResponsiveBlock = (
  selectors: readonly string[],
  tokenMap: Record<string, string | undefined>,
  minWidth: string
) => {
  const body = serializeSelectorBlock(selectors, tokenMap).trim();
  /* istanbul ignore if -- empty responsive blocks are intentionally omitted from generated theme sheets. */
  if (!body) {
    return '';
  }

  return `@media (min-width: ${minWidth}) {\n${body
    .split('\n')
    .map((line) => `  ${line}`)
    .join('\n')}\n}\n`;
};

const serializeThemeExtraCss = (themeName: ThemeName) => {
  if (themeName !== 'belovodye') {
    return '';
  }

  return `[${THEME_ATTRIBUTE}="${themeName}"] body {\n  background-color: var(--ui-surface-canvas);\n  background-image:\n    radial-gradient(circle at 18% 14%, rgba(214, 248, 255, 0.18), transparent 24%),\n    radial-gradient(circle at 76% 8%, rgba(110, 242, 220, 0.16), transparent 28%),\n    radial-gradient(circle at 72% 78%, rgba(46, 157, 168, 0.14), transparent 34%),\n    linear-gradient(162deg, #091623 0%, #102434 36%, #0f2927 72%, #08131d 100%);\n}\n`;
};

export function createThemeSheet(themeName: ThemeName, themeTokens: ThemeContract) {
  const selectors =
    themeName === 'light'
      ? [':root', `[${THEME_ATTRIBUTE}="${themeName}"]`]
      : [`[${THEME_ATTRIBUTE}="${themeName}"]`];
  const capabilityOverrides = getThemeCapabilityOverrides(themeName);
  const blocks = [
    serializeSelectorBlock(selectors, withoutOverriddenBaseTokens(baseThemeTokens, themeTokens)),
    serializeSelectorBlock(selectors, themeTokens),
    ...Object.entries(capabilityOverrides.density).map(([density, tokens]) =>
      serializeSelectorBlock(withAttribute(selectors, THEME_DENSITY_ATTRIBUTE, density), tokens)
    ),
    ...Object.entries(capabilityOverrides.motionProfile).map(([motionProfile, tokens]) =>
      serializeSelectorBlock(
        withAttribute(selectors, THEME_MOTION_PROFILE_ATTRIBUTE, motionProfile),
        tokens
      )
    ),
    ...Object.entries(capabilityOverrides.personality).map(([personality, tokens]) =>
      serializeSelectorBlock(
        withAttribute(selectors, THEME_PERSONALITY_ATTRIBUTE, personality),
        tokens
      )
    ),
    ...Object.entries(capabilityOverrides.responsive).map(([breakpoint, tokens]) =>
      serializeResponsiveBlock(
        selectors,
        tokens as Record<string, string | undefined>,
        THEME_RESPONSIVE_BREAKPOINTS[breakpoint as keyof typeof THEME_RESPONSIVE_BREAKPOINTS]
      )
    ),
    serializeThemeExtraCss(themeName),
  ];

  return blocks.filter(Boolean).join('\n');
}
