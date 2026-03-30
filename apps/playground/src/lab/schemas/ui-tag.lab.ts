import { UiTag } from '@ww/core';

import type { LabSurfaceDefinition } from '../manifest/component-lab.types';
import { createSimpleSurfaceDefinition } from '../runtime/simple-surface-factory';
import { createIconSlot, createSimpleMatrix } from '../runtime/schema-helpers';

type UiTagLabState = {
  label: string;
  variant: 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info';
  appearance: 'soft' | 'outline' | 'solid';
  size: 'sm' | 'md' | 'lg';
  closable: boolean;
  clickable: boolean;
  disabled: boolean;
  rounded: boolean;
  ellipsis: boolean;
  icon: boolean;
  matrixVariants: readonly string[];
  matrixAppearances: readonly string[];
};

const tagVariantOptions = [
  { label: 'Neutral', value: 'neutral' },
  { label: 'Brand', value: 'brand' },
  { label: 'Success', value: 'success' },
  { label: 'Warning', value: 'warning' },
  { label: 'Danger', value: 'danger' },
  { label: 'Info', value: 'info' },
] as const;

const tagAppearanceOptions = [
  { label: 'Soft', value: 'soft' },
  { label: 'Outline', value: 'outline' },
  { label: 'Solid', value: 'solid' },
] as const;

const tagSizeOptions = [
  { label: 'Small', value: 'sm' },
  { label: 'Medium', value: 'md' },
  { label: 'Large', value: 'lg' },
] as const;

const defaultState: Readonly<UiTagLabState> = Object.freeze({
  label: 'Pinned release',
  variant: 'brand',
  appearance: 'soft',
  size: 'md',
  closable: false,
  clickable: false,
  disabled: false,
  rounded: true,
  ellipsis: false,
  icon: false,
  matrixVariants: ['neutral', 'brand', 'success', 'warning', 'danger', 'info'],
  matrixAppearances: ['soft', 'outline'],
});

const definition: LabSurfaceDefinition<UiTagLabState> = createSimpleSurfaceDefinition({
  id: 'ui-tag',
  title: 'UiTag',
  description: 'Compact display primitive for statuses, filters, and removable pills.',
  packageName: '@ww/core',
  exportName: 'UiTag',
  defaultState,
  controlSections: [
    {
      id: 'content',
      title: 'Content',
      controls: [
        { id: 'label', kind: 'text', label: 'Label' },
        { id: 'icon', kind: 'boolean', label: 'Icon' },
      ],
    },
    {
      id: 'variants',
      title: 'Variants',
      controls: [
        { id: 'variant', kind: 'segment', label: 'Variant', options: tagVariantOptions },
        {
          id: 'appearance',
          kind: 'segment',
          label: 'Appearance',
          options: tagAppearanceOptions,
        },
        { id: 'size', kind: 'segment', label: 'Size', options: tagSizeOptions },
      ],
    },
    {
      id: 'states',
      title: 'States',
      controls: [
        { id: 'closable', kind: 'boolean', label: 'Closable' },
        { id: 'clickable', kind: 'boolean', label: 'Clickable' },
        { id: 'disabled', kind: 'boolean', label: 'Disabled' },
        { id: 'rounded', kind: 'boolean', label: 'Rounded' },
        { id: 'ellipsis', kind: 'boolean', label: 'Ellipsis' },
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
          options: tagVariantOptions,
          enableAllLabel: 'Enable all',
          disableAllLabel: 'Clear',
        },
        {
          id: 'matrixAppearances',
          kind: 'multi-toggle',
          label: 'Appearances',
          options: tagAppearanceOptions,
          enableAllLabel: 'Enable all',
          disableAllLabel: 'Clear',
        },
      ],
    },
  ],
  buildMatrixItems: (state) =>
    createSimpleMatrix(state.matrixVariants, state.matrixAppearances, (variant, appearance) => ({
      variant: variant as UiTagLabState['variant'],
      appearance: appearance as UiTagLabState['appearance'],
      clickable: false,
      closable: false,
      disabled: false,
      icon: false,
    })),
  component: UiTag,
  buildComponentProps: (state) => ({
    label: state.label,
    variant: state.variant,
    appearance: state.appearance,
    size: state.size,
    closable: state.closable,
    clickable: state.clickable,
    disabled: state.disabled,
    rounded: state.rounded,
    ellipsis: state.ellipsis,
  }),
  buildPreviewSlots: (state) => ({
    ...(state.icon ? { icon: createIconSlot('⌘') } : {}),
  }),
  buildSnippetProps: (state) => ({
    ...(state.label ? { label: state.label } : {}),
    ...(state.variant !== 'neutral' ? { variant: state.variant } : {}),
    ...(state.appearance !== 'soft' ? { appearance: state.appearance } : {}),
    ...(state.size !== 'md' ? { size: state.size } : {}),
    ...(state.closable ? { closable: true } : {}),
    ...(state.clickable ? { clickable: true } : {}),
    ...(state.disabled ? { disabled: true } : {}),
    ...(state.rounded === false ? { rounded: false } : {}),
    ...(state.ellipsis ? { ellipsis: true } : {}),
  }),
  buildSnippetSlots: (state) => [
    ...(state.icon ? [{ name: 'icon', content: () => '⌘' }] : []),
    ...(state.label ? [] : [{ content: () => 'Tag' }]),
  ],
});

export default definition;
