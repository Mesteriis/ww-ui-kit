import { UiIconButton } from '@ww/core';

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

type UiIconButtonLabState = {
  ariaLabel: string;
  iconGlyph: string;
  variant: 'primary' | 'secondary' | 'ghost' | 'danger';
  tone: 'auto' | 'neutral' | 'brand' | 'info' | 'success' | 'warning' | 'danger' | 'critical';
  appearance: 'auto' | 'solid' | 'outline' | 'ghost';
  effect: 'none' | 'border-flow' | 'color-shift';
  size: 'sm' | 'md' | 'lg';
  disabled: boolean;
  loading: boolean;
  matrixVariants: readonly string[];
  matrixStates: readonly string[];
};

const matrixStateOptions = [
  { label: 'Default', value: 'default' },
  { label: 'Disabled', value: 'disabled' },
  { label: 'Loading', value: 'loading' },
] as const;

const defaultState: Readonly<UiIconButtonLabState> = Object.freeze({
  ariaLabel: 'Open inspector',
  iconGlyph: '☰',
  variant: 'ghost',
  tone: 'auto',
  appearance: 'auto',
  effect: 'none',
  size: 'md',
  disabled: false,
  loading: false,
  matrixVariants: ['ghost', 'secondary', 'danger'],
  matrixStates: ['default', 'disabled', 'loading'],
});

const definition: LabSurfaceDefinition<UiIconButtonLabState> = createSimpleSurfaceDefinition({
  id: 'ui-icon-button',
  title: 'UiIconButton',
  description: 'Compact icon-first action surface for toolbars and inspectors.',
  packageName: '@ww/core',
  exportName: 'UiIconButton',
  defaultState,
  controlSections: [
    {
      id: 'content',
      title: 'Content',
      controls: [
        { id: 'ariaLabel', kind: 'text', label: 'Accessible label' },
        { id: 'iconGlyph', kind: 'text', label: 'Icon glyph' },
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
      variant: variant as UiIconButtonLabState['variant'],
      disabled: matrixState === 'disabled',
      loading: matrixState === 'loading',
    })),
  component: UiIconButton,
  buildComponentProps: (state) => ({
    ariaLabel: state.ariaLabel,
    variant: state.variant,
    ...(state.tone !== 'auto' ? { tone: state.tone } : {}),
    ...(state.appearance !== 'auto' ? { appearance: state.appearance } : {}),
    effect: state.effect,
    size: state.size,
    disabled: state.disabled,
    loading: state.loading,
  }),
  buildPreviewSlots: (state) => ({
    default: createIconSlot(state.iconGlyph),
  }),
  buildSnippetProps: (state) => ({
    ariaLabel: state.ariaLabel,
    variant: state.variant,
    ...(state.tone !== 'auto' ? { tone: state.tone } : {}),
    ...(state.appearance !== 'auto' ? { appearance: state.appearance } : {}),
    ...(state.effect !== 'none' ? { effect: state.effect } : {}),
    ...(state.size !== 'md' ? { size: state.size } : {}),
    ...(state.disabled ? { disabled: true } : {}),
    ...(state.loading ? { loading: true } : {}),
  }),
  buildSnippetSlots: (state) => [
    {
      content: () => state.iconGlyph,
    },
  ],
});

export default definition;
