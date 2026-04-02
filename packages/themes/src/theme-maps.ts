import type {
  BaseTokenName,
  ComponentTokenName,
  ThemeSemanticTokenName,
  ThemeTokenMap,
} from '@ww/tokens';
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
  ...foundationSemanticTokenValues,
});

const buttonToneNames = [
  'neutral',
  'brand',
  'debug',
  'info',
  'success',
  'warning',
  'danger',
  'critical',
] as const;

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
type DataGridTokenName = Extract<ComponentTokenName, `data-grid-${string}`>;
type DataGridTokenValues = Record<DataGridTokenName, string>;
type GraphTokenName = Extract<ComponentTokenName, `graph-${string}`>;
type GraphTokenValues = Record<GraphTokenName, string>;

const lightDataGridTokens: DataGridTokenValues = {
  'data-grid-surface': 'var(--ui-surface-default)',
  'data-grid-header-surface':
    'color-mix(in srgb, var(--ui-surface-sunken) 78%, var(--ui-surface-default))',
  'data-grid-toolbar-surface':
    'color-mix(in srgb, var(--ui-surface-default) 94%, var(--ui-surface-brand-soft))',
  'data-grid-row-border': 'var(--ui-border-subtle)',
  'data-grid-row-hover':
    'color-mix(in srgb, var(--ui-surface-brand-soft) 58%, var(--ui-surface-default))',
  'data-grid-row-selected':
    'color-mix(in srgb, var(--ui-surface-brand-soft) 82%, var(--ui-surface-default))',
  'data-grid-row-selected-border': 'var(--ui-border-focus)',
  'data-grid-bulk-actions-surface':
    'color-mix(in srgb, var(--ui-surface-brand-soft) 78%, var(--ui-surface-default))',
  'data-grid-empty-surface':
    'color-mix(in srgb, var(--ui-surface-default) 92%, var(--ui-surface-brand-soft))',
  'data-grid-no-results-surface':
    'color-mix(in srgb, var(--ui-surface-default) 88%, var(--ui-surface-warning-soft))',
  'data-grid-error-surface':
    'color-mix(in srgb, var(--ui-surface-default) 88%, var(--ui-surface-danger-soft))',
  'data-grid-sort-indicator': 'var(--ui-action-primary-bg)',
  'data-grid-column-visibility-surface': 'var(--ui-surface-overlay)',
  'data-grid-column-visibility-border': 'var(--ui-border-strong)',
};

const darkDataGridTokens: DataGridTokenValues = {
  'data-grid-surface': 'color-mix(in srgb, var(--ui-surface-default) 96%, transparent)',
  'data-grid-header-surface':
    'color-mix(in srgb, var(--ui-surface-sunken) 84%, var(--ui-surface-default))',
  'data-grid-toolbar-surface': 'rgba(99, 102, 241, 0.12)',
  'data-grid-row-border': 'var(--ui-border-subtle)',
  'data-grid-row-hover': 'rgba(148, 163, 184, 0.08)',
  'data-grid-row-selected': 'rgba(129, 140, 248, 0.18)',
  'data-grid-row-selected-border': 'var(--ui-brand-300)',
  'data-grid-bulk-actions-surface': 'rgba(129, 140, 248, 0.18)',
  'data-grid-empty-surface': 'rgba(148, 163, 184, 0.12)',
  'data-grid-no-results-surface': 'rgba(245, 158, 11, 0.12)',
  'data-grid-error-surface': 'rgba(239, 68, 68, 0.14)',
  'data-grid-sort-indicator': 'var(--ui-brand-300)',
  'data-grid-column-visibility-surface': 'var(--ui-surface-overlay)',
  'data-grid-column-visibility-border': 'var(--ui-border-strong)',
};

const belovodyeDataGridTokens: DataGridTokenValues = {
  'data-grid-surface': 'color-mix(in srgb, var(--ui-surface-default) 96%, transparent)',
  'data-grid-header-surface':
    'color-mix(in srgb, var(--ui-surface-sunken) 84%, var(--ui-surface-default))',
  'data-grid-toolbar-surface': 'rgba(46, 157, 168, 0.12)',
  'data-grid-row-border': 'var(--ui-border-subtle)',
  'data-grid-row-hover': 'rgba(127, 229, 216, 0.08)',
  'data-grid-row-selected': 'rgba(46, 157, 168, 0.18)',
  'data-grid-row-selected-border': 'var(--ui-brand-300)',
  'data-grid-bulk-actions-surface': 'rgba(46, 157, 168, 0.18)',
  'data-grid-empty-surface': 'rgba(214, 248, 255, 0.03)',
  'data-grid-no-results-surface': 'rgba(255, 191, 108, 0.12)',
  'data-grid-error-surface': 'rgba(255, 141, 150, 0.14)',
  'data-grid-sort-indicator': 'var(--ui-brand-300)',
  'data-grid-column-visibility-surface': 'var(--ui-surface-overlay)',
  'data-grid-column-visibility-border': 'var(--ui-border-strong)',
};

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
      [`button-${tone}-accent-end`, tones[tone].accentEnd],
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
  'chart-state-surface-loading':
    'color-mix(in srgb, var(--ui-surface-default) 90%, var(--ui-surface-brand-soft))',
  'chart-state-surface-empty':
    'color-mix(in srgb, var(--ui-surface-default) 88%, var(--ui-surface-brand-soft))',
  'chart-state-surface-error':
    'color-mix(in srgb, var(--ui-surface-default) 88%, var(--ui-surface-danger-soft))',
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
  'chart-state-surface-error': 'rgba(239, 68, 68, 0.16)',
};

const belovodyeChartTokens: ChartTokenValues = {
  'chart-series-1': 'var(--ui-brand-400)',
  'chart-series-2': 'var(--ui-success-400)',
  'chart-series-3': 'var(--ui-warning-300)',
  'chart-series-4': 'var(--ui-danger-300)',
  'chart-series-5': 'var(--ui-neutral-300)',
  'chart-series-6': 'var(--ui-brand-200)',
  'chart-series-7': 'var(--ui-success-200)',
  'chart-series-8': 'var(--ui-warning-200)',
  'chart-grid-line': 'rgba(124, 167, 186, 0.18)',
  'chart-axis-label': 'var(--ui-text-secondary)',
  'chart-axis-border': 'rgba(124, 167, 186, 0.24)',
  'chart-axis-tick': 'rgba(124, 167, 186, 0.34)',
  'chart-legend-text': 'var(--ui-text-secondary)',
  'chart-tooltip-bg': 'var(--ui-surface-overlay)',
  'chart-tooltip-text': 'var(--ui-text-primary)',
  'chart-tooltip-border': 'var(--ui-border-strong)',
  'chart-crosshair': 'rgba(110, 242, 220, 0.24)',
  'chart-selection-fill': 'rgba(46, 157, 168, 0.18)',
  'chart-selection-border': 'var(--ui-brand-300)',
  'chart-marker-stroke': 'var(--ui-neutral-950)',
  'chart-no-data-text': 'var(--ui-text-muted)',
  'chart-toolbar-color': 'var(--ui-text-secondary)',
  'chart-state-surface-loading': 'rgba(46, 157, 168, 0.16)',
  'chart-state-surface-empty': 'rgba(214, 248, 255, 0.03)',
  'chart-state-surface-error': 'rgba(255, 141, 150, 0.16)',
};

const lightGraphTokens: GraphTokenValues = {
  'graph-canvas-bg':
    'color-mix(in srgb, var(--ui-surface-canvas) 94%, var(--ui-surface-brand-soft))',
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
  'graph-signal-reaction-color': 'var(--ui-action-primary-bg)',
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
  'graph-signal-reaction-color': 'var(--ui-brand-300)',
};

const belovodyeGraphTokens: GraphTokenValues = {
  'graph-canvas-bg': 'color-mix(in srgb, var(--ui-surface-canvas) 92%, var(--ui-brand-900))',
  'graph-grid-minor': 'rgba(124, 167, 186, 0.18)',
  'graph-grid-major': 'rgba(124, 167, 186, 0.28)',
  'graph-node-surface': 'color-mix(in srgb, var(--ui-surface-default) 94%, transparent)',
  'graph-node-border': 'var(--ui-border-subtle)',
  'graph-node-text': 'var(--ui-text-primary)',
  'graph-node-active-ring': 'var(--ui-brand-300)',
  'graph-node-related-ring': 'rgba(110, 242, 220, 0.34)',
  'graph-node-glow': 'rgba(46, 157, 168, 0.28)',
  'graph-node-glass-bg': 'color-mix(in srgb, var(--ui-surface-overlay) 72%, transparent)',
  'graph-node-glass-border': 'rgba(124, 167, 186, 0.24)',
  'graph-edge-idle': 'rgba(124, 167, 186, 0.42)',
  'graph-edge-related': 'rgba(110, 242, 220, 0.48)',
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
  'graph-signal-reaction-color': 'var(--ui-brand-300)',
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
    accentEnd: 'var(--ui-neutral-700)',
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
    accentEnd: 'var(--ui-brand-700)',
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
    accentEnd: 'var(--ui-brand-900)',
  },
  info: {
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
    accentStart: 'var(--ui-brand-200)',
    accentEnd: 'var(--ui-brand-600)',
  },
  success: {
    solidBg: 'var(--ui-success-700)',
    solidFg: 'var(--ui-neutral-0)',
    solidBorder: 'var(--ui-success-700)',
    solidBgHover: 'var(--ui-success-800)',
    solidBgActive: 'var(--ui-success-900)',
    softBg: 'var(--ui-success-50)',
    softFg: 'var(--ui-success-700)',
    softBorder: 'var(--ui-success-200)',
    softBgHover: 'var(--ui-success-100)',
    softBgActive: 'var(--ui-success-200)',
    accentStart: 'var(--ui-success-300)',
    accentEnd: 'var(--ui-success-700)',
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
    accentEnd: 'var(--ui-warning-700)',
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
    accentEnd: 'var(--ui-danger-700)',
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
    accentEnd: 'var(--ui-warning-500)',
  },
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
    accentEnd: 'var(--ui-neutral-50)',
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
    accentEnd: 'var(--ui-brand-100)',
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
    accentEnd: 'var(--ui-brand-100)',
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
    accentEnd: 'var(--ui-brand-50)',
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
    accentEnd: 'var(--ui-success-100)',
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
    accentEnd: 'var(--ui-warning-100)',
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
    accentEnd: 'var(--ui-danger-100)',
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
    accentEnd: 'var(--ui-warning-200)',
  },
});

const belovodyeButtonToneTokens = createButtonToneTokens({
  neutral: {
    solidBg: 'var(--ui-neutral-100)',
    solidFg: 'var(--ui-neutral-950)',
    solidBorder: 'var(--ui-neutral-100)',
    solidBgHover: 'var(--ui-neutral-50)',
    solidBgActive: 'var(--ui-neutral-0)',
    softBg: 'rgba(132, 170, 188, 0.08)',
    softFg: 'var(--ui-neutral-100)',
    softBorder: 'var(--ui-border-strong)',
    softBgHover: 'rgba(132, 170, 188, 0.16)',
    softBgActive: 'rgba(132, 170, 188, 0.24)',
    accentStart: 'var(--ui-neutral-300)',
    accentEnd: 'var(--ui-neutral-50)',
  },
  brand: {
    solidBg: 'var(--ui-brand-400)',
    solidFg: 'var(--ui-neutral-950)',
    solidBorder: 'var(--ui-brand-400)',
    solidBgHover: 'var(--ui-brand-300)',
    solidBgActive: 'var(--ui-brand-200)',
    softBg: 'rgba(46, 157, 168, 0.16)',
    softFg: 'var(--ui-brand-200)',
    softBorder: 'rgba(110, 242, 220, 0.34)',
    softBgHover: 'rgba(46, 157, 168, 0.24)',
    softBgActive: 'rgba(46, 157, 168, 0.32)',
    accentStart: 'var(--ui-brand-300)',
    accentEnd: 'var(--ui-brand-100)',
  },
  debug: {
    solidBg: 'var(--ui-brand-500)',
    solidFg: 'var(--ui-neutral-950)',
    solidBorder: 'var(--ui-brand-500)',
    solidBgHover: 'var(--ui-brand-400)',
    solidBgActive: 'var(--ui-brand-300)',
    softBg: 'rgba(46, 157, 168, 0.22)',
    softFg: 'var(--ui-brand-100)',
    softBorder: 'rgba(110, 242, 220, 0.42)',
    softBgHover: 'rgba(46, 157, 168, 0.3)',
    softBgActive: 'rgba(46, 157, 168, 0.38)',
    accentStart: 'var(--ui-brand-400)',
    accentEnd: 'var(--ui-brand-100)',
  },
  info: {
    solidBg: 'var(--ui-brand-300)',
    solidFg: 'var(--ui-neutral-950)',
    solidBorder: 'var(--ui-brand-300)',
    solidBgHover: 'var(--ui-brand-200)',
    solidBgActive: 'var(--ui-brand-100)',
    softBg: 'rgba(110, 242, 220, 0.14)',
    softFg: 'var(--ui-brand-100)',
    softBorder: 'rgba(201, 253, 241, 0.34)',
    softBgHover: 'rgba(110, 242, 220, 0.22)',
    softBgActive: 'rgba(110, 242, 220, 0.3)',
    accentStart: 'var(--ui-brand-200)',
    accentEnd: 'var(--ui-brand-50)',
  },
  success: {
    solidBg: 'var(--ui-success-400)',
    solidFg: 'var(--ui-neutral-950)',
    solidBorder: 'var(--ui-success-400)',
    solidBgHover: 'var(--ui-success-300)',
    solidBgActive: 'var(--ui-success-200)',
    softBg: 'rgba(45, 212, 191, 0.16)',
    softFg: 'var(--ui-success-200)',
    softBorder: 'rgba(110, 242, 220, 0.34)',
    softBgHover: 'rgba(45, 212, 191, 0.24)',
    softBgActive: 'rgba(45, 212, 191, 0.32)',
    accentStart: 'var(--ui-success-300)',
    accentEnd: 'var(--ui-success-100)',
  },
  warning: {
    solidBg: 'var(--ui-warning-300)',
    solidFg: 'var(--ui-neutral-950)',
    solidBorder: 'var(--ui-warning-300)',
    solidBgHover: 'var(--ui-warning-200)',
    solidBgActive: 'var(--ui-warning-100)',
    softBg: 'rgba(255, 191, 108, 0.18)',
    softFg: 'var(--ui-warning-200)',
    softBorder: 'rgba(255, 191, 108, 0.36)',
    softBgHover: 'rgba(255, 191, 108, 0.26)',
    softBgActive: 'rgba(255, 191, 108, 0.34)',
    accentStart: 'var(--ui-warning-300)',
    accentEnd: 'var(--ui-warning-100)',
  },
  danger: {
    solidBg: 'var(--ui-danger-300)',
    solidFg: 'var(--ui-neutral-950)',
    solidBorder: 'var(--ui-danger-300)',
    solidBgHover: 'var(--ui-danger-200)',
    solidBgActive: 'var(--ui-danger-100)',
    softBg: 'rgba(255, 141, 150, 0.18)',
    softFg: 'var(--ui-danger-200)',
    softBorder: 'rgba(255, 141, 150, 0.38)',
    softBgHover: 'rgba(255, 141, 150, 0.26)',
    softBgActive: 'rgba(255, 141, 150, 0.34)',
    accentStart: 'var(--ui-danger-300)',
    accentEnd: 'var(--ui-danger-100)',
  },
  critical: {
    solidBg: 'color-mix(in srgb, var(--ui-danger-500) 72%, var(--ui-neutral-950))',
    solidFg: 'var(--ui-neutral-50)',
    solidBorder: 'color-mix(in srgb, var(--ui-danger-500) 72%, var(--ui-neutral-950))',
    solidBgHover: 'color-mix(in srgb, var(--ui-danger-400) 78%, var(--ui-neutral-950))',
    solidBgActive: 'var(--ui-neutral-950)',
    softBg: 'rgba(255, 141, 150, 0.14)',
    softFg: 'var(--ui-danger-100)',
    softBorder: 'rgba(255, 141, 150, 0.42)',
    softBgHover: 'rgba(255, 141, 150, 0.22)',
    softBgActive: 'rgba(255, 141, 150, 0.3)',
    accentStart: 'var(--ui-danger-300)',
    accentEnd: 'var(--ui-warning-200)',
  },
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
  'text-letter-spacing-body': 'var(--ui-letter-spacing-body)',
  'text-letter-spacing-label': 'var(--ui-letter-spacing-label)',
  'text-letter-spacing-display': 'var(--ui-letter-spacing-display)',
  'text-transform-label': 'var(--ui-text-transform-none)',
  'text-font-feature-settings-body': 'var(--ui-font-feature-default)',
  'text-font-feature-settings-display': 'var(--ui-font-feature-display)',
  'text-font-smoothing-webkit': 'var(--ui-font-smoothing-webkit)',
  'text-font-smoothing-moz': 'var(--ui-font-smoothing-moz)',
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
  ...lightDataGridTokens,
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
  'empty-state-icon-surface': 'var(--ui-surface-brand-soft)',
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
  ...darkDataGridTokens,
  ...darkChartTokens,
  ...darkGraphTokens,
  'skeleton-surface': 'rgba(148, 163, 184, 0.14)',
  'skeleton-shimmer': 'rgba(255, 255, 255, 0.08)',
  'empty-state-icon-surface': 'rgba(99, 102, 241, 0.16)',
};

const belovodyeBaseOverrides: Partial<Record<BaseTokenName, string>> = {
  'neutral-0': '#f7fbff',
  'neutral-50': '#e7eff6',
  'neutral-100': '#d9ebf8',
  'neutral-200': '#b7cedf',
  'neutral-300': '#9db3c5',
  'neutral-400': '#93adbf',
  'neutral-500': '#6f8798',
  'neutral-600': '#5c7284',
  'neutral-700': '#2b4658',
  'neutral-800': '#152733',
  'neutral-900': '#0a1a24',
  'neutral-950': '#06121a',
  'brand-50': '#e6fff8',
  'brand-100': '#c9fdf1',
  'brand-200': '#92f2d9',
  'brand-300': '#6ef2dc',
  'brand-400': '#5de4c3',
  'brand-500': '#2dd4bf',
  'brand-600': '#26b7a8',
  'brand-700': '#1b9187',
  'brand-800': '#126a67',
  'brand-900': '#0d4b4e',
  'success-50': '#e8fff7',
  'success-100': '#c9f7ea',
  'success-200': '#92eed5',
  'success-300': '#68dfbc',
  'success-400': '#45c9a0',
  'success-500': '#2ea984',
  'success-600': '#237f66',
  'success-700': '#185f4d',
  'success-800': '#114338',
  'success-900': '#0b2d26',
  'warning-50': '#fff6ea',
  'warning-100': '#ffe7be',
  'warning-200': '#ffd498',
  'warning-300': '#ffbf6c',
  'warning-400': '#e7a85d',
  'warning-500': '#c88747',
  'warning-600': '#a36b39',
  'warning-700': '#80522d',
  'warning-800': '#603d21',
  'warning-900': '#452b18',
  'danger-50': '#fff1f3',
  'danger-100': '#ffd6db',
  'danger-200': '#ffb0b7',
  'danger-300': '#ff8d96',
  'danger-400': '#ef6d78',
  'danger-500': '#d55362',
  'danger-600': '#ae4350',
  'danger-700': '#87333d',
  'danger-800': '#63252d',
  'danger-900': '#45181e',
  'shadow-xs': '0 1px 2px rgba(2, 8, 14, 0.32)',
  'shadow-sm': '0 10px 24px rgba(2, 8, 14, 0.3)',
  'shadow-md': '0 18px 42px rgba(2, 8, 14, 0.36)',
  'shadow-lg': '0 28px 64px rgba(2, 8, 14, 0.42)',
  'shadow-xl': '0 40px 90px rgba(2, 8, 14, 0.5)',
};

export const belovodyeTheme: ThemeContract = {
  ...darkTheme,
  ...belovodyeBaseOverrides,
  'text-primary': 'var(--ui-neutral-50)',
  'text-secondary': 'var(--ui-neutral-300)',
  'text-muted': 'var(--ui-neutral-400)',
  'text-inverse': 'var(--ui-neutral-950)',
  'text-danger': 'var(--ui-danger-300)',
  'text-success': 'var(--ui-success-300)',
  'text-warning': 'var(--ui-warning-300)',
  'surface-canvas': 'var(--ui-neutral-950)',
  'surface-sunken': 'var(--ui-neutral-900)',
  'surface-default': 'rgba(8, 20, 31, 0.76)',
  'surface-raised': 'rgba(10, 24, 36, 0.9)',
  'surface-overlay': 'rgba(8, 22, 34, 0.98)',
  'surface-brand-soft': 'rgba(46, 157, 168, 0.14)',
  'surface-success-soft': 'rgba(45, 212, 191, 0.14)',
  'surface-warning-soft': 'rgba(255, 191, 108, 0.14)',
  'surface-danger-soft': 'rgba(255, 141, 150, 0.16)',
  'border-subtle': 'rgba(132, 170, 188, 0.22)',
  'border-strong': 'rgba(118, 176, 201, 0.34)',
  'border-danger': 'rgba(255, 141, 150, 0.38)',
  'border-focus': 'var(--ui-brand-300)',
  'action-primary-bg': 'var(--ui-brand-400)',
  'action-primary-bg-hover': 'var(--ui-brand-300)',
  'action-primary-bg-active': 'var(--ui-brand-200)',
  'action-primary-fg': 'var(--ui-neutral-950)',
  'action-secondary-bg': 'rgba(10, 24, 36, 0.82)',
  'action-secondary-bg-hover': 'rgba(14, 46, 66, 0.84)',
  'action-secondary-bg-active': 'rgba(21, 70, 82, 0.48)',
  'action-secondary-fg': 'var(--ui-neutral-50)',
  'action-ghost-bg-hover': 'rgba(127, 229, 216, 0.08)',
  'action-ghost-bg-active': 'rgba(46, 157, 168, 0.14)',
  'action-ghost-fg': 'var(--ui-neutral-100)',
  'action-danger-bg': 'var(--ui-danger-400)',
  'action-danger-bg-hover': 'var(--ui-danger-300)',
  'action-danger-bg-active': 'var(--ui-danger-200)',
  'action-danger-fg': 'var(--ui-neutral-950)',
  'focus-ring': 'rgba(110, 242, 220, 0.3)',
  'focus-ring-offset': 'var(--ui-neutral-900)',
  'overlay-backdrop': 'rgba(2, 8, 14, 0.76)',
  'overlay-backdrop-strong': 'rgba(5, 14, 23, 0.92)',
  ...belovodyeButtonToneTokens,
  'input-bg': 'linear-gradient(146deg, rgba(8, 22, 34, 0.98), rgba(5, 14, 23, 0.98))',
  'input-border': 'rgba(124, 167, 186, 0.22)',
  'input-border-hover': 'rgba(118, 176, 201, 0.34)',
  'input-border-focus': 'var(--ui-border-focus)',
  'input-disabled-bg': 'rgba(2, 7, 12, 0.5)',
  'input-disabled-text': 'var(--ui-neutral-500)',
  'checkbox-bg': 'rgba(8, 22, 34, 0.98)',
  'checkbox-border': 'var(--ui-border-strong)',
  'switch-bg': 'rgba(132, 170, 188, 0.28)',
  'dialog-bg': 'linear-gradient(152deg, rgba(8, 22, 34, 0.98), rgba(5, 14, 23, 0.99))',
  'dialog-border': 'var(--ui-border-strong)',
  'dialog-shadow': 'var(--ui-shadow-xl)',
  'drawer-bg': 'linear-gradient(152deg, rgba(8, 22, 34, 0.98), rgba(5, 14, 23, 0.99))',
  'drawer-border': 'var(--ui-border-strong)',
  'drawer-shadow': 'var(--ui-shadow-xl)',
  'tabs-list-border': 'rgba(118, 176, 201, 0.24)',
  'tabs-trigger-text': 'var(--ui-neutral-300)',
  'tabs-trigger-text-active': 'var(--ui-neutral-50)',
  'tabs-trigger-bg-active': 'rgba(14, 46, 66, 0.84)',
  'tabs-trigger-bg-hover': 'rgba(10, 33, 48, 0.84)',
  'badge-neutral-bg': 'rgba(132, 170, 188, 0.16)',
  'badge-neutral-fg': 'var(--ui-neutral-100)',
  'badge-brand-bg': 'rgba(46, 157, 168, 0.16)',
  'badge-brand-fg': 'var(--ui-brand-200)',
  'badge-success-bg': 'rgba(45, 212, 191, 0.16)',
  'badge-success-fg': 'var(--ui-success-200)',
  'badge-warning-bg': 'rgba(255, 191, 108, 0.18)',
  'badge-warning-fg': 'var(--ui-warning-200)',
  'badge-danger-bg': 'rgba(255, 141, 150, 0.18)',
  'badge-danger-fg': 'var(--ui-danger-200)',
  'card-bg': 'linear-gradient(152deg, rgba(8, 20, 31, 0.82), rgba(10, 24, 36, 0.92))',
  'card-border': 'rgba(124, 167, 186, 0.22)',
  'card-shadow': '0 20px 48px rgba(2, 8, 14, 0.34)',
  ...belovodyeDataGridTokens,
  ...belovodyeChartTokens,
  ...belovodyeGraphTokens,
  'spinner-track': 'rgba(124, 167, 186, 0.22)',
  'spinner-indicator': 'var(--ui-brand-400)',
  'skeleton-surface': 'rgba(214, 248, 255, 0.03)',
  'skeleton-shimmer': 'rgba(255, 255, 255, 0.08)',
  'empty-state-icon-surface': 'rgba(46, 157, 168, 0.14)',
};

const themeDefinitions = Object.freeze({
  light: {
    label: 'Light',
    type: 'light',
    tokens: lightTheme,
  },
  dark: {
    label: 'Dark',
    type: 'dark',
    tokens: darkTheme,
  },
  belovodye: {
    label: 'Belovodye',
    type: 'dark',
    tokens: belovodyeTheme,
  },
} satisfies Record<string, ThemeDefinitionInput>);

export type ThemeName = keyof typeof themeDefinitions;

export const THEME_DENSITIES = ['compact', 'default', 'comfortable'] as const;
export type ThemeDensity = (typeof THEME_DENSITIES)[number];

export const THEME_MOTION_PROFILES = ['calm', 'balanced', 'expressive'] as const;
export type ThemeMotionProfile = (typeof THEME_MOTION_PROFILES)[number];

export const THEME_PERSONALITIES = ['neutral', 'accented'] as const;
export type ThemePersonality = (typeof THEME_PERSONALITIES)[number];

export const THEME_RESPONSIVE_BREAKPOINTS = Object.freeze({
  md: '48rem',
  lg: '72rem',
});

export type ThemeResponsiveBreakpoint = keyof typeof THEME_RESPONSIVE_BREAKPOINTS;

export interface ThemeRuntimeOptions {
  density: ThemeDensity;
  motionProfile: ThemeMotionProfile;
  personality: ThemePersonality;
}

type ThemeContractPatch = Partial<ThemeContract>;

export interface ThemeResponsiveOverrides {
  md?: ThemeContractPatch;
  lg?: ThemeContractPatch;
}

export interface ThemeCapabilityOverrides {
  density: Partial<Record<Exclude<ThemeDensity, 'default'>, ThemeContractPatch>>;
  motionProfile: Partial<Record<Exclude<ThemeMotionProfile, 'balanced'>, ThemeContractPatch>>;
  personality: Partial<Record<Exclude<ThemePersonality, 'neutral'>, ThemeContractPatch>>;
  responsive: ThemeResponsiveOverrides;
}

export interface ThemeCapabilityMatrix {
  foundations: readonly string[];
  componentStyles: readonly string[];
  personality: readonly string[];
  systems: readonly string[];
  density: readonly string[];
  typography: readonly string[];
  motion: readonly string[];
  responsive: {
    breakpoints: Readonly<Record<ThemeResponsiveBreakpoint, string>>;
    tokens: readonly string[];
  };
  runtime: {
    writableAttributes: readonly string[];
    derivedAttributes: readonly string[];
  };
}

const DEFAULT_THEME_RUNTIME_OPTIONS = Object.freeze<ThemeRuntimeOptions>({
  density: 'default',
  motionProfile: 'balanced',
  personality: 'neutral',
});

function createDensityOverride(config: {
  badgeHeight: string;
  badgePaddingInline: string;
  buttonHeightLg: string;
  buttonHeightMd: string;
  buttonHeightSm: string;
  buttonPaddingInlineLg: string;
  buttonPaddingInlineMd: string;
  buttonPaddingInlineSm: string;
  cardPadding: string;
  dialogGap: string;
  dialogPadding: string;
  emptyStateGap: string;
  fieldGap: string;
  inputMinHeight: string;
  inputPaddingBlock: string;
  tabsListPadding: string;
  tabsPanelPaddingBlock: string;
  tabsTriggerHeight: string;
  tabsTriggerPaddingInline: string;
}) {
  return {
    'badge-height': config.badgeHeight,
    'badge-padding-inline': config.badgePaddingInline,
    'button-height-sm': config.buttonHeightSm,
    'button-height-md': config.buttonHeightMd,
    'button-height-lg': config.buttonHeightLg,
    'button-padding-inline-sm': config.buttonPaddingInlineSm,
    'button-padding-inline-md': config.buttonPaddingInlineMd,
    'button-padding-inline-lg': config.buttonPaddingInlineLg,
    'card-padding': config.cardPadding,
    'dialog-gap': config.dialogGap,
    'dialog-padding': config.dialogPadding,
    'empty-state-gap': config.emptyStateGap,
    'field-gap': config.fieldGap,
    'input-min-height': config.inputMinHeight,
    'input-padding-block': config.inputPaddingBlock,
    'tabs-list-padding': config.tabsListPadding,
    'tabs-panel-padding-block': config.tabsPanelPaddingBlock,
    'tabs-trigger-height': config.tabsTriggerHeight,
    'tabs-trigger-padding-inline': config.tabsTriggerPaddingInline,
  } satisfies ThemeContractPatch;
}

function createMotionProfileOverride(config: {
  collapseOpacityFactor: string;
  durationLg: string;
  durationMd: string;
  durationSm: string;
  durationXl: string;
  easingStandard?: string;
  feedbackShadowStrong: string;
  overlayEasing: string;
  scale102: string;
  scale104: string;
  stepDistanceSm: string;
  stepDistanceXs: string;
}) {
  return {
    'motion-collapse-opacity-duration-factor': config.collapseOpacityFactor,
    'motion-duration-sm': config.durationSm,
    'motion-duration-md': config.durationMd,
    'motion-duration-lg': config.durationLg,
    'motion-duration-xl': config.durationXl,
    'motion-easing-standard': config.easingStandard ?? 'var(--ui-motion-easing-standard)',
    'motion-scale-102': config.scale102,
    'motion-scale-104': config.scale104,
    'motion-distance-xs': config.stepDistanceXs,
    'motion-distance-sm': config.stepDistanceSm,
    'motion-feedback-shadow-strong': config.feedbackShadowStrong,
    'motion-overlay-easing': config.overlayEasing,
  } satisfies ThemeContractPatch;
}

function createResponsiveOverride(config: {
  buttonHeightLg?: string;
  cardPadding: string;
  dialogPadding: string;
  dialogWidth: string;
  emptyStateGap: string;
  emptyStateIconSize: string;
  textFontSizeLg: string;
}) {
  return {
    ...(config.buttonHeightLg ? { 'button-height-lg': config.buttonHeightLg } : {}),
    'card-padding': config.cardPadding,
    'dialog-padding': config.dialogPadding,
    'dialog-width': config.dialogWidth,
    'empty-state-gap': config.emptyStateGap,
    'empty-state-icon-size': config.emptyStateIconSize,
    'text-font-size-lg': config.textFontSizeLg,
  } satisfies ThemeContractPatch;
}

const themeDensityOverrides = Object.freeze({
  light: {
    compact: createDensityOverride({
      badgeHeight: '1.5rem',
      badgePaddingInline: 'var(--ui-space-2)',
      buttonHeightSm: '1.875rem',
      buttonHeightMd: '2.25rem',
      buttonHeightLg: '2.625rem',
      buttonPaddingInlineSm: 'var(--ui-space-2)',
      buttonPaddingInlineMd: 'var(--ui-space-3)',
      buttonPaddingInlineLg: 'var(--ui-space-4)',
      cardPadding: 'var(--ui-space-4)',
      dialogGap: 'var(--ui-space-3)',
      dialogPadding: 'var(--ui-space-5)',
      emptyStateGap: 'var(--ui-space-3)',
      fieldGap: 'var(--ui-space-1)',
      inputMinHeight: '2.375rem',
      inputPaddingBlock: '0.5rem',
      tabsListPadding: 'var(--ui-space-1)',
      tabsPanelPaddingBlock: 'var(--ui-space-3)',
      tabsTriggerHeight: '2rem',
      tabsTriggerPaddingInline: 'var(--ui-space-3)',
    }),
    comfortable: createDensityOverride({
      badgeHeight: '1.875rem',
      badgePaddingInline: 'var(--ui-space-4)',
      buttonHeightSm: '2.125rem',
      buttonHeightMd: '2.75rem',
      buttonHeightLg: '3.25rem',
      buttonPaddingInlineSm: 'var(--ui-space-3)',
      buttonPaddingInlineMd: 'var(--ui-space-5)',
      buttonPaddingInlineLg: 'var(--ui-space-6)',
      cardPadding: 'var(--ui-space-8)',
      dialogGap: 'var(--ui-space-4)',
      dialogPadding: 'var(--ui-space-8)',
      emptyStateGap: 'var(--ui-space-5)',
      fieldGap: 'var(--ui-space-3)',
      inputMinHeight: '3rem',
      inputPaddingBlock: '0.75rem',
      tabsListPadding: 'var(--ui-space-2)',
      tabsPanelPaddingBlock: 'var(--ui-space-5)',
      tabsTriggerHeight: '2.75rem',
      tabsTriggerPaddingInline: 'var(--ui-space-5)',
    }),
  },
  dark: {
    compact: createDensityOverride({
      badgeHeight: '1.5rem',
      badgePaddingInline: 'var(--ui-space-2)',
      buttonHeightSm: '1.875rem',
      buttonHeightMd: '2.25rem',
      buttonHeightLg: '2.625rem',
      buttonPaddingInlineSm: 'var(--ui-space-2)',
      buttonPaddingInlineMd: 'var(--ui-space-3)',
      buttonPaddingInlineLg: 'var(--ui-space-4)',
      cardPadding: 'var(--ui-space-4)',
      dialogGap: 'var(--ui-space-3)',
      dialogPadding: 'var(--ui-space-5)',
      emptyStateGap: 'var(--ui-space-3)',
      fieldGap: 'var(--ui-space-1)',
      inputMinHeight: '2.375rem',
      inputPaddingBlock: '0.5rem',
      tabsListPadding: 'var(--ui-space-1)',
      tabsPanelPaddingBlock: 'var(--ui-space-3)',
      tabsTriggerHeight: '2rem',
      tabsTriggerPaddingInline: 'var(--ui-space-3)',
    }),
    comfortable: createDensityOverride({
      badgeHeight: '1.875rem',
      badgePaddingInline: 'var(--ui-space-4)',
      buttonHeightSm: '2.125rem',
      buttonHeightMd: '2.75rem',
      buttonHeightLg: '3.25rem',
      buttonPaddingInlineSm: 'var(--ui-space-3)',
      buttonPaddingInlineMd: 'var(--ui-space-5)',
      buttonPaddingInlineLg: 'var(--ui-space-6)',
      cardPadding: 'var(--ui-space-8)',
      dialogGap: 'var(--ui-space-4)',
      dialogPadding: 'var(--ui-space-8)',
      emptyStateGap: 'var(--ui-space-5)',
      fieldGap: 'var(--ui-space-3)',
      inputMinHeight: '3rem',
      inputPaddingBlock: '0.75rem',
      tabsListPadding: 'var(--ui-space-2)',
      tabsPanelPaddingBlock: 'var(--ui-space-5)',
      tabsTriggerHeight: '2.75rem',
      tabsTriggerPaddingInline: 'var(--ui-space-5)',
    }),
  },
  belovodye: {
    compact: createDensityOverride({
      badgeHeight: '1.5rem',
      badgePaddingInline: 'var(--ui-space-2)',
      buttonHeightSm: '1.875rem',
      buttonHeightMd: '2.25rem',
      buttonHeightLg: '2.625rem',
      buttonPaddingInlineSm: 'var(--ui-space-2)',
      buttonPaddingInlineMd: 'var(--ui-space-3)',
      buttonPaddingInlineLg: 'var(--ui-space-4)',
      cardPadding: 'var(--ui-space-4)',
      dialogGap: 'var(--ui-space-3)',
      dialogPadding: 'var(--ui-space-5)',
      emptyStateGap: 'var(--ui-space-3)',
      fieldGap: 'var(--ui-space-1)',
      inputMinHeight: '2.375rem',
      inputPaddingBlock: '0.5rem',
      tabsListPadding: 'var(--ui-space-1)',
      tabsPanelPaddingBlock: 'var(--ui-space-3)',
      tabsTriggerHeight: '2rem',
      tabsTriggerPaddingInline: 'var(--ui-space-3)',
    }),
    comfortable: createDensityOverride({
      badgeHeight: '1.875rem',
      badgePaddingInline: 'var(--ui-space-4)',
      buttonHeightSm: '2.125rem',
      buttonHeightMd: '2.75rem',
      buttonHeightLg: '3.25rem',
      buttonPaddingInlineSm: 'var(--ui-space-3)',
      buttonPaddingInlineMd: 'var(--ui-space-5)',
      buttonPaddingInlineLg: 'var(--ui-space-6)',
      cardPadding: 'var(--ui-space-8)',
      dialogGap: 'var(--ui-space-4)',
      dialogPadding: 'var(--ui-space-8)',
      emptyStateGap: 'var(--ui-space-5)',
      fieldGap: 'var(--ui-space-3)',
      inputMinHeight: '3rem',
      inputPaddingBlock: '0.75rem',
      tabsListPadding: 'var(--ui-space-2)',
      tabsPanelPaddingBlock: 'var(--ui-space-5)',
      tabsTriggerHeight: '2.75rem',
      tabsTriggerPaddingInline: 'var(--ui-space-5)',
    }),
  },
} satisfies Record<ThemeName, ThemeCapabilityOverrides['density']>);

const themeMotionProfileOverrides = Object.freeze({
  light: {
    calm: createMotionProfileOverride({
      collapseOpacityFactor: '0.65',
      durationSm: '190ms',
      durationMd: '240ms',
      durationLg: '300ms',
      durationXl: '380ms',
      feedbackShadowStrong:
        '0 12px 30px color-mix(in srgb, var(--ui-border-focus) 14%, transparent)',
      overlayEasing: 'var(--ui-motion-easing-decelerate)',
      scale102: '1.015',
      scale104: '1.03',
      stepDistanceXs: '1px',
      stepDistanceSm: '3px',
    }),
    expressive: createMotionProfileOverride({
      collapseOpacityFactor: '0.92',
      durationSm: '140ms',
      durationMd: '180ms',
      durationLg: '220ms',
      durationXl: '300ms',
      feedbackShadowStrong:
        '0 18px 46px color-mix(in srgb, var(--ui-border-focus) 22%, transparent)',
      overlayEasing: 'var(--ui-motion-easing-emphasized)',
      scale102: '1.03',
      scale104: '1.06',
      stepDistanceXs: '3px',
      stepDistanceSm: '6px',
    }),
  },
  dark: {
    calm: createMotionProfileOverride({
      collapseOpacityFactor: '0.65',
      durationSm: '190ms',
      durationMd: '240ms',
      durationLg: '300ms',
      durationXl: '380ms',
      feedbackShadowStrong:
        '0 12px 30px color-mix(in srgb, var(--ui-border-focus) 14%, transparent)',
      overlayEasing: 'var(--ui-motion-easing-decelerate)',
      scale102: '1.015',
      scale104: '1.03',
      stepDistanceXs: '1px',
      stepDistanceSm: '3px',
    }),
    expressive: createMotionProfileOverride({
      collapseOpacityFactor: '0.92',
      durationSm: '140ms',
      durationMd: '180ms',
      durationLg: '220ms',
      durationXl: '300ms',
      feedbackShadowStrong:
        '0 18px 46px color-mix(in srgb, var(--ui-border-focus) 22%, transparent)',
      overlayEasing: 'var(--ui-motion-easing-emphasized)',
      scale102: '1.03',
      scale104: '1.06',
      stepDistanceXs: '3px',
      stepDistanceSm: '6px',
    }),
  },
  belovodye: {
    calm: createMotionProfileOverride({
      collapseOpacityFactor: '0.62',
      durationSm: '210ms',
      durationMd: '260ms',
      durationLg: '320ms',
      durationXl: '420ms',
      feedbackShadowStrong:
        '0 14px 34px color-mix(in srgb, var(--ui-border-focus) 16%, transparent)',
      overlayEasing: 'var(--ui-motion-easing-decelerate)',
      scale102: '1.012',
      scale104: '1.024',
      stepDistanceXs: '1px',
      stepDistanceSm: '2px',
    }),
    expressive: createMotionProfileOverride({
      collapseOpacityFactor: '0.9',
      durationSm: '150ms',
      durationMd: '190ms',
      durationLg: '230ms',
      durationXl: '310ms',
      feedbackShadowStrong:
        '0 18px 46px color-mix(in srgb, var(--ui-border-focus) 18%, transparent)',
      overlayEasing: 'var(--ui-motion-easing-emphasized)',
      scale102: '1.028',
      scale104: '1.055',
      stepDistanceXs: '3px',
      stepDistanceSm: '5px',
    }),
  },
} satisfies Record<ThemeName, ThemeCapabilityOverrides['motionProfile']>);

const accentedPersonalityOverrides = Object.freeze<ThemeContractPatch>({
  'button-radius': 'var(--ui-radius-pill)',
  'card-border': 'var(--ui-border-strong)',
  'card-shadow': 'var(--ui-shadow-md)',
  'dialog-border': 'var(--ui-border-focus)',
  'dialog-radius': 'var(--ui-radius-xl)',
  'empty-state-icon-surface':
    'color-mix(in srgb, var(--ui-surface-brand-soft) 82%, var(--ui-surface-default))',
  'input-radius': 'var(--ui-radius-lg)',
  'tabs-list-border': 'var(--ui-border-strong)',
  'tabs-list-radius': 'var(--ui-radius-xl)',
  'tabs-trigger-bg-active':
    'color-mix(in srgb, var(--ui-surface-brand-soft) 58%, var(--ui-surface-default))',
  'text-font-feature-settings-display': '"kern" 1, "liga" 1, "ss01" 1, "ss02" 1',
  'text-letter-spacing-display': '-0.02em',
  'text-letter-spacing-label': '0.08em',
  'text-transform-label': 'var(--ui-text-transform-label)',
});

const themePersonalityOverrides = Object.freeze({
  light: {
    accented: accentedPersonalityOverrides,
  },
  dark: {
    accented: {
      ...accentedPersonalityOverrides,
      'card-shadow': 'var(--ui-shadow-lg)',
      'tabs-trigger-bg-active':
        'color-mix(in srgb, var(--ui-surface-brand-soft) 72%, var(--ui-surface-default))',
    },
  },
  belovodye: {
    accented: {
      ...accentedPersonalityOverrides,
      'card-shadow': 'var(--ui-shadow-lg)',
      'dialog-border': 'color-mix(in srgb, var(--ui-border-focus) 72%, var(--ui-border-strong))',
      'text-letter-spacing-label': '0.1em',
    },
  },
} satisfies Record<ThemeName, ThemeCapabilityOverrides['personality']>);

const sharedResponsiveOverrides = Object.freeze<ThemeResponsiveOverrides>({
  md: createResponsiveOverride({
    cardPadding: 'var(--ui-space-6)',
    dialogPadding: 'var(--ui-space-6)',
    dialogWidth: '42rem',
    emptyStateGap: 'var(--ui-space-5)',
    emptyStateIconSize: '3.25rem',
    textFontSizeLg: '1.1875rem',
  }),
  lg: createResponsiveOverride({
    buttonHeightLg: '3.25rem',
    cardPadding: 'var(--ui-space-8)',
    dialogPadding: 'var(--ui-space-8)',
    dialogWidth: '48rem',
    emptyStateGap: 'var(--ui-space-6)',
    emptyStateIconSize: '3.5rem',
    textFontSizeLg: '1.3125rem',
  }),
});

export const THEME_CAPABILITY_MATRIX = Object.freeze<ThemeCapabilityMatrix>({
  foundations: ['text-primary', 'surface-default', 'border-focus', 'action-primary-bg'],
  componentStyles: [
    'button-radius',
    'card-shadow',
    'input-radius',
    'dialog-radius',
    'tabs-list-radius',
    'tabs-trigger-bg-active',
  ],
  personality: [
    'button-radius',
    'card-shadow',
    'dialog-border',
    'text-letter-spacing-label',
    'text-font-feature-settings-display',
  ],
  systems: ['data-grid-surface', 'chart-series-1', 'graph-node-surface'],
  density: [
    'button-height-sm',
    'button-height-md',
    'input-min-height',
    'card-padding',
    'dialog-padding',
    'tabs-trigger-height',
  ],
  typography: [
    'text-letter-spacing-body',
    'text-letter-spacing-label',
    'text-letter-spacing-display',
    'text-transform-label',
    'text-font-feature-settings-body',
    'text-font-smoothing-webkit',
  ],
  motion: [
    'motion-duration-sm',
    'motion-duration-md',
    'motion-distance-sm',
    'motion-scale-102',
    'motion-overlay-easing',
    'motion-collapse-opacity-duration-factor',
  ],
  responsive: {
    breakpoints: THEME_RESPONSIVE_BREAKPOINTS,
    tokens: ['dialog-width', 'card-padding', 'button-height-lg', 'text-font-size-lg'],
  },
  runtime: {
    writableAttributes: [
      'data-ui-theme',
      'data-ui-density',
      'data-ui-motion-profile',
      'data-ui-personality',
    ],
    derivedAttributes: ['data-ui-theme-type'],
  },
});

export function getThemeRuntimeDefaults(_themeName: ThemeName): ThemeRuntimeOptions {
  return DEFAULT_THEME_RUNTIME_OPTIONS;
}

export function getThemeCapabilityOverrides(themeName: ThemeName): ThemeCapabilityOverrides {
  return {
    density: themeDensityOverrides[themeName],
    motionProfile: themeMotionProfileOverrides[themeName],
    personality: themePersonalityOverrides[themeName],
    responsive: sharedResponsiveOverrides,
  };
}

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
  THEME_NAMES.reduce<Record<ThemeName, ThemeDefinition>>(
    (accumulator, themeName) => {
      const definition = themeDefinitions[themeName];
      accumulator[themeName] = Object.freeze({
        name: themeName,
        label: definition.label,
        type: definition.type,
        tokens: definition.tokens,
      });
      return accumulator;
    },
    {} as Record<ThemeName, ThemeDefinition>
  )
);

export const THEME_LABELS = Object.freeze(
  THEME_NAMES.reduce<Record<ThemeName, string>>(
    (accumulator, themeName) => {
      accumulator[themeName] = THEMES[themeName].label;
      return accumulator;
    },
    {} as Record<ThemeName, string>
  )
);

export const themeRegistry = Object.freeze(
  THEME_NAMES.reduce<Record<ThemeName, ThemeContract>>(
    (accumulator, themeName) => {
      accumulator[themeName] = THEMES[themeName].tokens;
      return accumulator;
    },
    {} as Record<ThemeName, ThemeContract>
  )
);

export function getThemeMeta(themeName: ThemeName): ThemeMeta {
  const theme = THEMES[themeName];
  return {
    name: theme.name,
    label: theme.label,
    type: theme.type,
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
