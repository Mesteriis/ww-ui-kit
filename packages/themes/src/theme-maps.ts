import type { BaseTokenName, ComponentTokenName, ThemeSemanticTokenName, ThemeTokenMap } from '@ww/tokens';
import { baseTokenValues, foundationSemanticTokenValues } from '@ww/tokens';

export const THEME_TYPES = ['light', 'dark'] as const;

export type ThemeType = (typeof THEME_TYPES)[number];
export type ThemeContract = ThemeTokenMap<ThemeSemanticTokenName | ComponentTokenName> &
  Partial<ThemeTokenMap<BaseTokenName>>;

interface ThemeDefinitionInput {
  label: string;
  type: ThemeType;
  tokens: ThemeContract;
}

export const baseThemeTokens = Object.freeze({
  ...baseTokenValues,
  ...foundationSemanticTokenValues
});

const buttonToneNames = ['neutral', 'brand', 'debug', 'info', 'success', 'warning', 'danger', 'critical'] as const;

type ButtonThemeTone = (typeof buttonToneNames)[number];
type ButtonToneTokenName =
  | `button-${ButtonThemeTone}-solid-bg`
  | `button-${ButtonThemeTone}-solid-fg`
  | `button-${ButtonThemeTone}-solid-border`
  | `button-${ButtonThemeTone}-solid-bg-hover`
  | `button-${ButtonThemeTone}-solid-bg-active`
  | `button-${ButtonThemeTone}-soft-bg`
  | `button-${ButtonThemeTone}-soft-fg`
  | `button-${ButtonThemeTone}-soft-border`
  | `button-${ButtonThemeTone}-soft-bg-hover`
  | `button-${ButtonThemeTone}-soft-bg-active`
  | `button-${ButtonThemeTone}-accent-start`
  | `button-${ButtonThemeTone}-accent-end`;
type ButtonToneValues = {
  solidBg: string;
  solidFg: string;
  solidBorder: string;
  solidBgHover: string;
  solidBgActive: string;
  softBg: string;
  softFg: string;
  softBorder: string;
  softBgHover: string;
  softBgActive: string;
  accentStart: string;
  accentEnd: string;
};

type ChartTokenName = Extract<ComponentTokenName, `chart-${string}`>;
type ChartTokenValues = Record<ChartTokenName, string>;
type GraphTokenName = Extract<ComponentTokenName, `graph-${string}`>;
type GraphTokenValues = Record<GraphTokenName, string>;

const createButtonToneTokens = (tones: Record<ButtonThemeTone, ButtonToneValues>) =>
  Object.fromEntries(
    buttonToneNames.flatMap((tone) => [
      [`button-${tone}-solid-bg`, tones[tone].solidBg],
      [`button-${tone}-solid-fg`, tones[tone].solidFg],
      [`button-${tone}-solid-border`, tones[tone].solidBorder],
      [`button-${tone}-solid-bg-hover`, tones[tone].solidBgHover],
      [`button-${tone}-solid-bg-active`, tones[tone].solidBgActive],
      [`button-${tone}-soft-bg`, tones[tone].softBg],
      [`button-${tone}-soft-fg`, tones[tone].softFg],
      [`button-${tone}-soft-border`, tones[tone].softBorder],
      [`button-${tone}-soft-bg-hover`, tones[tone].softBgHover],
      [`button-${tone}-soft-bg-active`, tones[tone].softBgActive],
      [`button-${tone}-accent-start`, tones[tone].accentStart],
      [`button-${tone}-accent-end`, tones[tone].accentEnd]
    ])
  ) as Record<ButtonToneTokenName, string>;

const lightChartTokens: ChartTokenValues = {
  'chart-series-1': 'var(--ui-brand-500)',
  'chart-series-2': 'var(--ui-success-500)',
  'chart-series-3': 'var(--ui-warning-500)',
  'chart-series-4': 'var(--ui-danger-500)',
  'chart-series-5': 'var(--ui-neutral-500)',
  'chart-series-6': 'var(--ui-brand-700)',
  'chart-series-7': 'var(--ui-success-700)',
  'chart-series-8': 'var(--ui-warning-700)',
  'chart-grid-line': 'color-mix(in srgb, var(--ui-border-subtle) 88%, transparent)',
  'chart-axis-label': 'var(--ui-text-secondary)',
  'chart-axis-border': 'var(--ui-border-subtle)',
  'chart-axis-tick': 'var(--ui-border-strong)',
  'chart-legend-text': 'var(--ui-text-secondary)',
  'chart-tooltip-bg': 'var(--ui-surface-overlay)',
  'chart-tooltip-text': 'var(--ui-text-primary)',
  'chart-tooltip-border': 'var(--ui-border-subtle)',
  'chart-crosshair': 'color-mix(in srgb, var(--ui-border-focus) 24%, transparent)',
  'chart-selection-fill': 'color-mix(in srgb, var(--ui-action-primary-bg) 18%, transparent)',
  'chart-selection-border': 'var(--ui-border-focus)',
  'chart-marker-stroke': 'var(--ui-surface-default)',
  'chart-no-data-text': 'var(--ui-text-muted)',
  'chart-toolbar-color': 'var(--ui-text-secondary)',
  'chart-state-surface-loading': 'color-mix(in srgb, var(--ui-surface-default) 90%, var(--ui-surface-brand-soft))',
  'chart-state-surface-empty': 'color-mix(in srgb, var(--ui-surface-default) 88%, var(--ui-surface-brand-soft))',
  'chart-state-surface-error': 'color-mix(in srgb, var(--ui-surface-default) 88%, var(--ui-surface-danger-soft))'
};

const darkChartTokens: ChartTokenValues = {
  'chart-series-1': 'var(--ui-brand-300)',
  'chart-series-2': 'var(--ui-success-300)',
  'chart-series-3': 'var(--ui-warning-300)',
  'chart-series-4': 'var(--ui-danger-300)',
  'chart-series-5': 'var(--ui-neutral-300)',
  'chart-series-6': 'var(--ui-brand-100)',
  'chart-series-7': 'var(--ui-success-100)',
  'chart-series-8': 'var(--ui-warning-100)',
  'chart-grid-line': 'rgba(148, 163, 184, 0.18)',
  'chart-axis-label': 'var(--ui-text-secondary)',
  'chart-axis-border': 'rgba(148, 163, 184, 0.22)',
  'chart-axis-tick': 'rgba(148, 163, 184, 0.32)',
  'chart-legend-text': 'var(--ui-text-secondary)',
  'chart-tooltip-bg': 'var(--ui-neutral-800)',
  'chart-tooltip-text': 'var(--ui-neutral-50)',
  'chart-tooltip-border': 'var(--ui-border-strong)',
  'chart-crosshair': 'rgba(129, 140, 248, 0.26)',
  'chart-selection-fill': 'rgba(129, 140, 248, 0.18)',
  'chart-selection-border': 'var(--ui-brand-300)',
  'chart-marker-stroke': 'var(--ui-neutral-900)',
  'chart-no-data-text': 'var(--ui-text-muted)',
  'chart-toolbar-color': 'var(--ui-text-secondary)',
  'chart-state-surface-loading': 'rgba(99, 102, 241, 0.16)',
  'chart-state-surface-empty': 'rgba(148, 163, 184, 0.14)',
  'chart-state-surface-error': 'rgba(239, 68, 68, 0.16)'
};

const belovodyeChartTokens: ChartTokenValues = {
  'chart-series-1': 'var(--ui-brand-500)',
  'chart-series-2': 'var(--ui-success-500)',
  'chart-series-3': 'var(--ui-warning-500)',
  'chart-series-4': 'var(--ui-danger-500)',
  'chart-series-5': 'var(--ui-neutral-600)',
  'chart-series-6': 'var(--ui-brand-700)',
  'chart-series-7': 'var(--ui-success-700)',
  'chart-series-8': 'var(--ui-warning-700)',
  'chart-grid-line': 'color-mix(in srgb, var(--ui-border-subtle) 86%, transparent)',
  'chart-axis-label': 'var(--ui-text-secondary)',
  'chart-axis-border': 'var(--ui-border-subtle)',
  'chart-axis-tick': 'var(--ui-border-strong)',
  'chart-legend-text': 'var(--ui-text-secondary)',
  'chart-tooltip-bg': 'var(--ui-surface-overlay)',
  'chart-tooltip-text': 'var(--ui-text-primary)',
  'chart-tooltip-border': 'var(--ui-border-strong)',
  'chart-crosshair': 'color-mix(in srgb, var(--ui-border-focus) 22%, transparent)',
  'chart-selection-fill': 'color-mix(in srgb, var(--ui-action-primary-bg) 16%, transparent)',
  'chart-selection-border': 'var(--ui-border-focus)',
  'chart-marker-stroke': 'var(--ui-surface-default)',
  'chart-no-data-text': 'var(--ui-text-muted)',
  'chart-toolbar-color': 'var(--ui-text-secondary)',
  'chart-state-surface-loading': 'color-mix(in srgb, var(--ui-surface-default) 92%, var(--ui-surface-brand-soft))',
  'chart-state-surface-empty': 'color-mix(in srgb, var(--ui-surface-default) 88%, var(--ui-surface-brand-soft))',
  'chart-state-surface-error': 'color-mix(in srgb, var(--ui-surface-default) 88%, var(--ui-surface-danger-soft))'
};

const lightGraphTokens: GraphTokenValues = {
  'graph-canvas-bg': 'color-mix(in srgb, var(--ui-surface-canvas) 94%, var(--ui-surface-brand-soft))',
  'graph-grid-minor': 'color-mix(in srgb, var(--ui-border-subtle) 42%, transparent)',
  'graph-grid-major': 'color-mix(in srgb, var(--ui-border-strong) 56%, transparent)',
  'graph-node-surface': 'color-mix(in srgb, var(--ui-surface-default) 96%, transparent)',
  'graph-node-border': 'var(--ui-border-subtle)',
  'graph-node-text': 'var(--ui-text-primary)',
  'graph-node-active-ring': 'var(--ui-border-focus)',
  'graph-node-related-ring': 'color-mix(in srgb, var(--ui-border-focus) 46%, transparent)',
  'graph-node-glow': 'color-mix(in srgb, var(--ui-action-primary-bg) 28%, transparent)',
  'graph-node-glass-bg': 'color-mix(in srgb, var(--ui-surface-overlay) 76%, transparent)',
  'graph-node-glass-border': 'color-mix(in srgb, var(--ui-border-subtle) 72%, transparent)',
  'graph-edge-idle': 'color-mix(in srgb, var(--ui-border-strong) 68%, transparent)',
  'graph-edge-related': 'color-mix(in srgb, var(--ui-border-focus) 42%, var(--ui-border-strong))',
  'graph-edge-active': 'var(--ui-action-primary-bg)',
  'graph-edge-glow': 'var(--ui-action-primary-bg)',
  'graph-pulse-neutral': 'var(--ui-neutral-500)',
  'graph-pulse-info': 'var(--ui-brand-500)',
  'graph-pulse-success': 'var(--ui-success-500)',
  'graph-pulse-warning': 'var(--ui-warning-500)',
  'graph-pulse-danger': 'var(--ui-danger-500)',
  'graph-pulse-accent': 'var(--ui-brand-600)',
  'graph-depth-background-opacity': '0.34',
  'graph-depth-background-blur': '1px',
  'graph-depth-related-opacity': '0.74',
  'graph-focus-halo': 'var(--ui-focus-ring)',
  'graph-controls-surface': 'var(--ui-surface-overlay)',
  'graph-controls-icon': 'var(--ui-text-secondary)',
  'graph-minimap-surface': 'var(--ui-surface-overlay)',
  'graph-minimap-border': 'var(--ui-border-subtle)',
  'graph-overlay-panel-surface': 'var(--ui-surface-overlay)',
  'graph-signal-reaction-color': 'var(--ui-action-primary-bg)'
};

const darkGraphTokens: GraphTokenValues = {
  'graph-canvas-bg': 'color-mix(in srgb, var(--ui-surface-canvas) 92%, var(--ui-brand-900))',
  'graph-grid-minor': 'rgba(148, 163, 184, 0.18)',
  'graph-grid-major': 'rgba(148, 163, 184, 0.28)',
  'graph-node-surface': 'color-mix(in srgb, var(--ui-surface-default) 94%, transparent)',
  'graph-node-border': 'var(--ui-border-subtle)',
  'graph-node-text': 'var(--ui-text-primary)',
  'graph-node-active-ring': 'var(--ui-brand-300)',
  'graph-node-related-ring': 'rgba(129, 140, 248, 0.34)',
  'graph-node-glow': 'rgba(129, 140, 248, 0.28)',
  'graph-node-glass-bg': 'color-mix(in srgb, var(--ui-surface-overlay) 72%, transparent)',
  'graph-node-glass-border': 'rgba(148, 163, 184, 0.24)',
  'graph-edge-idle': 'rgba(148, 163, 184, 0.42)',
  'graph-edge-related': 'rgba(129, 140, 248, 0.48)',
  'graph-edge-active': 'var(--ui-brand-300)',
  'graph-edge-glow': 'var(--ui-brand-300)',
  'graph-pulse-neutral': 'var(--ui-neutral-300)',
  'graph-pulse-info': 'var(--ui-brand-300)',
  'graph-pulse-success': 'var(--ui-success-300)',
  'graph-pulse-warning': 'var(--ui-warning-300)',
  'graph-pulse-danger': 'var(--ui-danger-300)',
  'graph-pulse-accent': 'var(--ui-brand-100)',
  'graph-depth-background-opacity': '0.22',
  'graph-depth-background-blur': '1.6px',
  'graph-depth-related-opacity': '0.68',
  'graph-focus-halo': 'var(--ui-focus-ring)',
  'graph-controls-surface': 'var(--ui-surface-overlay)',
  'graph-controls-icon': 'var(--ui-text-secondary)',
  'graph-minimap-surface': 'var(--ui-surface-overlay)',
  'graph-minimap-border': 'var(--ui-border-strong)',
  'graph-overlay-panel-surface': 'var(--ui-surface-overlay)',
  'graph-signal-reaction-color': 'var(--ui-brand-300)'
};

const belovodyeGraphTokens: GraphTokenValues = {
  'graph-canvas-bg': 'color-mix(in srgb, var(--ui-surface-canvas) 96%, var(--ui-brand-50))',
  'graph-grid-minor': 'color-mix(in srgb, var(--ui-border-subtle) 36%, transparent)',
  'graph-grid-major': 'color-mix(in srgb, var(--ui-border-strong) 54%, transparent)',
  'graph-node-surface': 'color-mix(in srgb, var(--ui-surface-default) 96%, transparent)',
  'graph-node-border': 'var(--ui-border-subtle)',
  'graph-node-text': 'var(--ui-text-primary)',
  'graph-node-active-ring': 'var(--ui-border-focus)',
  'graph-node-related-ring': 'color-mix(in srgb, var(--ui-border-focus) 42%, transparent)',
  'graph-node-glow': 'color-mix(in srgb, var(--ui-brand-500) 24%, transparent)',
  'graph-node-glass-bg': 'color-mix(in srgb, var(--ui-surface-overlay) 78%, transparent)',
  'graph-node-glass-border': 'color-mix(in srgb, var(--ui-border-strong) 58%, transparent)',
  'graph-edge-idle': 'color-mix(in srgb, var(--ui-border-strong) 62%, transparent)',
  'graph-edge-related': 'color-mix(in srgb, var(--ui-brand-500) 34%, var(--ui-border-strong))',
  'graph-edge-active': 'var(--ui-brand-500)',
  'graph-edge-glow': 'var(--ui-brand-500)',
  'graph-pulse-neutral': 'var(--ui-neutral-500)',
  'graph-pulse-info': 'var(--ui-brand-500)',
  'graph-pulse-success': 'var(--ui-success-500)',
  'graph-pulse-warning': 'var(--ui-warning-500)',
  'graph-pulse-danger': 'var(--ui-danger-500)',
  'graph-pulse-accent': 'var(--ui-brand-600)',
  'graph-depth-background-opacity': '0.3',
  'graph-depth-background-blur': '1px',
  'graph-depth-related-opacity': '0.78',
  'graph-focus-halo': 'var(--ui-focus-ring)',
  'graph-controls-surface': 'var(--ui-surface-overlay)',
  'graph-controls-icon': 'var(--ui-text-secondary)',
  'graph-minimap-surface': 'var(--ui-surface-overlay)',
  'graph-minimap-border': 'var(--ui-border-subtle)',
  'graph-overlay-panel-surface': 'var(--ui-surface-overlay)',
  'graph-signal-reaction-color': 'var(--ui-brand-500)'
};

const lightButtonToneTokens = createButtonToneTokens({
  neutral: {
    solidBg: 'var(--ui-neutral-900)',
    solidFg: 'var(--ui-neutral-0)',
    solidBorder: 'var(--ui-neutral-900)',
    solidBgHover: 'var(--ui-neutral-800)',
    solidBgActive: 'var(--ui-neutral-700)',
    softBg: 'var(--ui-surface-default)',
    softFg: 'var(--ui-neutral-900)',
    softBorder: 'var(--ui-border-subtle)',
    softBgHover: 'var(--ui-neutral-50)',
    softBgActive: 'var(--ui-neutral-100)',
    accentStart: 'var(--ui-neutral-300)',
    accentEnd: 'var(--ui-neutral-700)'
  },
  brand: {
    solidBg: 'var(--ui-brand-600)',
    solidFg: 'var(--ui-neutral-0)',
    solidBorder: 'var(--ui-brand-600)',
    solidBgHover: 'var(--ui-brand-700)',
    solidBgActive: 'var(--ui-brand-800)',
    softBg: 'var(--ui-brand-50)',
    softFg: 'var(--ui-brand-700)',
    softBorder: 'var(--ui-brand-200)',
    softBgHover: 'var(--ui-brand-100)',
    softBgActive: 'var(--ui-brand-200)',
    accentStart: 'var(--ui-brand-300)',
    accentEnd: 'var(--ui-brand-700)'
  },
  debug: {
    solidBg: 'var(--ui-brand-700)',
    solidFg: 'var(--ui-neutral-0)',
    solidBorder: 'var(--ui-brand-700)',
    solidBgHover: 'var(--ui-brand-800)',
    solidBgActive: 'var(--ui-brand-900)',
    softBg: 'color-mix(in srgb, var(--ui-brand-50) 76%, var(--ui-neutral-0))',
    softFg: 'var(--ui-brand-800)',
    softBorder: 'var(--ui-brand-300)',
    softBgHover: 'var(--ui-brand-100)',
    softBgActive: 'var(--ui-brand-200)',
    accentStart: 'var(--ui-brand-500)',
    accentEnd: 'var(--ui-brand-900)'
  },
  info: {
    solidBg: 'var(--ui-brand-500)',
    solidFg: 'var(--ui-neutral-0)',
    solidBorder: 'var(--ui-brand-500)',
    solidBgHover: 'var(--ui-brand-600)',
    solidBgActive: 'var(--ui-brand-700)',
    softBg: 'var(--ui-brand-50)',
    softFg: 'var(--ui-brand-700)',
    softBorder: 'var(--ui-brand-200)',
    softBgHover: 'var(--ui-brand-100)',
    softBgActive: 'var(--ui-brand-200)',
    accentStart: 'var(--ui-brand-200)',
    accentEnd: 'var(--ui-brand-600)'
  },
  success: {
    solidBg: 'var(--ui-success-600)',
    solidFg: 'var(--ui-neutral-0)',
    solidBorder: 'var(--ui-success-600)',
    solidBgHover: 'var(--ui-success-700)',
    solidBgActive: 'var(--ui-success-800)',
    softBg: 'var(--ui-success-50)',
    softFg: 'var(--ui-success-700)',
    softBorder: 'var(--ui-success-200)',
    softBgHover: 'var(--ui-success-100)',
    softBgActive: 'var(--ui-success-200)',
    accentStart: 'var(--ui-success-300)',
    accentEnd: 'var(--ui-success-700)'
  },
  warning: {
    solidBg: 'var(--ui-warning-500)',
    solidFg: 'var(--ui-neutral-950)',
    solidBorder: 'var(--ui-warning-500)',
    solidBgHover: 'var(--ui-warning-600)',
    solidBgActive: 'var(--ui-warning-700)',
    softBg: 'var(--ui-warning-50)',
    softFg: 'var(--ui-warning-800)',
    softBorder: 'var(--ui-warning-200)',
    softBgHover: 'var(--ui-warning-100)',
    softBgActive: 'var(--ui-warning-200)',
    accentStart: 'var(--ui-warning-300)',
    accentEnd: 'var(--ui-warning-700)'
  },
  danger: {
    solidBg: 'var(--ui-danger-600)',
    solidFg: 'var(--ui-neutral-0)',
    solidBorder: 'var(--ui-danger-600)',
    solidBgHover: 'var(--ui-danger-700)',
    solidBgActive: 'var(--ui-danger-800)',
    softBg: 'var(--ui-danger-50)',
    softFg: 'var(--ui-danger-700)',
    softBorder: 'var(--ui-danger-200)',
    softBgHover: 'var(--ui-danger-100)',
    softBgActive: 'var(--ui-danger-200)',
    accentStart: 'var(--ui-danger-300)',
    accentEnd: 'var(--ui-danger-700)'
  },
  critical: {
    solidBg: 'color-mix(in srgb, var(--ui-danger-900) 88%, var(--ui-neutral-950))',
    solidFg: 'var(--ui-neutral-0)',
    solidBorder: 'color-mix(in srgb, var(--ui-danger-900) 88%, var(--ui-neutral-950))',
    solidBgHover: 'color-mix(in srgb, var(--ui-danger-900) 70%, var(--ui-neutral-950))',
    solidBgActive: 'var(--ui-neutral-950)',
    softBg: 'color-mix(in srgb, var(--ui-danger-50) 84%, var(--ui-neutral-0))',
    softFg: 'var(--ui-danger-900)',
    softBorder: 'var(--ui-danger-300)',
    softBgHover: 'var(--ui-danger-100)',
    softBgActive: 'var(--ui-danger-200)',
    accentStart: 'var(--ui-danger-500)',
    accentEnd: 'var(--ui-warning-500)'
  }
});

const darkButtonToneTokens = createButtonToneTokens({
  neutral: {
    solidBg: 'var(--ui-neutral-100)',
    solidFg: 'var(--ui-neutral-950)',
    solidBorder: 'var(--ui-neutral-100)',
    solidBgHover: 'var(--ui-neutral-50)',
    solidBgActive: 'var(--ui-neutral-0)',
    softBg: 'rgba(148, 163, 184, 0.08)',
    softFg: 'var(--ui-neutral-100)',
    softBorder: 'var(--ui-border-strong)',
    softBgHover: 'rgba(148, 163, 184, 0.16)',
    softBgActive: 'rgba(148, 163, 184, 0.24)',
    accentStart: 'var(--ui-neutral-300)',
    accentEnd: 'var(--ui-neutral-50)'
  },
  brand: {
    solidBg: 'var(--ui-brand-400)',
    solidFg: 'var(--ui-neutral-950)',
    solidBorder: 'var(--ui-brand-400)',
    solidBgHover: 'var(--ui-brand-300)',
    solidBgActive: 'var(--ui-brand-200)',
    softBg: 'rgba(99, 102, 241, 0.16)',
    softFg: 'var(--ui-brand-200)',
    softBorder: 'rgba(129, 140, 248, 0.32)',
    softBgHover: 'rgba(99, 102, 241, 0.24)',
    softBgActive: 'rgba(99, 102, 241, 0.32)',
    accentStart: 'var(--ui-brand-300)',
    accentEnd: 'var(--ui-brand-100)'
  },
  debug: {
    solidBg: 'var(--ui-brand-500)',
    solidFg: 'var(--ui-neutral-950)',
    solidBorder: 'var(--ui-brand-500)',
    solidBgHover: 'var(--ui-brand-400)',
    solidBgActive: 'var(--ui-brand-300)',
    softBg: 'rgba(79, 70, 229, 0.22)',
    softFg: 'var(--ui-brand-100)',
    softBorder: 'rgba(129, 140, 248, 0.42)',
    softBgHover: 'rgba(79, 70, 229, 0.3)',
    softBgActive: 'rgba(79, 70, 229, 0.38)',
    accentStart: 'var(--ui-brand-400)',
    accentEnd: 'var(--ui-brand-100)'
  },
  info: {
    solidBg: 'var(--ui-brand-300)',
    solidFg: 'var(--ui-neutral-950)',
    solidBorder: 'var(--ui-brand-300)',
    solidBgHover: 'var(--ui-brand-200)',
    solidBgActive: 'var(--ui-brand-100)',
    softBg: 'rgba(129, 140, 248, 0.14)',
    softFg: 'var(--ui-brand-100)',
    softBorder: 'rgba(165, 180, 252, 0.34)',
    softBgHover: 'rgba(129, 140, 248, 0.22)',
    softBgActive: 'rgba(129, 140, 248, 0.3)',
    accentStart: 'var(--ui-brand-200)',
    accentEnd: 'var(--ui-brand-50)'
  },
  success: {
    solidBg: 'var(--ui-success-400)',
    solidFg: 'var(--ui-neutral-950)',
    solidBorder: 'var(--ui-success-400)',
    solidBgHover: 'var(--ui-success-300)',
    solidBgActive: 'var(--ui-success-200)',
    softBg: 'rgba(16, 185, 129, 0.16)',
    softFg: 'var(--ui-success-200)',
    softBorder: 'rgba(52, 211, 153, 0.34)',
    softBgHover: 'rgba(16, 185, 129, 0.24)',
    softBgActive: 'rgba(16, 185, 129, 0.32)',
    accentStart: 'var(--ui-success-300)',
    accentEnd: 'var(--ui-success-100)'
  },
  warning: {
    solidBg: 'var(--ui-warning-300)',
    solidFg: 'var(--ui-neutral-950)',
    solidBorder: 'var(--ui-warning-300)',
    solidBgHover: 'var(--ui-warning-200)',
    solidBgActive: 'var(--ui-warning-100)',
    softBg: 'rgba(245, 158, 11, 0.18)',
    softFg: 'var(--ui-warning-200)',
    softBorder: 'rgba(251, 191, 36, 0.36)',
    softBgHover: 'rgba(245, 158, 11, 0.26)',
    softBgActive: 'rgba(245, 158, 11, 0.34)',
    accentStart: 'var(--ui-warning-300)',
    accentEnd: 'var(--ui-warning-100)'
  },
  danger: {
    solidBg: 'var(--ui-danger-400)',
    solidFg: 'var(--ui-neutral-950)',
    solidBorder: 'var(--ui-danger-400)',
    solidBgHover: 'var(--ui-danger-300)',
    solidBgActive: 'var(--ui-danger-200)',
    softBg: 'rgba(239, 68, 68, 0.18)',
    softFg: 'var(--ui-danger-200)',
    softBorder: 'rgba(248, 113, 113, 0.38)',
    softBgHover: 'rgba(239, 68, 68, 0.26)',
    softBgActive: 'rgba(239, 68, 68, 0.34)',
    accentStart: 'var(--ui-danger-300)',
    accentEnd: 'var(--ui-danger-100)'
  },
  critical: {
    solidBg: 'var(--ui-danger-200)',
    solidFg: 'var(--ui-neutral-950)',
    solidBorder: 'var(--ui-danger-200)',
    solidBgHover: 'var(--ui-danger-100)',
    solidBgActive: 'var(--ui-neutral-0)',
    softBg: 'rgba(248, 113, 113, 0.18)',
    softFg: 'var(--ui-danger-100)',
    softBorder: 'rgba(252, 165, 165, 0.42)',
    softBgHover: 'rgba(248, 113, 113, 0.26)',
    softBgActive: 'rgba(248, 113, 113, 0.34)',
    accentStart: 'var(--ui-danger-300)',
    accentEnd: 'var(--ui-warning-200)'
  }
});

const belovodyeButtonToneTokens = createButtonToneTokens({
  neutral: {
    solidBg: 'var(--ui-neutral-800)',
    solidFg: 'var(--ui-neutral-0)',
    solidBorder: 'var(--ui-neutral-800)',
    solidBgHover: 'var(--ui-neutral-900)',
    solidBgActive: 'var(--ui-neutral-950)',
    softBg: 'color-mix(in srgb, var(--ui-neutral-0) 94%, var(--ui-brand-50))',
    softFg: 'var(--ui-neutral-800)',
    softBorder: 'var(--ui-border-subtle)',
    softBgHover: 'var(--ui-neutral-50)',
    softBgActive: 'var(--ui-neutral-100)',
    accentStart: 'var(--ui-neutral-300)',
    accentEnd: 'var(--ui-neutral-700)'
  },
  brand: {
    solidBg: 'var(--ui-brand-600)',
    solidFg: 'var(--ui-neutral-0)',
    solidBorder: 'var(--ui-brand-600)',
    solidBgHover: 'var(--ui-brand-700)',
    solidBgActive: 'var(--ui-brand-800)',
    softBg: 'var(--ui-brand-50)',
    softFg: 'var(--ui-brand-800)',
    softBorder: 'var(--ui-brand-200)',
    softBgHover: 'var(--ui-brand-100)',
    softBgActive: 'var(--ui-brand-200)',
    accentStart: 'var(--ui-brand-300)',
    accentEnd: 'var(--ui-brand-700)'
  },
  debug: {
    solidBg: 'var(--ui-brand-700)',
    solidFg: 'var(--ui-neutral-0)',
    solidBorder: 'var(--ui-brand-700)',
    solidBgHover: 'var(--ui-brand-800)',
    solidBgActive: 'var(--ui-brand-900)',
    softBg: 'color-mix(in srgb, var(--ui-brand-50) 82%, var(--ui-neutral-0))',
    softFg: 'var(--ui-brand-800)',
    softBorder: 'var(--ui-brand-300)',
    softBgHover: 'var(--ui-brand-100)',
    softBgActive: 'var(--ui-brand-200)',
    accentStart: 'var(--ui-brand-500)',
    accentEnd: 'var(--ui-brand-900)'
  },
  info: {
    solidBg: 'var(--ui-brand-500)',
    solidFg: 'var(--ui-neutral-0)',
    solidBorder: 'var(--ui-brand-500)',
    solidBgHover: 'var(--ui-brand-600)',
    solidBgActive: 'var(--ui-brand-700)',
    softBg: 'var(--ui-brand-50)',
    softFg: 'var(--ui-brand-800)',
    softBorder: 'var(--ui-brand-200)',
    softBgHover: 'var(--ui-brand-100)',
    softBgActive: 'var(--ui-brand-200)',
    accentStart: 'var(--ui-brand-200)',
    accentEnd: 'var(--ui-brand-600)'
  },
  success: {
    solidBg: 'var(--ui-success-600)',
    solidFg: 'var(--ui-neutral-0)',
    solidBorder: 'var(--ui-success-600)',
    solidBgHover: 'var(--ui-success-700)',
    solidBgActive: 'var(--ui-success-800)',
    softBg: 'var(--ui-success-50)',
    softFg: 'var(--ui-success-700)',
    softBorder: 'var(--ui-success-200)',
    softBgHover: 'var(--ui-success-100)',
    softBgActive: 'var(--ui-success-200)',
    accentStart: 'var(--ui-success-300)',
    accentEnd: 'var(--ui-success-700)'
  },
  warning: {
    solidBg: 'var(--ui-warning-700)',
    solidFg: 'var(--ui-neutral-0)',
    solidBorder: 'var(--ui-warning-700)',
    solidBgHover: 'var(--ui-warning-800)',
    solidBgActive: 'var(--ui-warning-900)',
    softBg: 'var(--ui-warning-50)',
    softFg: 'var(--ui-warning-800)',
    softBorder: 'var(--ui-warning-200)',
    softBgHover: 'var(--ui-warning-100)',
    softBgActive: 'var(--ui-warning-200)',
    accentStart: 'var(--ui-warning-300)',
    accentEnd: 'var(--ui-warning-700)'
  },
  danger: {
    solidBg: 'var(--ui-danger-600)',
    solidFg: 'var(--ui-neutral-0)',
    solidBorder: 'var(--ui-danger-600)',
    solidBgHover: 'var(--ui-danger-700)',
    solidBgActive: 'var(--ui-danger-800)',
    softBg: 'var(--ui-danger-50)',
    softFg: 'var(--ui-danger-700)',
    softBorder: 'var(--ui-danger-200)',
    softBgHover: 'var(--ui-danger-100)',
    softBgActive: 'var(--ui-danger-200)',
    accentStart: 'var(--ui-danger-300)',
    accentEnd: 'var(--ui-danger-700)'
  },
  critical: {
    solidBg: 'color-mix(in srgb, var(--ui-danger-900) 78%, var(--ui-neutral-950))',
    solidFg: 'var(--ui-neutral-0)',
    solidBorder: 'color-mix(in srgb, var(--ui-danger-900) 78%, var(--ui-neutral-950))',
    solidBgHover: 'color-mix(in srgb, var(--ui-danger-900) 88%, var(--ui-neutral-950))',
    solidBgActive: 'var(--ui-neutral-950)',
    softBg: 'color-mix(in srgb, var(--ui-danger-50) 88%, var(--ui-neutral-0))',
    softFg: 'var(--ui-danger-800)',
    softBorder: 'var(--ui-danger-200)',
    softBgHover: 'var(--ui-danger-100)',
    softBgActive: 'var(--ui-danger-200)',
    accentStart: 'var(--ui-danger-500)',
    accentEnd: 'var(--ui-warning-500)'
  }
});

export const lightTheme: ThemeContract = {
  'text-primary': 'var(--ui-neutral-900)',
  'text-secondary': 'var(--ui-neutral-700)',
  'text-muted': 'var(--ui-neutral-500)',
  'text-inverse': 'var(--ui-neutral-0)',
  'text-danger': 'var(--ui-danger-700)',
  'text-success': 'var(--ui-success-700)',
  'text-warning': 'var(--ui-warning-800)',
  'text-font-family': 'var(--ui-font-family-sans)',
  'text-font-size-body': 'var(--ui-font-size-md)',
  'text-font-size-sm': 'var(--ui-font-size-sm)',
  'text-font-size-lg': 'var(--ui-font-size-lg)',
  'text-line-height-body': 'var(--ui-line-height-body)',
  'surface-canvas': 'var(--ui-neutral-50)',
  'surface-sunken': 'var(--ui-neutral-100)',
  'surface-default': 'var(--ui-neutral-0)',
  'surface-raised': 'var(--ui-neutral-0)',
  'surface-overlay': 'var(--ui-neutral-0)',
  'surface-brand-soft': 'var(--ui-brand-50)',
  'surface-success-soft': 'var(--ui-success-50)',
  'surface-warning-soft': 'var(--ui-warning-50)',
  'surface-danger-soft': 'var(--ui-danger-50)',
  'border-subtle': 'var(--ui-neutral-200)',
  'border-strong': 'var(--ui-neutral-300)',
  'border-danger': 'var(--ui-danger-300)',
  'border-focus': 'var(--ui-brand-500)',
  'action-primary-bg': 'var(--ui-brand-600)',
  'action-primary-bg-hover': 'var(--ui-brand-700)',
  'action-primary-bg-active': 'var(--ui-brand-800)',
  'action-primary-fg': 'var(--ui-neutral-0)',
  'action-secondary-bg': 'var(--ui-neutral-0)',
  'action-secondary-bg-hover': 'var(--ui-neutral-50)',
  'action-secondary-bg-active': 'var(--ui-neutral-100)',
  'action-secondary-fg': 'var(--ui-neutral-900)',
  'action-ghost-bg-hover': 'var(--ui-neutral-100)',
  'action-ghost-bg-active': 'var(--ui-neutral-200)',
  'action-ghost-fg': 'var(--ui-neutral-800)',
  'action-danger-bg': 'var(--ui-danger-600)',
  'action-danger-bg-hover': 'var(--ui-danger-700)',
  'action-danger-bg-active': 'var(--ui-danger-800)',
  'action-danger-fg': 'var(--ui-neutral-0)',
  'focus-ring': 'rgba(99, 102, 241, 0.28)',
  'focus-ring-offset': 'var(--ui-neutral-0)',
  'state-disabled-opacity': '0.55',
  'state-loading-opacity': '0.72',
  'overlay-backdrop': 'rgba(15, 23, 42, 0.48)',
  'overlay-backdrop-strong': 'rgba(15, 23, 42, 0.64)',
  'button-font-weight': 'var(--ui-font-weight-semibold)',
  'button-gap': 'var(--ui-space-2)',
  'button-radius': 'var(--ui-radius-md)',
  'button-height-sm': '2rem',
  'button-height-md': '2.5rem',
  'button-height-lg': '3rem',
  'button-padding-inline-sm': 'var(--ui-space-3)',
  'button-padding-inline-md': 'var(--ui-space-4)',
  'button-padding-inline-lg': 'var(--ui-space-5)',
  'button-spinner-size-sm': '0.875rem',
  'button-spinner-size-md': '1rem',
  'button-spinner-size-lg': '1.125rem',
  'button-effect-border-width': '1px',
  'button-primary-bg': 'var(--ui-button-brand-solid-bg)',
  'button-primary-fg': 'var(--ui-button-brand-solid-fg)',
  'button-primary-border': 'var(--ui-button-brand-solid-border)',
  'button-primary-bg-hover': 'var(--ui-button-brand-solid-bg-hover)',
  'button-primary-bg-active': 'var(--ui-button-brand-solid-bg-active)',
  'button-secondary-bg': 'var(--ui-button-neutral-soft-bg)',
  'button-secondary-fg': 'var(--ui-button-neutral-soft-fg)',
  'button-secondary-border': 'var(--ui-button-neutral-soft-border)',
  'button-secondary-bg-hover': 'var(--ui-button-neutral-soft-bg-hover)',
  'button-secondary-bg-active': 'var(--ui-button-neutral-soft-bg-active)',
  'button-ghost-bg': 'transparent',
  'button-ghost-fg': 'var(--ui-button-neutral-soft-fg)',
  'button-ghost-border': 'transparent',
  'button-ghost-bg-hover': 'var(--ui-button-neutral-soft-bg-hover)',
  'button-ghost-bg-active': 'var(--ui-button-neutral-soft-bg-active)',
  'button-danger-bg': 'var(--ui-button-danger-solid-bg)',
  'button-danger-fg': 'var(--ui-button-danger-solid-fg)',
  'button-danger-border': 'var(--ui-button-danger-solid-border)',
  'button-danger-bg-hover': 'var(--ui-button-danger-solid-bg-hover)',
  'button-danger-bg-active': 'var(--ui-button-danger-solid-bg-active)',
  ...lightButtonToneTokens,
  'field-gap': 'var(--ui-space-2)',
  'field-label-color': 'var(--ui-text-secondary)',
  'field-label-size': 'var(--ui-text-font-size-sm)',
  'field-label-weight': 'var(--ui-font-weight-medium)',
  'field-hint-color': 'var(--ui-text-muted)',
  'field-error-color': 'var(--ui-text-danger)',
  'input-min-height': '2.75rem',
  'input-padding-inline': 'var(--ui-space-4)',
  'input-padding-block': '0.625rem',
  'input-radius': 'var(--ui-radius-md)',
  'input-bg': 'var(--ui-surface-default)',
  'input-text': 'var(--ui-text-primary)',
  'input-placeholder': 'var(--ui-text-muted)',
  'input-border': 'var(--ui-border-subtle)',
  'input-border-hover': 'var(--ui-border-strong)',
  'input-border-focus': 'var(--ui-border-focus)',
  'input-ring': 'var(--ui-focus-ring)',
  'input-disabled-bg': 'var(--ui-surface-sunken)',
  'input-disabled-text': 'var(--ui-text-muted)',
  'input-font-size': 'var(--ui-text-font-size-body)',
  'checkbox-size': '1.125rem',
  'checkbox-radius': 'var(--ui-radius-sm)',
  'checkbox-bg': 'var(--ui-surface-default)',
  'checkbox-bg-checked': 'var(--ui-action-primary-bg)',
  'checkbox-border': 'var(--ui-border-subtle)',
  'checkbox-border-checked': 'var(--ui-action-primary-bg)',
  'checkbox-icon': 'var(--ui-text-inverse)',
  'switch-width': '2.75rem',
  'switch-height': '1.5rem',
  'switch-thumb-size': '1.125rem',
  'switch-bg': 'var(--ui-neutral-300)',
  'switch-bg-checked': 'var(--ui-action-primary-bg)',
  'switch-thumb-bg': 'var(--ui-surface-default)',
  'switch-radius': 'var(--ui-radius-pill)',
  'switch-thumb-shadow': 'var(--ui-shadow-xs)',
  'dialog-width': 'min(100%, 32rem)',
  'dialog-radius': 'var(--ui-radius-xl)',
  'dialog-bg': 'var(--ui-surface-overlay)',
  'dialog-border': 'var(--ui-border-subtle)',
  'dialog-shadow': 'var(--ui-shadow-lg)',
  'dialog-padding': 'var(--ui-space-6)',
  'dialog-gap': 'var(--ui-space-4)',
  'dialog-title-color': 'var(--ui-text-primary)',
  'dialog-close-size': '2.25rem',
  'dialog-viewport-padding': 'var(--ui-space-6)',
  'dialog-title-size': 'var(--ui-font-size-xl)',
  'dialog-close-radius': 'var(--ui-radius-pill)',
  'dialog-close-font-size': 'var(--ui-font-size-lg)',
  'drawer-width': 'min(100vw, 28rem)',
  'drawer-bg': 'var(--ui-surface-overlay)',
  'drawer-border': 'var(--ui-border-subtle)',
  'drawer-shadow': 'var(--ui-shadow-lg)',
  'drawer-padding': 'var(--ui-space-6)',
  'drawer-gap': 'var(--ui-space-4)',
  'tabs-list-gap': 'var(--ui-space-2)',
  'tabs-list-border': 'var(--ui-border-subtle)',
  'tabs-list-padding': 'var(--ui-space-1)',
  'tabs-list-radius': 'var(--ui-radius-lg)',
  'tabs-trigger-height': '2.5rem',
  'tabs-trigger-padding-inline': 'var(--ui-space-4)',
  'tabs-trigger-radius': 'var(--ui-radius-md)',
  'tabs-trigger-text': 'var(--ui-text-secondary)',
  'tabs-trigger-text-active': 'var(--ui-text-primary)',
  'tabs-trigger-bg-active': 'var(--ui-surface-default)',
  'tabs-trigger-bg-hover': 'var(--ui-surface-sunken)',
  'tabs-panel-padding-block': 'var(--ui-space-4)',
  'badge-height': '1.625rem',
  'badge-radius': 'var(--ui-radius-pill)',
  'badge-padding-inline': 'var(--ui-space-3)',
  'badge-font-weight': 'var(--ui-font-weight-medium)',
  'badge-neutral-bg': 'var(--ui-neutral-100)',
  'badge-neutral-fg': 'var(--ui-neutral-800)',
  'badge-brand-bg': 'var(--ui-brand-50)',
  'badge-brand-fg': 'var(--ui-brand-700)',
  'badge-success-bg': 'var(--ui-success-50)',
  'badge-success-fg': 'var(--ui-success-700)',
  'badge-warning-bg': 'var(--ui-warning-100)',
  'badge-warning-fg': 'var(--ui-warning-800)',
  'badge-danger-bg': 'var(--ui-danger-50)',
  'badge-danger-fg': 'var(--ui-danger-700)',
  'card-bg': 'var(--ui-surface-default)',
  'card-border': 'var(--ui-border-subtle)',
  'card-radius': 'var(--ui-radius-lg)',
  'card-shadow': 'var(--ui-shadow-sm)',
  'card-padding': 'var(--ui-space-6)',
  'divider-color': 'var(--ui-border-subtle)',
  'spinner-track': 'var(--ui-border-subtle)',
  'spinner-indicator': 'var(--ui-action-primary-bg)',
  ...lightChartTokens,
  ...lightGraphTokens,
  'skeleton-radius': 'var(--ui-radius-md)',
  'skeleton-surface': 'var(--ui-surface-sunken)',
  'skeleton-shimmer': 'var(--ui-surface-raised)',
  'empty-state-gap': 'var(--ui-space-4)',
  'empty-state-icon-size': '3rem',
  'empty-state-icon-radius': 'var(--ui-radius-lg)',
  'empty-state-title-size': 'var(--ui-font-size-xl)',
  'empty-state-title-color': 'var(--ui-text-primary)',
  'empty-state-description-color': 'var(--ui-text-secondary)',
  'empty-state-icon-surface': 'var(--ui-surface-brand-soft)'
};

export const darkTheme: ThemeContract = {
  ...lightTheme,
  'text-primary': 'var(--ui-neutral-50)',
  'text-secondary': 'var(--ui-neutral-300)',
  'text-muted': 'var(--ui-neutral-400)',
  'text-inverse': 'var(--ui-neutral-950)',
  'text-danger': 'var(--ui-danger-300)',
  'text-success': 'var(--ui-success-300)',
  'text-warning': 'var(--ui-warning-300)',
  'surface-canvas': 'var(--ui-neutral-950)',
  'surface-sunken': 'var(--ui-neutral-900)',
  'surface-default': 'var(--ui-neutral-900)',
  'surface-raised': 'var(--ui-neutral-800)',
  'surface-overlay': 'var(--ui-neutral-900)',
  'surface-brand-soft': 'rgba(99, 102, 241, 0.16)',
  'surface-success-soft': 'rgba(16, 185, 129, 0.16)',
  'surface-warning-soft': 'rgba(245, 158, 11, 0.16)',
  'surface-danger-soft': 'rgba(239, 68, 68, 0.18)',
  'border-subtle': 'rgba(148, 163, 184, 0.2)',
  'border-strong': 'rgba(148, 163, 184, 0.34)',
  'border-danger': 'rgba(248, 113, 113, 0.4)',
  'action-primary-bg': 'var(--ui-brand-500)',
  'action-primary-bg-hover': 'var(--ui-brand-400)',
  'action-primary-bg-active': 'var(--ui-brand-300)',
  'action-secondary-bg': 'var(--ui-neutral-900)',
  'action-secondary-bg-hover': 'var(--ui-neutral-800)',
  'action-secondary-bg-active': 'var(--ui-neutral-700)',
  'action-secondary-fg': 'var(--ui-neutral-50)',
  'action-ghost-bg-hover': 'rgba(148, 163, 184, 0.12)',
  'action-ghost-bg-active': 'rgba(148, 163, 184, 0.2)',
  'action-ghost-fg': 'var(--ui-neutral-100)',
  'action-danger-bg': 'var(--ui-danger-500)',
  'action-danger-bg-hover': 'var(--ui-danger-400)',
  'action-danger-bg-active': 'var(--ui-danger-300)',
  'action-primary-fg': 'var(--ui-neutral-950)',
  'action-danger-fg': 'var(--ui-neutral-950)',
  'focus-ring': 'rgba(129, 140, 248, 0.38)',
  'focus-ring-offset': 'var(--ui-neutral-900)',
  'overlay-backdrop': 'rgba(2, 6, 23, 0.7)',
  'overlay-backdrop-strong': 'rgba(2, 6, 23, 0.82)',
  ...darkButtonToneTokens,
  'input-bg': 'var(--ui-neutral-900)',
  'input-border': 'var(--ui-border-strong)',
  'input-disabled-bg': 'rgba(148, 163, 184, 0.08)',
  'checkbox-bg': 'var(--ui-neutral-900)',
  'switch-bg': 'rgba(148, 163, 184, 0.28)',
  'dialog-border': 'var(--ui-border-strong)',
  'drawer-border': 'var(--ui-border-strong)',
  'badge-neutral-bg': 'rgba(148, 163, 184, 0.16)',
  'badge-neutral-fg': 'var(--ui-neutral-100)',
  'badge-brand-bg': 'rgba(99, 102, 241, 0.16)',
  'badge-brand-fg': 'var(--ui-brand-200)',
  'badge-success-bg': 'rgba(16, 185, 129, 0.16)',
  'badge-success-fg': 'var(--ui-success-200)',
  'badge-warning-bg': 'rgba(245, 158, 11, 0.18)',
  'badge-warning-fg': 'var(--ui-warning-200)',
  'badge-danger-bg': 'rgba(239, 68, 68, 0.18)',
  'badge-danger-fg': 'var(--ui-danger-200)',
  'card-border': 'var(--ui-border-subtle)',
  'card-shadow': 'var(--ui-shadow-md)',
  ...darkChartTokens,
  ...darkGraphTokens,
  'skeleton-surface': 'rgba(148, 163, 184, 0.14)',
  'skeleton-shimmer': 'rgba(255, 255, 255, 0.08)',
  'empty-state-icon-surface': 'rgba(99, 102, 241, 0.16)'
};

const belovodyeBaseOverrides: Partial<Record<BaseTokenName, string>> = {
  'neutral-0': '#ffffff',
  'neutral-50': '#f8fbfd',
  'neutral-100': '#f2f7fa',
  'neutral-200': '#e7eff4',
  'neutral-300': '#d7e4ec',
  'neutral-400': '#bfd1dc',
  'neutral-500': '#9bb2c1',
  'neutral-600': '#718a99',
  'neutral-700': '#566d7b',
  'neutral-800': '#3c515e',
  'neutral-900': '#253844',
  'neutral-950': '#142530',
  'brand-50': '#eefbff',
  'brand-100': '#d8f4ff',
  'brand-200': '#b0e7ff',
  'brand-300': '#7fd7ff',
  'brand-400': '#46c1ff',
  'brand-500': '#169fe8',
  'brand-600': '#107fbe',
  'brand-700': '#12638f',
  'brand-800': '#144f70',
  'brand-900': '#15425a',
  'success-50': '#edf9f4',
  'success-100': '#d7f2e7',
  'success-200': '#b0e5ce',
  'success-300': '#76d1ac',
  'success-400': '#45b98d',
  'success-500': '#1f9f73',
  'success-600': '#167e5a',
  'success-700': '#0f6247',
  'success-800': '#0f4c38',
  'success-900': '#103b2d',
  'warning-50': '#fff8ec',
  'warning-100': '#fdeccc',
  'warning-200': '#f7d89c',
  'warning-300': '#e8bc61',
  'warning-400': '#d79f36',
  'warning-500': '#c78920',
  'warning-600': '#a56d19',
  'warning-700': '#825415',
  'warning-800': '#654111',
  'warning-900': '#4e330d',
  'danger-50': '#fff3f4',
  'danger-100': '#ffe2e7',
  'danger-200': '#f8bcc7',
  'danger-300': '#ec8f9f',
  'danger-400': '#dc6678',
  'danger-500': '#c54d5d',
  'danger-600': '#a03d4b',
  'danger-700': '#7d313c',
  'danger-800': '#61272f',
  'danger-900': '#4b1f25',
  'shadow-xs': '0 1px 2px rgba(18, 44, 62, 0.06)',
  'shadow-sm': '0 6px 16px rgba(20, 66, 96, 0.08)',
  'shadow-md': '0 16px 36px rgba(20, 66, 96, 0.12)',
  'shadow-lg': '0 24px 52px rgba(20, 66, 96, 0.14)',
  'shadow-xl': '0 36px 72px rgba(14, 43, 61, 0.18)'
};

export const belovodyeTheme: ThemeContract = {
  ...lightTheme,
  ...belovodyeBaseOverrides,
  'text-primary': 'var(--ui-neutral-900)',
  'text-secondary': 'var(--ui-neutral-700)',
  'text-muted': 'var(--ui-neutral-600)',
  'text-inverse': 'var(--ui-neutral-0)',
  'text-danger': 'var(--ui-danger-700)',
  'text-success': 'var(--ui-success-700)',
  'text-warning': 'var(--ui-warning-800)',
  'surface-canvas': 'var(--ui-neutral-50)',
  'surface-sunken': 'color-mix(in srgb, var(--ui-neutral-100) 88%, var(--ui-brand-50))',
  'surface-default': 'var(--ui-neutral-0)',
  'surface-raised': 'color-mix(in srgb, var(--ui-neutral-0) 92%, var(--ui-brand-50))',
  'surface-overlay': 'color-mix(in srgb, var(--ui-neutral-0) 96%, var(--ui-brand-100))',
  'surface-brand-soft': 'color-mix(in srgb, var(--ui-brand-50) 90%, var(--ui-neutral-0))',
  'surface-success-soft': 'color-mix(in srgb, var(--ui-success-50) 92%, var(--ui-neutral-0))',
  'surface-warning-soft': 'color-mix(in srgb, var(--ui-warning-50) 92%, var(--ui-neutral-0))',
  'surface-danger-soft': 'color-mix(in srgb, var(--ui-danger-50) 92%, var(--ui-neutral-0))',
  'border-subtle': 'var(--ui-neutral-200)',
  'border-strong': 'var(--ui-neutral-300)',
  'border-danger': 'var(--ui-danger-300)',
  'border-focus': 'var(--ui-brand-500)',
  'action-primary-bg': 'var(--ui-brand-600)',
  'action-primary-bg-hover': 'var(--ui-brand-700)',
  'action-primary-bg-active': 'var(--ui-brand-800)',
  'action-primary-fg': 'var(--ui-neutral-0)',
  'action-secondary-bg': 'color-mix(in srgb, var(--ui-neutral-0) 90%, var(--ui-brand-50))',
  'action-secondary-bg-hover': 'var(--ui-neutral-50)',
  'action-secondary-bg-active': 'var(--ui-neutral-100)',
  'action-secondary-fg': 'var(--ui-neutral-900)',
  'action-ghost-bg-hover': 'var(--ui-neutral-100)',
  'action-ghost-bg-active': 'var(--ui-neutral-200)',
  'action-ghost-fg': 'var(--ui-neutral-800)',
  'action-danger-bg': 'var(--ui-danger-600)',
  'action-danger-bg-hover': 'var(--ui-danger-700)',
  'action-danger-bg-active': 'var(--ui-danger-800)',
  'action-danger-fg': 'var(--ui-neutral-0)',
  'focus-ring': 'rgba(22, 159, 232, 0.22)',
  'focus-ring-offset': 'var(--ui-neutral-0)',
  'overlay-backdrop': 'rgba(20, 37, 48, 0.22)',
  'overlay-backdrop-strong': 'rgba(20, 37, 48, 0.34)',
  ...belovodyeButtonToneTokens,
  'input-bg': 'color-mix(in srgb, var(--ui-neutral-0) 98%, var(--ui-brand-50))',
  'input-border': 'var(--ui-border-subtle)',
  'input-border-hover': 'var(--ui-border-strong)',
  'input-border-focus': 'var(--ui-border-focus)',
  'input-disabled-bg': 'color-mix(in srgb, var(--ui-neutral-100) 78%, var(--ui-brand-50))',
  'input-disabled-text': 'var(--ui-neutral-600)',
  'checkbox-bg': 'var(--ui-neutral-0)',
  'checkbox-border': 'var(--ui-border-strong)',
  'switch-bg': 'var(--ui-neutral-400)',
  'dialog-bg': 'var(--ui-surface-overlay)',
  'dialog-border': 'var(--ui-border-strong)',
  'dialog-shadow': 'var(--ui-shadow-xl)',
  'drawer-bg': 'var(--ui-surface-overlay)',
  'drawer-border': 'var(--ui-border-strong)',
  'drawer-shadow': 'var(--ui-shadow-xl)',
  'tabs-list-border': 'var(--ui-border-subtle)',
  'tabs-trigger-text': 'var(--ui-neutral-700)',
  'tabs-trigger-text-active': 'var(--ui-neutral-900)',
  'tabs-trigger-bg-active': 'var(--ui-neutral-0)',
  'tabs-trigger-bg-hover': 'var(--ui-neutral-100)',
  'badge-neutral-bg': 'var(--ui-neutral-100)',
  'badge-neutral-fg': 'var(--ui-neutral-800)',
  'badge-brand-bg': 'var(--ui-brand-100)',
  'badge-brand-fg': 'var(--ui-brand-800)',
  'badge-success-bg': 'var(--ui-success-50)',
  'badge-success-fg': 'var(--ui-success-700)',
  'badge-warning-bg': 'var(--ui-warning-50)',
  'badge-warning-fg': 'var(--ui-warning-800)',
  'badge-danger-bg': 'var(--ui-danger-50)',
  'badge-danger-fg': 'var(--ui-danger-700)',
  'card-bg': 'var(--ui-surface-default)',
  'card-border': 'var(--ui-border-subtle)',
  'card-shadow': 'var(--ui-shadow-sm)',
  ...belovodyeChartTokens,
  ...belovodyeGraphTokens,
  'spinner-track': 'var(--ui-neutral-200)',
  'spinner-indicator': 'var(--ui-brand-600)',
  'skeleton-surface': 'color-mix(in srgb, var(--ui-neutral-100) 88%, var(--ui-brand-50))',
  'skeleton-shimmer': 'color-mix(in srgb, var(--ui-neutral-0) 82%, var(--ui-brand-100))',
  'empty-state-icon-surface': 'color-mix(in srgb, var(--ui-brand-50) 78%, var(--ui-neutral-0))'
};

const themeDefinitions = Object.freeze({
  light: {
    label: 'Light',
    type: 'light',
    tokens: lightTheme
  },
  dark: {
    label: 'Dark',
    type: 'dark',
    tokens: darkTheme
  },
  belovodye: {
    label: 'Belovodye',
    type: 'light',
    tokens: belovodyeTheme
  }
} satisfies Record<string, ThemeDefinitionInput>);

export type ThemeName = keyof typeof themeDefinitions;

export interface ThemeMeta {
  name: ThemeName;
  label: string;
  type: ThemeType;
}

export interface ThemeDefinition extends ThemeMeta {
  tokens: ThemeContract;
}

export const THEME_NAMES = Object.freeze(Object.keys(themeDefinitions) as ThemeName[]);

export const THEMES = Object.freeze(
  THEME_NAMES.reduce<Record<ThemeName, ThemeDefinition>>((accumulator, themeName) => {
    const definition = themeDefinitions[themeName];
    accumulator[themeName] = Object.freeze({
      name: themeName,
      label: definition.label,
      type: definition.type,
      tokens: definition.tokens
    });
    return accumulator;
  }, {} as Record<ThemeName, ThemeDefinition>)
);

export const THEME_LABELS = Object.freeze(
  THEME_NAMES.reduce<Record<ThemeName, string>>((accumulator, themeName) => {
    accumulator[themeName] = THEMES[themeName].label;
    return accumulator;
  }, {} as Record<ThemeName, string>)
);

export const themeRegistry = Object.freeze(
  THEME_NAMES.reduce<Record<ThemeName, ThemeContract>>((accumulator, themeName) => {
    accumulator[themeName] = THEMES[themeName].tokens;
    return accumulator;
  }, {} as Record<ThemeName, ThemeContract>)
);

export function getThemeMeta(themeName: ThemeName): ThemeMeta {
  const theme = THEMES[themeName];
  return {
    name: theme.name,
    label: theme.label,
    type: theme.type
  };
}

export function getThemeType(themeName: ThemeName): ThemeType {
  return THEMES[themeName].type;
}

export function getThemesByType(themeType: ThemeType): ThemeMeta[] {
  return THEME_NAMES.filter((themeName) => THEMES[themeName].type === themeType).map(getThemeMeta);
}

export function isLightTheme(themeName: ThemeName): boolean {
  return getThemeType(themeName) === 'light';
}

export function isDarkTheme(themeName: ThemeName): boolean {
  return getThemeType(themeName) === 'dark';
}
