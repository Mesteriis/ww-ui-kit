import { UiButton } from '@ww/core';

import type { LabSurfaceDefinition } from '../manifest/component-lab.types';
import {
  buttonAppearanceOptions,
  buttonEffectOptions,
  buttonSizeOptions,
  buttonToneOptions,
  buttonVariantOptions,
} from '../runtime/core-control-options';
import { createIconSlot, createSimpleMatrix } from '../runtime/schema-helpers';
import { createSimpleSurfaceDefinition } from '../runtime/simple-surface-factory';

type UiButtonLabState = {
  label: string;
  variant: 'primary' | 'secondary' | 'ghost' | 'danger';
  tone: 'auto' | 'neutral' | 'brand' | 'info' | 'success' | 'warning' | 'danger' | 'critical';
  appearance: 'auto' | 'solid' | 'outline' | 'ghost';
  effect: 'none' | 'border-flow' | 'color-shift';
  size: 'sm' | 'md' | 'lg';
  disabled: boolean;
  loading: boolean;
  block: boolean;
  leftIcon: boolean;
  rightIcon: boolean;
  matrixVariants: readonly string[];
  matrixStates: readonly string[];
};

const matrixStateOptions = [
  { label: 'Default', value: 'default' },
  { label: 'Disabled', value: 'disabled' },
  { label: 'Loading', value: 'loading' },
] as const;

const defaultState: Readonly<UiButtonLabState> = Object.freeze({
  label: 'Launch release',
  variant: 'primary',
  tone: 'auto',
  appearance: 'auto',
  effect: 'none',
  size: 'md',
  disabled: false,
  loading: false,
  block: false,
  leftIcon: false,
  rightIcon: false,
  matrixVariants: ['primary', 'secondary', 'ghost', 'danger'],
  matrixStates: ['default', 'disabled', 'loading'],
});

const definition: LabSurfaceDefinition<UiButtonLabState> = createSimpleSurfaceDefinition({
  id: 'ui-button',
  title: 'UiButton',
  description: 'Canonical action surface for the core layer.',
  packageName: '@ww/core',
  exportName: 'UiButton',
  defaultState,
  controlSections: [
    {
      id: 'content',
      title: 'Content',
      controls: [
        { id: 'label', kind: 'text', label: 'Label' },
        { id: 'leftIcon', kind: 'boolean', label: 'Left icon' },
        { id: 'rightIcon', kind: 'boolean', label: 'Right icon' },
      ],
    },
    {
      id: 'variants',
      title: 'Variants',
      controls: [
        { id: 'variant', kind: 'segment', label: 'Variant', options: buttonVariantOptions },
        { id: 'tone', kind: 'select', label: 'Tone override', options: buttonToneOptions },
        {
          id: 'appearance',
          kind: 'segment',
          label: 'Appearance override',
          options: buttonAppearanceOptions,
        },
        { id: 'effect', kind: 'segment', label: 'Effect', options: buttonEffectOptions },
        { id: 'size', kind: 'segment', label: 'Size', options: buttonSizeOptions },
      ],
    },
    {
      id: 'states',
      title: 'States',
      controls: [
        { id: 'disabled', kind: 'boolean', label: 'Disabled' },
        { id: 'loading', kind: 'boolean', label: 'Loading' },
        { id: 'block', kind: 'boolean', label: 'Block width' },
      ],
    },
    {
      id: 'matrix',
      title: 'Matrix filters',
      controls: [
        {
          id: 'matrixVariants',
          kind: 'multi-toggle',
          label: 'Variants',
          options: buttonVariantOptions,
          enableAllLabel: 'Enable all',
          disableAllLabel: 'Clear',
        },
        {
          id: 'matrixStates',
          kind: 'multi-toggle',
          label: 'States',
          options: matrixStateOptions,
          enableAllLabel: 'Enable all',
          disableAllLabel: 'Clear',
        },
      ],
    },
  ],
  buildMatrixItems: (state) =>
    createSimpleMatrix(state.matrixVariants, state.matrixStates, (variant, matrixState) => ({
      variant: variant as UiButtonLabState['variant'],
      disabled: matrixState === 'disabled',
      loading: matrixState === 'loading',
    })),
  component: UiButton,
  buildComponentProps: (state) => ({
    variant: state.variant,
    ...(state.tone !== 'auto' ? { tone: state.tone } : {}),
    ...(state.appearance !== 'auto' ? { appearance: state.appearance } : {}),
    effect: state.effect,
    size: state.size,
    disabled: state.disabled,
    loading: state.loading,
    block: state.block,
  }),
  buildPreviewSlots: (state) => ({
    default: () => state.label,
    ...(state.leftIcon ? { leftIcon: createIconSlot('←') } : {}),
    ...(state.rightIcon ? { rightIcon: createIconSlot('→') } : {}),
  }),
  buildSnippetProps: (state) => ({
    variant: state.variant,
    ...(state.tone !== 'auto' ? { tone: state.tone } : {}),
    ...(state.appearance !== 'auto' ? { appearance: state.appearance } : {}),
    ...(state.effect !== 'none' ? { effect: state.effect } : {}),
    ...(state.size !== 'md' ? { size: state.size } : {}),
    ...(state.disabled ? { disabled: true } : {}),
    ...(state.loading ? { loading: true } : {}),
    ...(state.block ? { block: true } : {}),
  }),
  buildSnippetSlots: (state) => [
    ...(state.leftIcon ? [{ name: 'leftIcon', content: () => '←' }] : []),
    {
      content: () => state.label,
    },
    ...(state.rightIcon ? [{ name: 'rightIcon', content: () => '→' }] : []),
  ],
});

export default definition;
