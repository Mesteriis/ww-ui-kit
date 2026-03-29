import { toCssVariableName } from '@ww/tokens';

import { baseThemeTokens, type ThemeContract, type ThemeName } from './theme-maps';

export const THEME_ATTRIBUTE = 'data-ui-theme';
export const THEME_TYPE_ATTRIBUTE = 'data-ui-theme-type';

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

export function createThemeSheet(themeName: ThemeName, themeTokens: ThemeContract) {
  const selector =
    themeName === 'light'
      ? `:root,\n[${THEME_ATTRIBUTE}="${themeName}"]`
      : `[${THEME_ATTRIBUTE}="${themeName}"]`;

  return `${selector} {\n${serializeVariableBlock(withoutOverriddenBaseTokens(baseThemeTokens, themeTokens))}\n${serializeVariableBlock(themeTokens)}\n}\n`;
}
