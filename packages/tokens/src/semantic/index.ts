import { createCssVariableMap, type ThemeTokenMap } from '../contracts';

export const themeSemanticTokenNames = [
  'text-primary',
  'text-secondary',
  'text-muted',
  'text-inverse',
  'text-danger',
  'text-success',
  'text-warning',
  'text-font-family',
  'text-font-size-body',
  'text-font-size-sm',
  'text-font-size-lg',
  'text-line-height-body',
  'surface-canvas',
  'surface-sunken',
  'surface-default',
  'surface-raised',
  'surface-overlay',
  'surface-brand-soft',
  'surface-success-soft',
  'surface-warning-soft',
  'surface-danger-soft',
  'border-subtle',
  'border-strong',
  'border-danger',
  'border-focus',
  'action-primary-bg',
  'action-primary-bg-hover',
  'action-primary-bg-active',
  'action-primary-fg',
  'action-secondary-bg',
  'action-secondary-bg-hover',
  'action-secondary-bg-active',
  'action-secondary-fg',
  'action-ghost-bg-hover',
  'action-ghost-bg-active',
  'action-ghost-fg',
  'action-danger-bg',
  'action-danger-bg-hover',
  'action-danger-bg-active',
  'action-danger-fg',
  'focus-ring',
  'focus-ring-offset',
  'state-disabled-opacity',
  'state-loading-opacity',
  'overlay-backdrop',
  'overlay-backdrop-strong',
] as const;

export const foundationSemanticTokenNames = [
  'motion-focus-ring-duration',
  'motion-focus-ring-easing',
  'motion-focus-ring-shadow-soft',
  'motion-focus-ring-shadow-strong',
  'motion-focus-ring-shadow-invalid',
  'motion-feedback-shadow-soft',
  'motion-feedback-shadow-strong',
  'motion-feedback-glow-soft',
  'motion-feedback-glow-accent',
  'motion-overlay-backdrop-duration',
  'motion-overlay-surface-duration',
  'motion-overlay-easing',
  'motion-transition-color-fast',
  'motion-transition-transform-fast',
  'motion-transition-transform-color-fast',
  'motion-transition-transform-opacity',
  'motion-transition-focus-ring',
  'motion-transition-surface-lift-xs',
  'motion-transition-surface-lift-sm',
  'motion-transition-overlay',
  'motion-transition-toggle-thumb',
  'elevation-surface-soft',
  'elevation-surface-raised',
  'elevation-overlay',
  'glow-accent-soft',
  'glow-accent-ambient',
] as const;

export const semanticTokenNames = [
  ...themeSemanticTokenNames,
  ...foundationSemanticTokenNames,
] as const;

export type ThemeSemanticTokenName = (typeof themeSemanticTokenNames)[number];
export type FoundationSemanticTokenName = (typeof foundationSemanticTokenNames)[number];
export type SemanticTokenName = (typeof semanticTokenNames)[number];

export const foundationSemanticTokenValues: ThemeTokenMap<FoundationSemanticTokenName> = {
  'motion-focus-ring-duration': 'var(--ui-motion-duration-xs)',
  'motion-focus-ring-easing': 'var(--ui-motion-easing-standard)',
  'motion-focus-ring-shadow-soft': '0 0 0 4px var(--ui-focus-ring)',
  'motion-focus-ring-shadow-strong':
    '0 0 0 2px var(--ui-focus-ring-offset), 0 0 0 6px var(--ui-focus-ring)',
  'motion-focus-ring-shadow-invalid':
    '0 0 0 4px color-mix(in srgb, var(--ui-border-danger) 72%, transparent)',
  'motion-feedback-shadow-soft':
    '0 0 0 3px color-mix(in srgb, var(--ui-border-focus) 28%, transparent)',
  'motion-feedback-shadow-strong':
    '0 16px 40px color-mix(in srgb, var(--ui-border-focus) 18%, transparent)',
  'motion-feedback-glow-soft':
    '0 0 0 1px color-mix(in srgb, var(--ui-border-focus) 32%, transparent)',
  'motion-feedback-glow-accent':
    '0 18px 48px color-mix(in srgb, var(--ui-border-focus) 20%, transparent)',
  'motion-overlay-backdrop-duration': 'var(--ui-motion-duration-sm)',
  'motion-overlay-surface-duration': 'var(--ui-motion-duration-md)',
  'motion-overlay-easing': 'var(--ui-motion-easing-decelerate)',
  'motion-transition-color-fast':
    'color var(--ui-motion-duration-xs) var(--ui-motion-easing-standard), border-color var(--ui-motion-duration-xs) var(--ui-motion-easing-standard), background-color var(--ui-motion-duration-xs) var(--ui-motion-easing-standard), box-shadow var(--ui-motion-duration-xs) var(--ui-motion-easing-standard)',
  'motion-transition-transform-fast':
    'transform var(--ui-motion-duration-xs) var(--ui-motion-easing-standard)',
  'motion-transition-transform-color-fast':
    'transform var(--ui-motion-duration-xs) var(--ui-motion-easing-standard), color var(--ui-motion-duration-xs) var(--ui-motion-easing-standard)',
  'motion-transition-transform-opacity':
    'opacity var(--ui-motion-duration-sm) var(--ui-motion-easing-standard), transform var(--ui-motion-duration-sm) var(--ui-motion-easing-standard)',
  'motion-transition-focus-ring':
    'box-shadow var(--ui-motion-focus-ring-duration) var(--ui-motion-focus-ring-easing), border-color var(--ui-motion-focus-ring-duration) var(--ui-motion-focus-ring-easing), background-color var(--ui-motion-focus-ring-duration) var(--ui-motion-focus-ring-easing), color var(--ui-motion-focus-ring-duration) var(--ui-motion-focus-ring-easing)',
  'motion-transition-surface-lift-xs':
    'transform var(--ui-motion-duration-xs) var(--ui-motion-easing-standard), border-color var(--ui-motion-duration-xs) var(--ui-motion-easing-standard), background-color var(--ui-motion-duration-xs) var(--ui-motion-easing-standard), box-shadow var(--ui-motion-duration-xs) var(--ui-motion-easing-standard)',
  'motion-transition-surface-lift-sm':
    'transform var(--ui-motion-duration-sm) var(--ui-motion-easing-standard), border-color var(--ui-motion-duration-sm) var(--ui-motion-easing-standard), background-color var(--ui-motion-duration-sm) var(--ui-motion-easing-standard), box-shadow var(--ui-motion-duration-sm) var(--ui-motion-easing-standard)',
  'motion-transition-overlay':
    'opacity var(--ui-motion-overlay-backdrop-duration) var(--ui-motion-overlay-easing), transform var(--ui-motion-overlay-surface-duration) var(--ui-motion-overlay-easing)',
  'motion-transition-toggle-thumb':
    'transform var(--ui-motion-duration-sm) var(--ui-motion-easing-emphasized), background-color var(--ui-motion-duration-xs) var(--ui-motion-easing-standard)',
  'elevation-surface-soft': 'var(--ui-shadow-sm)',
  'elevation-surface-raised': 'var(--ui-shadow-md)',
  'elevation-overlay': 'var(--ui-shadow-xl)',
  'glow-accent-soft': '0 0 0 1px color-mix(in srgb, var(--ui-border-focus) 28%, transparent)',
  'glow-accent-ambient': '0 18px 48px color-mix(in srgb, var(--ui-border-focus) 20%, transparent)',
} as const;

export const semanticTokenVars = createCssVariableMap(semanticTokenNames);
