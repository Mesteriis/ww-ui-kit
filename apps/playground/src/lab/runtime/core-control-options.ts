import type { LabOption } from '../manifest/component-lab.types';

export const buttonVariantOptions = Object.freeze([
  { label: 'Primary', value: 'primary' },
  { label: 'Secondary', value: 'secondary' },
  { label: 'Ghost', value: 'ghost' },
  { label: 'Danger', value: 'danger' },
] satisfies readonly LabOption[]);

export const buttonToneOptions = Object.freeze([
  { label: 'Auto', value: 'auto' },
  { label: 'Neutral', value: 'neutral' },
  { label: 'Brand', value: 'brand' },
  { label: 'Info', value: 'info' },
  { label: 'Success', value: 'success' },
  { label: 'Warning', value: 'warning' },
  { label: 'Danger', value: 'danger' },
  { label: 'Critical', value: 'critical' },
] satisfies readonly LabOption[]);

export const buttonAppearanceOptions = Object.freeze([
  { label: 'Auto', value: 'auto' },
  { label: 'Solid', value: 'solid' },
  { label: 'Outline', value: 'outline' },
  { label: 'Ghost', value: 'ghost' },
] satisfies readonly LabOption[]);

export const buttonEffectOptions = Object.freeze([
  { label: 'None', value: 'none' },
  { label: 'Border flow', value: 'border-flow' },
  { label: 'Color shift', value: 'color-shift' },
] satisfies readonly LabOption[]);

export const buttonSizeOptions = Object.freeze([
  { label: 'Small', value: 'sm' },
  { label: 'Medium', value: 'md' },
  { label: 'Large', value: 'lg' },
] satisfies readonly LabOption[]);

export const fieldStateOptions = Object.freeze([
  { label: 'Default', value: 'default' },
  { label: 'Invalid', value: 'invalid' },
  { label: 'Disabled', value: 'disabled' },
] satisfies readonly LabOption[]);

export const badgeVariantOptions = Object.freeze([
  { label: 'Neutral', value: 'neutral' },
  { label: 'Brand', value: 'brand' },
  { label: 'Success', value: 'success' },
  { label: 'Warning', value: 'warning' },
  { label: 'Danger', value: 'danger' },
] satisfies readonly LabOption[]);

export const overlaySideOptions = Object.freeze([
  { label: 'Left', value: 'left' },
  { label: 'Right', value: 'right' },
] satisfies readonly LabOption[]);

export const tabsOrientationOptions = Object.freeze([
  { label: 'Horizontal', value: 'horizontal' },
  { label: 'Vertical', value: 'vertical' },
] satisfies readonly LabOption[]);
