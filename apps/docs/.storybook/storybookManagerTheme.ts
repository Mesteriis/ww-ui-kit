import { create } from 'storybook/theming';

import { THEME_NAMES, getThemeMeta, type ThemeName } from '@ww/themes';

const DEFAULT_THEME_NAME: ThemeName = 'belovodye';
const STORYBOOK_CODE_FONT =
  "'SFMono-Regular', 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace";
const STORYBOOK_BASE_FONT = "'Avenir Next', 'Segoe UI', sans-serif";

type StorybookManagerPalette = {
  colorPrimary: string;
  colorSecondary: string;
  appBg: string;
  appContentBg: string;
  appPreviewBg: string;
  appBorderColor: string;
  textColor: string;
  textInverseColor: string;
  textMutedColor: string;
  barTextColor: string;
  barHoverColor: string;
  barSelectedColor: string;
  barBg: string;
  buttonBg: string;
  buttonBorder: string;
  booleanBg: string;
  booleanSelectedBg: string;
  inputBg: string;
  inputBorder: string;
  inputTextColor: string;
};

const isThemeName = (value: unknown): value is ThemeName =>
  typeof value === 'string' && THEME_NAMES.includes(value as ThemeName);

const resolveStorybookThemeName = (value: unknown): ThemeName =>
  isThemeName(value) ? value : DEFAULT_THEME_NAME;

const managerPalettes: Record<ThemeName, StorybookManagerPalette> = {
  light: {
    colorPrimary: '#6366f1',
    colorSecondary: '#4f46e5',
    appBg: '#f8fafc',
    appContentBg: '#ffffff',
    appPreviewBg: '#f8fafc',
    appBorderColor: '#cbd5e1',
    textColor: '#0f172a',
    textInverseColor: '#ffffff',
    textMutedColor: '#64748b',
    barTextColor: '#334155',
    barHoverColor: '#eef2ff',
    barSelectedColor: '#4f46e5',
    barBg: '#ffffff',
    buttonBg: '#ffffff',
    buttonBorder: '#e2e8f0',
    booleanBg: '#f1f5f9',
    booleanSelectedBg: '#4f46e5',
    inputBg: '#ffffff',
    inputBorder: '#e2e8f0',
    inputTextColor: '#0f172a',
  },
  dark: {
    colorPrimary: '#818cf8',
    colorSecondary: '#6366f1',
    appBg: '#020617',
    appContentBg: '#0f172a',
    appPreviewBg: '#020617',
    appBorderColor: 'rgba(148, 163, 184, 0.34)',
    textColor: '#f8fafc',
    textInverseColor: '#020617',
    textMutedColor: '#94a3b8',
    barTextColor: '#cbd5e1',
    barHoverColor: 'rgba(99, 102, 241, 0.16)',
    barSelectedColor: '#a5b4fc',
    barBg: '#1e293b',
    buttonBg: '#0f172a',
    buttonBorder: 'rgba(148, 163, 184, 0.2)',
    booleanBg: '#0f172a',
    booleanSelectedBg: '#6366f1',
    inputBg: '#0f172a',
    inputBorder: 'rgba(148, 163, 184, 0.2)',
    inputTextColor: '#f8fafc',
  },
  belovodye: {
    colorPrimary: '#6ef2dc',
    colorSecondary: '#2dd4bf',
    appBg: '#06121a',
    appContentBg: 'rgba(8, 20, 31, 0.76)',
    appPreviewBg: '#06121a',
    appBorderColor: 'rgba(118, 176, 201, 0.34)',
    textColor: '#e7eff6',
    textInverseColor: '#06121a',
    textMutedColor: '#93adbf',
    barTextColor: '#9db3c5',
    barHoverColor: 'rgba(46, 157, 168, 0.14)',
    barSelectedColor: '#6ef2dc',
    barBg: 'rgba(10, 24, 36, 0.9)',
    buttonBg: 'rgba(10, 24, 36, 0.82)',
    buttonBorder: 'rgba(118, 176, 201, 0.34)',
    booleanBg: '#0a1a24',
    booleanSelectedBg: '#5de4c3',
    inputBg: 'rgba(8, 20, 31, 0.76)',
    inputBorder: 'rgba(132, 170, 188, 0.22)',
    inputTextColor: '#e7eff6',
  },
};

const createStorybookManagerTheme = (themeName: ThemeName) => {
  const theme = getThemeMeta(themeName);
  const palette = managerPalettes[themeName];

  return create({
    base: theme.type === 'light' ? 'light' : 'dark',
    colorPrimary: palette.colorPrimary,
    colorSecondary: palette.colorSecondary,
    appBg: palette.appBg,
    appContentBg: palette.appContentBg,
    appPreviewBg: palette.appPreviewBg,
    appBorderColor: palette.appBorderColor,
    appBorderRadius: 16,
    fontBase: STORYBOOK_BASE_FONT,
    fontCode: STORYBOOK_CODE_FONT,
    textColor: palette.textColor,
    textInverseColor: palette.textInverseColor,
    textMutedColor: palette.textMutedColor,
    barTextColor: palette.barTextColor,
    barHoverColor: palette.barHoverColor,
    barSelectedColor: palette.barSelectedColor,
    barBg: palette.barBg,
    buttonBg: palette.buttonBg,
    buttonBorder: palette.buttonBorder,
    booleanBg: palette.booleanBg,
    booleanSelectedBg: palette.booleanSelectedBg,
    inputBg: palette.inputBg,
    inputBorder: palette.inputBorder,
    inputTextColor: palette.inputTextColor,
    inputBorderRadius: 999,
    brandTitle: `Willow Works UI Kit · ${theme.label}`,
  });
};

export { createStorybookManagerTheme, resolveStorybookThemeName };
