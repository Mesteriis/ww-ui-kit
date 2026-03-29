export type UiButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type UiButtonTone =
  | 'neutral'
  | 'brand'
  | 'trace'
  | 'debug'
  | 'info'
  | 'success'
  | 'warning'
  | 'warn'
  | 'danger'
  | 'error'
  | 'critical'
  | 'fatal';
export type UiButtonResolvedTone =
  | 'neutral'
  | 'brand'
  | 'debug'
  | 'info'
  | 'success'
  | 'warning'
  | 'danger'
  | 'critical';
export type UiButtonAppearance = 'solid' | 'outline' | 'ghost';
export type UiButtonEffect = 'none' | 'border-flow' | 'color-shift';
export type UiButtonSize = 'sm' | 'md' | 'lg';

type ButtonRecipe = {
  tone: UiButtonResolvedTone;
  appearance: UiButtonAppearance;
};

const legacyVariantMap: Record<UiButtonVariant, ButtonRecipe> = {
  primary: { tone: 'brand', appearance: 'solid' },
  secondary: { tone: 'neutral', appearance: 'outline' },
  ghost: { tone: 'neutral', appearance: 'ghost' },
  danger: { tone: 'danger', appearance: 'solid' },
};

const toneAliasMap: Record<UiButtonTone, UiButtonResolvedTone> = {
  neutral: 'neutral',
  brand: 'brand',
  trace: 'neutral',
  debug: 'debug',
  info: 'info',
  success: 'success',
  warning: 'warning',
  warn: 'warning',
  danger: 'danger',
  error: 'danger',
  critical: 'critical',
  fatal: 'critical',
};

export function resolveButtonStyle(options: {
  variant?: UiButtonVariant | undefined;
  tone?: UiButtonTone | undefined;
  appearance?: UiButtonAppearance | undefined;
}): ButtonRecipe {
  const legacyRecipe = legacyVariantMap[options.variant ?? 'primary'];

  return {
    tone: options.tone ? toneAliasMap[options.tone] : legacyRecipe.tone,
    appearance: options.appearance ?? (options.tone ? 'solid' : legacyRecipe.appearance),
  };
}
